import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useQueued from '../hooks/useQueued';
import useCurrentUser from '../hooks/useCurrentUser';

const Queued = () => {
    const { queued, loading } = useQueued();
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
                    <h2>Queue</h2>
                    <div className="movie-list">
                        <p>Please log in to view your queue.</p>
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
                        <p>You have not queued any movies yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Queued;