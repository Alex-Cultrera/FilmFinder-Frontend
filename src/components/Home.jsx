import React, {useState, useEffect} from "react";
import '../styles/Home.css';
import SearchIcon from '../images/search.svg';
import axios from 'axios';
import {SearchBox} from "./SearchBox";
import Movies from "./Movies";
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import useFavorites from '../hooks/useFavorites';

const API_URL = 'http://www.omdbapi.com/?apikey=872871fc';
// https://www.omdbapi.com/?apikey=[YOUR-KEY]&s=${name}&page=${page}

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {favorites, addToFavorites, removeFromFavorites, loading, error } = useFavorites();


    const searchMovies = async (title) => {
        const response = await axios.get(`${API_URL}&s=${title}`);
        const data = await response.data;
        if (data) {
            setMovies(data.Search);
        }
        console.log(data);
    }

    useEffect(() => {
        searchMovies('Spider-man')
    }, []);

    const handleSearch = async (val) => {
        await searchMovies(val)
    }

    const handleToggleFavorite = (movie) => {
            const isFavorite = favorites.some(fav => fav.imdbID === movie.imdbID);
            if (isFavorite) {
                removeFromFavorites(movie);
            } else {
                addToFavorites(movie);
            }
    };

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
            </div>

            <div className="home">
                <SearchBox
                    SearchIcon={SearchIcon}
                    setSearchTerm={setSearchTerm}
                    searchTerm={searchTerm}
                    searchMovies={searchMovies}
                    handleSearch={handleSearch}
                />

                {movies?.length > 0
                    ? (
                        <Movies
                            movies={movies}
                            onToggleFavorite={handleToggleFavorite}
                            favorites={favorites}
                        />
                    ) : (
                        <div className="empty">
                            <h2>No movies found</h2>
                        </div>
                    )}

                    {/*{error && <div className="error">{error}</div>}*/}
            </div>
        </div>
    );
}

export default Home;
