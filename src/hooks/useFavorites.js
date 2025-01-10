import { useState, useEffect } from 'react';
import axios from 'axios';
import {getCookieValue} from "../App";

const useFavorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFavorites = async () => {
            setLoading(true);
            setError(null);
            const token = getCookieValue('accessToken');
            try {
                const response = await axios.get(
                    'http://localhost:8080/api/auth/favorites',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        },
                        withCredentials: true,
                        }
                );
                if (response.status === 200) {
                    setFavorites(response.data);
                } else {
                    setError('Error fetching favorites');
                }
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
        const token = getCookieValue('accessToken');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/addFavorite',
            {
                imdbId: movie.imdbID,
                title: movie.Title,
                poster: movie.Poster,
                year: movie.Year,
                type: movie.Type,
                },
        {
                headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                withCredentials: true,
                }
                );
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
        const token = getCookieValue('accessToken');
        try {
            const response = await axios.post(
                'http://localhost:8080/api/auth/removeFavorite',
                {
                imdbId: movie.imdbID
                },
        {
                headers:
                    {
                        Authorization: `Bearer ${token}`,
                    },
                withCredentials: true,
                }
                );
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