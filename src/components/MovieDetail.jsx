import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MovieDetail.css';

const API_URL = 'https://www.omdbapi.com/?apikey=872871fc';
const MovieDetail = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const { imdbID } = useParams(); // Get the imdbID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const response = await axios.get(`${API_URL}&i=${imdbID}`);
            setMovieDetails(response.data);
        };

        fetchMovieDetails();
    }, [imdbID]);

    if (!movieDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div className="movie-detail">
            <button onClick={() => navigate(-1)}>Go Back</button> {/* Navigate back to the previous page */}
            <h2>{movieDetails.Title} ({movieDetails.Year})</h2>
            <img src={movieDetails.Poster} alt={movieDetails.Title} />
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
    );
};

export default MovieDetail;
