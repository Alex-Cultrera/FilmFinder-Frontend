import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useFavorites from '../hooks/useFavorites';
import useCurrentUser from '../hooks/useCurrentUser';

const Favorites = () => {
    const { favorites, loading } = useFavorites();
    const { currentUser } = useCurrentUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!currentUser) {
        return (
            <div>   
                <div className="nav-container">
                    <span className="nav">
                        <NavBar/>
                        <SessionStatus/>
                </span>
                </div>
                <div className="reviews-container">
                    <h2>Favorites</h2>
                    <div className="movie-list">
                        <p>Please log in to view your favorites list.</p>
                    </div>
                </div>
            </div>
        );
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
                            showQueued={true}
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