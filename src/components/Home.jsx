import React, {useState, useEffect} from "react";
import '../styles/Home.css';
import SearchIcon from '../images/search.svg';
import axios from "../api/axiosInstance";
import a from "axios";
import {SearchBox} from "./SearchBox";
import Movies from "./Movies.jsx";
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import useQueued from '../hooks/useQueued';
import useWatched from '../hooks/useWatched';
import useFavorites from '../hooks/useFavorites';

const API_URL = 'http://www.omdbapi.com/?apikey=872871fc';
// https://www.omdbapi.com/?apikey=[YOUR-KEY]&s=${name}&page=${page}

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const {queued, addToQueued, removeFromQueued} = useQueued();
    const {watched, addToWatched, removeFromWatched} = useWatched();
    const {favorites, addToFavorites, removeFromFavorites} = useFavorites();
    const [localQueued, setLocalQueued] = useState(new Set());
    const [localWatched, setLocalWatched] = useState(new Set());
    const [localFavorites, setLocalFavorites] = useState(new Set());

    // Sync localFavorites and localWatchedwith favorites and watchedfrom hooks
    useEffect(() => {
        const queuedIds = new Set(queued.map(w => w.imdbID));
        setLocalQueued(queuedIds);
        const watchedIds = new Set(watched.map(w => w.imdbID));
        setLocalWatched(watchedIds);
        const favoriteIds = new Set(favorites.map(f => f.imdbID));
        setLocalFavorites(favoriteIds);
    }, [queued, watched, favorites]);

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

    const handleToggleQueued = async (movie) => {
        // Toggle local state immediately
        setLocalQueued(prev => {
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
            if (localQueued.has(movie.imdbID)) {
                await removeFromQueued(movie);
            } else {
                await addToQueued(movie);
            }
        } catch (error) {
            console.error('Error toggling queued:', error);
            // Revert local state on error
            setLocalQueued(prev => {
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
    
    const handleToggleWatched = async (movie) => {
        // Toggle local state immediately
        setLocalWatched(prev => {
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
            if (localWatched.has(movie.imdbID)) {
                await removeFromWatched(movie);
            } else {
                await addToWatched(movie);
            }
        } catch (error) {
            console.error('Error toggling watched:', error);
            // Revert local state on error
            setLocalWatched(prev => {
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
                            onToggleQueued={handleToggleQueued}
                            queued={queued}
                            localQueued={localQueued}
                            onToggleWatched={handleToggleWatched}
                            watched={watched}
                            localWatched={localWatched}
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
