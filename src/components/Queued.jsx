import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useQueued from '../hooks/useQueued';

const Queued = () => {
    const { queued, loading } = useQueued();

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
            <div className="queued">
                <h2>Queue</h2>
                <div className="movie-list">
                    {queued.length > 0 ? (
                        <MovieList 
                            movies={queued} 
                            showQueued={true} 
                            showWatched={true} 
                            showFavorites={true}
                        />
                    ) : (
                        <p>You have no queued movies yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Queued;