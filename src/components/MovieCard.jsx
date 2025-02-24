import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import MovieIcons from './MovieIcons';
import Placeholder from '../images/placeholder.png';
const MovieCard = ({isAdmin, movie, onToggleRecommended, isRecommended, onToggleQueued, isQueued, onToggleWatched, isWatched, onToggleFavorite, isFavorited}) => {
    
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    return (
        <div
            className="movie"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className='overlay'>
                    <p>{movie.Year}</p>
                </div>
                <div className='poster'>
                    {movie.Poster !== 'N/A' ? (
                        <img src={movie.Poster} alt={movie.Title} />
                    ) : (
                        <img src={Placeholder} alt="Placeholder" />
                    )}
                </div>
                <div className='label'>
                    <span>{movie.Type}</span>
                    <h3>{movie.Title}</h3>
                </div>
            </Link>
            {isHovered && (
                <MovieIcons 
                    isAdmin={isAdmin}
                    movie={movie}
                    isRecommended={isRecommended}
                    isQueued={isQueued}
                    isWatched={isWatched}
                    isFavorited={isFavorited}
                    onToggleRecommended={onToggleRecommended}
                    onToggleQueued={onToggleQueued}
                    onToggleWatched={onToggleWatched}
                    onToggleFavorite={onToggleFavorite}
                />
            )}
        </div>
    );
}


export default MovieCard;