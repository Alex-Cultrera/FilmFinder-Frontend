import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useFavorites from '../hooks/useFavorites';

const Favorites = () => {
    const { favorites, loading } = useFavorites();

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
                <h2>Favorites</h2>
                <div className="movie-list">
                    {favorites.length > 0 ? (
                        <MovieList 
                            movies={favorites} 
                            showWatched={true} 
                            showFavorites={true}
                        />
                    ) : (
                        <p>You have no favorite movies yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Favorites;