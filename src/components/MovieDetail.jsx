import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import a from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SessionStatus from "./SessionStatus";
import '../styles/MovieDetail.css';
import MovieReviews from './MovieReviews';
import useCurrentUser from '../hooks/useCurrentUser';

const OMDB_BASE_URL = process.env.REACT_APP_OMDB_BASE_URL || 'http://www.omdbapi.com';
const OMDB_API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = `${OMDB_BASE_URL}/?apikey=${OMDB_API_KEY}`;

const MovieDetail = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const { imdbID } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useCurrentUser();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const response = await a.get(`${API_URL}&i=${imdbID}`);
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
