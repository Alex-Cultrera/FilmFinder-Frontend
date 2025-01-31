import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useWatched from '../hooks/useWatched';

const Watched = () => {
    const { watched, loading } = useWatched();

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