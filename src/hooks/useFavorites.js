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
            
            // const dataString = response.data;
            // const firstArrayEnd = dataString.indexOf(']') + 1;
            // const firstArrayString = dataString.substring(0, firstArrayEnd);

            // const favoritesData = JSON.parse(firstArrayString);

            const favoritesData = Array.isArray(response.data) ? response.data : response.data[0];

            const normalizedFavorites = favoritesData.map(fav => ({
                imdbID: fav.imdbId,
                Title: fav.title,
                Poster: fav.posterUrl,
                Year: fav.year
            }));

            setFavorites(normalizedFavorites);
        } catch (error) {
            console.error('Error in fetchFavorites:', error);
            setError('Error fetching favorites');
            setFavorites([]);
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
            // if (response.status !== 200) {
            //     setFavorites(prev => prev.filter(f => f.imdbID !== movie.imdbID));
            //     setError('Error adding to favorites');
            // } 
            if (response.status === 200) {
                await fetchFavorites();
            }
        } catch (error) {
            // setError(error?.response?.data?.message || 'Error adding to favorites');
            console.error('Error adding movie to favorites:', error);
            setFavorites(prev => prev.filter(f => f.imdbID !== movie.imdbID));
        } finally {
            setLoading(false);
        }
    };

    const removeFromFavorites = async (movie) => {
        setLoading(true);
        setError(null);
        // const previousFavorites = favorites;

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
            // if (response.status !== 200) {
            //     // setFavorites(previousFavorites);
            //     setFavorites(prev => [...prev, movie]);
            //     setError('Error removing from favorites');
            // } 
            if (response.status === 200) {
                await fetchFavorites();
            }
        } catch (error) {
            // setFavorites(previousFavorites);
            console.error('Error removing movie from favorites:', error);
            setFavorites(prev => [...prev, movie]);
            // setError(error?.response?.data?.message || 'Error removing from favorites');
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