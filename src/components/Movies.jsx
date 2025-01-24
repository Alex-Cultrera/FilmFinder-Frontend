import React, {useState} from 'react';
import MovieCard from "./MovieCard";
import useFavorites from '../hooks/useFavorites';

const Movies = ({movies, onToggleFavorite}) => {
    const [watchedMovies, setWatchedMovies] = useState([]);
    const { favorites } = useFavorites();

    const toggleWatch = (movie) => {
        setWatchedMovies((prevWatched) => {
            const isAlreadyWatched = prevWatched.some((m) => m.imdbID === movie.imdbID);

            if (isAlreadyWatched) {
                // Remove from watched
                return prevWatched.filter((m) => m.imdbID !== movie.imdbID);
            } else {
                // Add to watched
                return [...prevWatched, movie];
            }
        });
    };

    return (
        <div className="container">
            {movies.map((movie, index) => {
                const isFavorited = favorites.some((m) => m.imdbID === movie.imdbID);
                const isWatched = watchedMovies.some((m) => m.imdbID === movie.imdbID);
                return (
                    <MovieCard
                        movie={movie}
                        key={index}
                        onToggleFavorite={onToggleFavorite}
                        onToggleWatch={toggleWatch}
                        isFavorited={isFavorited}
                        isWatched={isWatched}
                    />
                );
            })}
        </div>
    );
}

export default Movies;