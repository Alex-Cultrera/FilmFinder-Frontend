import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import a from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import SessionStatus from "./SessionStatus";
import '../styles/MovieDetail.css';
import MovieReviews from './MovieReviews';

const API_URL = 'https://www.omdbapi.com/?apikey=872871fc';
const MovieDetail = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const { imdbID } = useParams(); // Get the imdbID from the URL
    const navigate = useNavigate();

    // Get user data from individual localStorage items
    const getCurrentUser = () => {
        const first_name = localStorage.getItem('first_name');
        const profile_photo_url = localStorage.getItem('profile_photo_url');
        const user_email = localStorage.getItem('user_email');
        const user_id = localStorage.getItem('user_id');

        // Only return user object if we have the essential data
        if (first_name && user_id) {
            return {
                user_id: user_id,
                first_name: first_name,
                email: user_email,
                profilePhoto: profile_photo_url
            };
        }
        return null;
    };

    const currentUser = getCurrentUser();
    console.log('Current user in MovieDetail:', currentUser); // Debug log

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
