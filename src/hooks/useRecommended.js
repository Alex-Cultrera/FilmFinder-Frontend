import { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";

const useRecommended = () => {
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const fetchRecommended = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/recommended');

            const recommendedData = Array.isArray(response.data) ? response.data : response.data[0];

            const normalizedRecommended = recommendedData.map(rec => ({
                imdbID: rec.imdbId,
                Title: rec.title,
                Poster: rec.posterUrl,
                Year: rec.year
            }));

            setRecommended(normalizedRecommended);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                setRecommended([]);
            } else {
                console.error('Error fetching recommended:', error);
                setError('Error fetching recommended');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommended();
    }, []);

    const addToRecommended = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setRecommended(prev => [...prev, {
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster,
                Year: movie.Year
            }]);

            const response = await axios.post('/addRecommended', 
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
                await fetchRecommended();
            }
        } catch (error) {
            console.error('Error adding movie to recommended:', error);
            setRecommended(prev => prev.filter(r => r.imdbID !== movie.imdbID));
        } finally {
            setLoading(false);
        }
    };

    const removeFromRecommended = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setRecommended(prev => prev.filter(r => r.imdbID !== movie.imdbID));

            const response = await axios.post('/removeRecommended',
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
                await fetchRecommended();
            }
        } catch (error) {
            console.error('Error removing movie from recommended:', error);
            setRecommended(prev => [...prev, movie]);
        } finally {
            setLoading(false);
        }
    };

    return {
        recommended,
        loading,
        error,
        addToRecommended,
        removeFromRecommended
    };
};

export default useRecommended;