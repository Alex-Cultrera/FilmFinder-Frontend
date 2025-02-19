import React, {useState, useEffect} from "react";
import '../styles/Home.css';
import SearchIcon from '../images/search.svg';
import axios from "../api/axiosInstance";
import {SearchBox} from "./SearchBox";
import Movies from "./Movies.jsx";
import NavBar from "./NavBar";
import SessionStatus from "./SessionStatus";
import useRecommended from '../hooks/useRecommended';
import useQueued from '../hooks/useQueued';
import useWatched from '../hooks/useWatched';
import useFavorites from '../hooks/useFavorites';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [totalResults, setTotalResults] = useState(0);
    const {recommended, addToRecommended, removeFromRecommended, loading: recommendedLoading, error: recommendedError } = useRecommended();
    const {queued, addToQueued, removeFromQueued} = useQueued();
    const {watched, addToWatched, removeFromWatched} = useWatched();
    const {favorites, addToFavorites, removeFromFavorites} = useFavorites();
    const [localRecommended, setLocalRecommended] = useState(new Set());
    const [localQueued, setLocalQueued] = useState(new Set());
    const [localWatched, setLocalWatched] = useState(new Set());
    const [localFavorites, setLocalFavorites] = useState(new Set());

    // Sync localRecommended, localQueued, localWatched, and localFavorites, 
    //                  with recommended, queued, watched, and favorites from hooks
    useEffect(() => {
        const recommendedIds = new Set(recommended.map(r => r.imdbID));
        setLocalRecommended(recommendedIds);
        const queuedIds = new Set(queued.map(w => w.imdbID));
        setLocalQueued(queuedIds);
        const watchedIds = new Set(watched.map(w => w.imdbID));
        setLocalWatched(watchedIds);
        const favoriteIds = new Set(favorites.map(f => f.imdbID));
        setLocalFavorites(favoriteIds);
    }, [recommended, queued, watched, favorites]);

    const handleSearch = async (val) => {
        await searchMovies(val, 1)
    }

    const searchMovies = async (title, pageNumber) => {
        setLoading(true);
        try {
            const response = await axios.get(`/omdb/api/search-by-title?title=${title}&page=${pageNumber}`);
            const data = response.data;
            if (data && data.movies) {
                setMovies(prevMovies => [...prevMovies, ...data.movies]);
                setTotalResults(data.totalResults);
            }
        } catch (error) {
            console.error('Search error:', error);
        } finally {
            setLoading(false);
        }
    };
    
    useEffect(() => {
        if (searchTerm) {
            setMovies([]); // Clear previous results
            setPage(1); // Reset to first page
            searchMovies(searchTerm, 1);
        } 
        else {
            setMovies(recommended);
        }
    }, [searchTerm, recommended]);

    // Infinite scroll logic
    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
        setPage(prevPage => {
            const nextPage = prevPage + 1;
            searchMovies(searchTerm, nextPage);
            return nextPage;
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, searchTerm, handleScroll]);


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

            </div>
        </div>
    );
}

export default Home;
