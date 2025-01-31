import { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";

const useWatched = () => {
    const [watched, setWatched] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const fetchWatched = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/watched');

            const watchedData = Array.isArray(response.data) ? response.data : response.data[0];

            const normalizedWatched = watchedData.map(watched => ({
                imdbID: watched.imdbId,
                Title: watched.title,
                Poster: watched.posterUrl,
                Year: watched.year
            }));

            setWatched(normalizedWatched);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                setWatched([]);
            } else {
                console.error('Error fetching watched:', error);
                setError('Error fetching watched');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWatched();
    }, []);

    const addToWatched = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setWatched(prev => [...prev, {
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster,
                Year: movie.Year
            }]);

            const response = await axios.post('/addWatched', 
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
                await fetchWatched();
            }
        } catch (error) {
            console.error('Error adding movie to watched:', error);
            setWatched(prev => prev.filter(w => w.imdbID !== movie.imdbID));
        } finally {
            setLoading(false);
        }
    };

    const removeFromWatched = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setWatched(prev => prev.filter(w => w.imdbID !== movie.imdbID));

            const response = await axios.post('/removeWatched',
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
                await fetchWatched();
            }
        } catch (error) {
            console.error('Error removing movie from watched:', error);
            setWatched(prev => [...prev, movie]);
        } finally {
            setLoading(false);
        }
    };

    return {
        watched,
        loading,
        error,
        addToWatched,
        removeFromWatched
    };
};

export default useWatched;