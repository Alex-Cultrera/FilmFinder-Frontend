import { useState, useEffect } from 'react';
import axios from "../api/axiosInstance";

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    '/api/auth/favorites',
                );
                console.log("Raw response data:", response.data);
                console.log("response from /api/auth/favorites: ", response);
                setFavorites(Array.isArray(response.data) ? response.data : []);
                // if (response.status === 200) {
                //     setFavorites(response.data ? response.data : []);
                // } else {
                //     setError('Error fetching favorites');
                // }
            } catch (error) {
                setError('Error fetching favorites');
                console.error('Error fetching favorites:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, []);

    const addToFavorites = async (movie) => {
        setLoading(true);
        setError(null);

        try {
            console.log("Movie being sent:", movie);

            const response = await axios.post(
                '/api/auth/addFavorite',
            {
                imdbId: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster,
                year: movie.Year,
                type: movie.Type,
            },
            );
            console.log("response from /api/auth/addFavorite: ", response);
            
            if (response.status === 200) {
                setFavorites((prevFavorites) => [...prevFavorites, movie]);
            } else {
                setError('Error adding to favorites');
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Error adding to favorites');
            console.error('Error adding movie to favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromFavorites = async (movie) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post(
                '/api/auth/removeFavorite',
                {
                imdbId: movie.imdbID
                },
                );
                console.log("response from /api/auth/removeFavorite: ", response);
            if (response.status === 200) {
                setFavorites((prevFavorites) => prevFavorites.filter((fav) => fav.imdbID !== movie.imdbID));
            } else {
                setError('Error removing from favorites');
            }
        } catch (error) {
            setError(error?.response?.data?.message || 'Error removing from favorites');
            console.error('Error removing movie from favorites:', error);
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