import React from 'react';
import MovieCard from "./MovieCard";
import useRecommended from '../hooks/useRecommended';
import useQueued from '../hooks/useQueued';
import useWatched from '../hooks/useWatched';
import useFavorites from '../hooks/useFavorites';
import useCurrentUser from '../hooks/useCurrentUser';

const MovieList = ({ movies, showQueued = true, showWatched = true, showFavorites = true, showRecommended = true }) => {
    const { queued, addToQueued, removeFromQueued } = useQueued();
    const { watched, addToWatched, removeFromWatched } = useWatched();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();
    const { recommended, addToRecommended, removeFromRecommended } = useRecommended();
    const { currentUser, isAdmin } = useCurrentUser();

    const handleRecommendedToggle = async (movie) => {
        const isRecommended = recommended.some(r => r.imdbID === movie.imdbID);
        if (isRecommended) {
            await removeFromRecommended(movie);
        } else {
            await addToRecommended(movie);
        }
    };

    const handleQueuedToggle = async (movie) => {
        const isQueued = queued.some(w => w.imdbID === movie.imdbID);
        if (isQueued) {
            await removeFromQueued(movie);
        } else {
            await addToQueued(movie);
        }
    };

    const handleWatchedToggle = async (movie) => {
        const isWatched = watched.some(w => w.imdbID === movie.imdbID);
        if (isWatched) {
            await removeFromWatched(movie);
        } else {
            await addToWatched(movie);
        }
    };

    const handleFavoriteToggle = async (movie) => {
        const isFavorited = favorites.some(f => f.imdbID === movie.imdbID);
        if (isFavorited) {
            await removeFromFavorites(movie);
        } else {
            await addToFavorites(movie);
        }
    };

    return (
        <div className="container">
            {movies.map((movie) => {
                const isRecommended = recommended.some(r => r.imdbID === movie.imdbID);
                const isQueued = queued.some(w => w.imdbID === movie.imdbID);
                const isWatched = watched.some(w => w.imdbID === movie.imdbID);
                const isFavorited = favorites.some(f => f.imdbID === movie.imdbID);
                
                return (
                    <MovieCard
                        key={movie.imdbID}
                        movie={movie}
                        onToggleRecommended={showRecommended ? handleRecommendedToggle : undefined}
                        onToggleQueued={showQueued ? handleQueuedToggle : undefined}
                        onToggleWatched={showWatched ? handleWatchedToggle : undefined}
                        onToggleFavorite={showFavorites ? handleFavoriteToggle : undefined}
                        isRecommended={isRecommended}
                        isQueued={isQueued}
                        isWatched={isWatched}
                        isFavorited={isFavorited}
                    />
                );
            })}
        </div>
    );
};

export default MovieList; 