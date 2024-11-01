import React from 'react';
import MovieCard from "./MovieCard";

const Movies = ({movies}) => {
    return (
        <div className="container">
            {movies.map((movie, index) => (
                <MovieCard
                    movie={movie}
                    key={index}
                />
            ))}
        </div>
    );
}

export default Movies;