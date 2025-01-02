import React, {useState} from 'react';
import MovieCard from "./MovieCard";

const Movies = ({movies}) => {
    const [favoritedMovies, setFavoritedMovies] = useState([]);

    const toggleFavorite = (movie) => {
        setFavoritedMovies((prevFavorited) => {
            const isAlreadyFavorited = prevFavorited.some((m) => m.imdbID === movie.imdbID);

            if (isAlreadyFavorited) {
                // Remove from favorites
                return prevFavorited.filter((m) => m.imdbID !== movie.imdbID);
            } else {
                // Add to favorites
                return [...prevFavorited, movie];
            }
        });
    };

    return (
        <div className="container">
            {movies.map((movie, index) => {
                const isFavorited = favoritedMovies.some((m) => m.imdbID === movie.imdbID);
                return (
                    <MovieCard
                        movie={movie}
                        key={index}
                        onToggleFavorite={toggleFavorite}
                        isFavorited={isFavorited}
                    />
                );
            })}
        </div>
    );
}

export default Movies;