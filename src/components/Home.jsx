import React, {useState, useEffect} from "react";
import '../styles/Home.css';
import SearchIcon from '../images/search.svg';
import axios from "../api/axiosInstance";
import a from "axios";
import {SearchBox} from "./SearchBox";
import Movies from "./Movies.jsx";
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import useFavorites from '../hooks/useFavorites';

const API_URL = 'http://www.omdbapi.com/?apikey=872871fc';
// https://www.omdbapi.com/?apikey=[YOUR-KEY]&s=${name}&page=${page}

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {favorites, addToFavorites, removeFromFavorites} = useFavorites();
    const [localFavorites, setLocalFavorites] = useState(new Set());

    // Sync localFavorites with favorites from hook
    useEffect(() => {
        const favoriteIds = new Set(favorites.map(f => f.imdbID));
        setLocalFavorites(favoriteIds);
    }, [favorites]);

    const searchMovies = async (title) => {
        const response = await a.get(`${API_URL}&s=${title}`);
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

    const handleToggleFavorite = async (movie) => {
        // Toggle local state immediately
        setLocalFavorites(prev => {
            const newSet = new Set(prev);
            if (newSet.has(movie.imdbID)) {
                newSet.delete(movie.imdbID);
            } else {
                newSet.add(movie.imdbID);
            }
            return newSet;
        });

        // Call API
        try {
            if (localFavorites.has(movie.imdbID)) {
                await removeFromFavorites(movie);
            } else {
                await addToFavorites(movie);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
            // Revert local state on error
            setLocalFavorites(prev => {
                const newSet = new Set(prev);
                if (newSet.has(movie.imdbID)) {
                    newSet.delete(movie.imdbID);
                } else {
                    newSet.add(movie.imdbID);
                }
                return newSet;
            });
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
                            localFavorites={localFavorites}
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
