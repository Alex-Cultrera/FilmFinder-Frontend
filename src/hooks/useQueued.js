import { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";

const useQueued = () => {
    const [queued, setQueued] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const fetchQueued = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/queued');

            const queuedData = Array.isArray(response.data) ? response.data : response.data[0];

            const normalizedQueued = queuedData.map(queued => ({
                imdbID: queued.imdbId,
                Title: queued.title,
                Poster: queued.posterUrl,
                Year: queued.year
            }));

            setQueued(normalizedQueued);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                setQueued([]);
            } else {
                console.error('Error fetching queued:', error);
                setError('Error fetching queued');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueued();
    }, []);

    const addToQueued = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setQueued(prev => [...prev, {
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster,
                Year: movie.Year
            }]);

            const response = await axios.post('/addQueued', 
            {
                imdbId: movie.imdbID,
                title: movie.Title,
                posterUrl: movie.Poster,
                year: movie.Year,
                type: movie.Type,
            },
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            );
            if (response.status === 200) {
                await fetchQueued();
            }
        } catch (error) {
            console.error('Error adding movie to queued:', error);
            setQueued(prev => prev.filter(w => w.imdbID !== movie.imdbID));
        } finally {
            setLoading(false);
        }
    };

    const removeFromQueued = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setQueued(prev => prev.filter(w => w.imdbID !== movie.imdbID));

            const response = await axios.post('/removeQueued',
                {
                imdbId: movie.imdbID
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            if (response.status === 200) {
                await fetchQueued();
            }
        } catch (error) {
            console.error('Error removing movie from queued:', error);
            setQueued(prev => [...prev, movie]);
        } finally {
            setLoading(false);
        }
    };

    return {
        queued,
        loading,
        error,
        addToQueued,
        removeFromQueued
    };
};

export default useQueued;