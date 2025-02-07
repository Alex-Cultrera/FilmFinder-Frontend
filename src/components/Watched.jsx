import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useWatched from '../hooks/useWatched';
import useCurrentUser from '../hooks/useCurrentUser';

const Watched = () => {
    const { watched, loading } = useWatched();
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
                    <h2>Watched</h2>
                    <div className="movie-list">
                        <p>Please log in to view your watched list.</p>
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
            <div className="watched">
                <h2>Watched</h2>
                <div className="movie-list">
                    {watched.length > 0 ? (
                        <MovieList 
                            movies={watched} 
                            showWatched={true} 
                            showFavorites={true}
                        />
                    ) : (
                        <p>You have no watched movies yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Watched;