import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/MovieDetail.css';

const MovieDetail = () => {
    const [movieDetails, setMovieDetails] = useState(null);
    const { imdbID } = useParams(); // Get the imdbID from the URL
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            const response = await axios.get(`https://www.omdbapi.com/?i=${imdbID}&apikey=872871fc`);
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
            <p><strong>Genre:</strong> {movieDetails.Genre}</p>
            <p><strong>Plot:</strong> {movieDetails.Plot}</p>
            <p><strong>Director:</strong> {movieDetails.Director}</p>
            <p><strong>Actors:</strong> {movieDetails.Actors}</p>
            {/* Add any other details you'd like to display */}
        </div>
    );
};

export default MovieDetail;
