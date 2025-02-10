import React from 'react';
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import MovieList from './MovieList';
import useRecommended from '../hooks/useRecommended';
import useCurrentUser from '../hooks/useCurrentUser';

const Recommended = () => {
    const { recommended, loading } = useRecommended();
    const { currentUser } = useCurrentUser();

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
            <div className="recommended">
                <h2>Recommended</h2>
                <div className="movie-list">
                    {recommended.length > 0 ? (
                        <MovieList 
                            movies={recommended} 
                            showRecommended={true}
                            showQueued={true}
                            showWatched={true} 
                            showFavorites={true}
                        />
                    ) : (
                        <p>You have no recommended movies yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Recommended;