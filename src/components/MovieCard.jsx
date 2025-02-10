import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEye, faCirclePlus, faHouse } from '@fortawesome/free-solid-svg-icons';
import useCurrentUser from '../hooks/useCurrentUser';

const MovieCard = ({movie, onToggleRecommended, isRecommended, onToggleQueued, isQueued, onToggleWatched, isWatched, onToggleFavorite, isFavorited}) => {
    const { currentUser, isAdmin } = useCurrentUser();

    const handleRecommendedClick = (e) => {
        e.stopPropagation();
        onToggleRecommended(movie);
    };

    const handleQueuedClick = (e) => {
        e.stopPropagation();
        onToggleQueued(movie);
    };
    
    const handleWatchedClick = (e) => {
        e.stopPropagation();
        onToggleWatched(movie);
    };
    
    const handleFavoriteClick = (e) => {
        e.stopPropagation();
        onToggleFavorite(movie);
    };

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
                    <img src={movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/400'}
                         alt={movie.Title}/>
                </div>
                <div className='label'>
                    <span>{movie.Type}</span>
                    <h3>{movie.Title}</h3>
                </div>
            </Link>
            {isHovered && (
                <div className="icon-container">
                    {isAdmin && (
                        <div
                            className="home-icon-container"
                            onClick={() => onToggleRecommended(movie)}
                        >
                            <FontAwesomeIcon
                                icon={faHouse}
                                className={`home-icon ${isRecommended ? 'recommended' : ''}`}
                            />
                        </div>
                    )}
                    <div
                        className="queue-icon-container"
                        onClick={() => onToggleQueued(movie)}
                    >
                        <FontAwesomeIcon
                            icon={faCirclePlus}
                            className={`queue-icon ${isQueued ? 'queued' : ''}`}
                        />
                    </div>
                    <div
                        className="watch-icon-container"
                        onClick={() => onToggleWatched(movie)}
                    >
                        <FontAwesomeIcon
                            icon={faEye}
                            className={`watch-icon ${isWatched ? 'watched' : ''}`}
                        />
                    </div>
                    <div
                        className="heart-icon-container"
                        onClick={handleFavoriteClick}
                    >
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={`heart-icon ${isFavorited ? 'favorited' : ''}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}


export default MovieCard;