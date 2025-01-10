import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieCard from './MovieCard';
import useFavorites from '../hooks/useFavorites';

const Favorites = () => {
    const {favorites, addToFavorites, removeFromFavorites, loading, error } = useFavorites();

    const handleToggleFavorite = (movie) => {
        removeFromFavorites(movie); // If already a favorite, just remove
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
            </div>
            <div className="favorites">
                <h2>Favorites List</h2>
                <div className="movie-list">
                    {favorites.length > 0 ? (
                        favorites.map(movie => (
                            <MovieCard
                                key={movie.imdbID}
                                movie={movie}
                                isFavorited={true}
                                onToggleFavorite={() => handleToggleFavorite(movie)}
                            />
                        ))
                    ) : (
                        <p>You have no favorite movies yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Favorites;