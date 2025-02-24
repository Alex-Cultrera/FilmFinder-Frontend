import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import axios from '../api/axiosInstance';
import { useParams, useNavigate } from 'react-router-dom';
import SessionStatus from "./SessionStatus";
import '../styles/MovieDetail.css';
import MovieReviews from './MovieReviews';
import useCurrentUser from '../hooks/useCurrentUser';
import MovieIcons from './MovieIcons';
import useFavorites from '../hooks/useFavorites';
import useQueued from '../hooks/useQueued';
import useWatched from '../hooks/useWatched';
import useRecommended from '../hooks/useRecommended';


const MovieDetail = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const { imdbID } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser();

    const { recommended, addToRecommended, removeFromRecommended } = useRecommended();
    const { queued, addToQueued, removeFromQueued } = useQueued();
    const { watched, addToWatched, removeFromWatched } = useWatched();
    const { favorites, addToFavorites, removeFromFavorites } = useFavorites();

    const handleRecommendedToggle = async (movie) => {
        const isRecommended = recommended.some(r => r.imdbID === movie.imdbID);
        if (isRecommended) {
            await removeFromRecommended(movie);
        } else {
            await addToRecommended(movie);
        }
    };

    const handleQueuedToggle = async (movie) => {
        const isQueued = queued.some(q => q.imdbID === movie.imdbID);
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

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const response = await axios.get(`/omdb/api/search-by-id?id=${imdbID}`);
            setMovieDetails(response.data);
    };

        fetchMovieDetails();
    }, [imdbID]);

    if (!movieDetails) {
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
            <div className="movie-detail">
                <h2>{movieDetails.Title} ({movieDetails.Year})</h2>
                <div className="details">
                    <div>
                        <img src={movieDetails.Poster} alt={movieDetails.Title} />
                    </div>
                    <div className="about-container">
                        <div className="about">
                            <p><strong>Rated:</strong> {movieDetails.Rated}</p>
                            <p><strong>Released:</strong> {movieDetails.Released}</p>
                            <p><strong>Runtime:</strong> {movieDetails.Runtime}</p>
                            <p><strong>Box Office (USA and Canada):</strong> {movieDetails.BoxOffice}</p>
                            <p><strong>Genre:</strong> {movieDetails.Genre}</p>
                            <p><strong>Director:</strong> {movieDetails.Director}</p>
                            <p><strong>Actors:</strong> {movieDetails.Actors}</p>
                            <p><strong>Awards:</strong> {movieDetails.Awards}</p>
                            <p><strong>Plot:</strong> {movieDetails.Plot}</p>
                        </div>
                        <MovieIcons
                            isAdmin={currentUser?.role === 'admin'}
                            movie={movieDetails}
                            isRecommended={recommended.some(r => r.imdbID === movieDetails.imdbID)}
                            isQueued={queued.some(q => q.imdbID === movieDetails.imdbID)}
                            isWatched={watched.some(w => w.imdbID === movieDetails.imdbID)}
                            isFavorited={favorites.some(f => f.imdbID === movieDetails.imdbID)}
                            onToggleRecommended={handleRecommendedToggle}
                            onToggleQueued={handleQueuedToggle}
                            onToggleWatched={handleWatchedToggle}
                            onToggleFavorite={handleFavoriteToggle}
                        />
                    </div>
                </div>
                <MovieReviews 
                    movieId={imdbID} 
                    currentUser={currentUser} 
                    movieDetails={movieDetails}
                />
                <button onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </div> 
    );
};

export default MovieDetail;
