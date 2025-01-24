import React, {useState, useEffect} from 'react';
import MovieCard from "./MovieCard";
import useFavorites from '../hooks/useFavorites';

const Movies = ({movies, onToggleFavorite, localFavorites}) => {
    const [watchedMovies, setWatchedMovies] = useState([]);
    // const [localFavorites, setLocalFavorites] = useState([]);
    // const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
    // const { favorites } = useFavorites();

    // Sync with favorites from hook
    // useEffect(() => {
    //     console.log('Favorites updated from backend:', favorites);
    //     setLocalFavorites(favorites);
    // }, [favorites]);

    const handleFavoriteToggle = async (movie) => {
        const isCurrentlyFavorited = localFavorites.has(movie.imdbID);
        await onToggleFavorite(movie);
    };

    const toggleWatch = (movie) => {
        setWatchedMovies((prevWatched) => {
            const isAlreadyWatched = prevWatched.some((m) => m.imdbID === movie.imdbID);
            if (isAlreadyWatched) {
                return prevWatched.filter((m) => m.imdbID !== movie.imdbID);
            } else {
                return [...prevWatched, movie];
            }
        });
    };

    return (
        <div className="container">
            {movies.map((movie) => {
                const isFavorited = localFavorites.has(movie.imdbID);
                const isWatched = watchedMovies.some((m) => m.imdbID === movie.imdbID);
                
                // console.log('Rendering movie:', {
                //     movieId: movie.imdbID,
                //     isFavorited,
                //     localFavoritesCount: localFavorites.length,
                //     backendFavoritesCount: favorites.length
                // });
                
                return (
                    <MovieCard
                        movie={movie}
                        key={movie.imdbID}
                        onToggleFavorite={handleFavoriteToggle}
                        onToggleWatch={toggleWatch}
                        isFavorited={isFavorited}
                        isWatched={watchedMovies.some((m) => m.imdbID === movie.imdbID)}
                    />
                );
            })}
        </div>
    );
}

export default Movies;