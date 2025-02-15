import { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    
    const fetchFavorites = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get('/favorites');

            const favoritesData = Array.isArray(response.data) ? response.data : response.data[0];

            const normalizedFavorites = favoritesData.map(fav => ({
                imdbID: fav.imdbId,
                Title: fav.title,
                Poster: fav.posterUrl,
                Year: fav.year
            }));

            setFavorites(normalizedFavorites);
        } catch (error) {
            if (error.response?.status === 401 || error.response?.status === 403) {
                setFavorites([]);
            } else {
                console.error('Error fetching favorites:', error);
                setError('Error fetching favorites');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const addToFavorites = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setFavorites(prev => [...prev, {
                imdbID: movie.imdbID,
                Title: movie.Title,
                Poster: movie.Poster,
                Year: movie.Year
            }]);

            const response = await axios.post('/addFavorite', 
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
                await fetchFavorites();
            }
        } catch (error) {
            console.error('Error adding movie to favorites:', error);
            setFavorites(prev => prev.filter(f => f.imdbID !== movie.imdbID));
        } finally {
            setLoading(false);
        }
    };

    const removeFromFavorites = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            setFavorites(prev => prev.filter(f => f.imdbID !== movie.imdbID));

            const response = await axios.post('/removeFavorite',
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
                await fetchFavorites();
            }
        } catch (error) {
            console.error('Error removing movie from favorites:', error);
            setFavorites(prev => [...prev, movie]);
        } finally {
            setLoading(false);
        }
    };

    return {
        favorites,
        loading,
        error,
        addToFavorites,
        removeFromFavorites
    };
};

export default useFavorites;