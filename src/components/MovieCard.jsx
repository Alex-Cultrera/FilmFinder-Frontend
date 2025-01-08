import React, {useState} from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faEye } from '@fortawesome/free-solid-svg-icons';

const MovieCard = ({movie, onToggleFavorite, isFavorited, onToggleWatch, isWatched}) => {
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
                    <div
                        className="heart-icon-container"
                        onClick={() => onToggleFavorite(movie)}
                    >
                        <FontAwesomeIcon
                            icon={faHeart}
                            className={`heart-icon ${isFavorited ? 'favorited' : ''}`}
                        />
                    </div>
                    <div
                        className="watch-icon-container"
                        onClick={() => onToggleWatch(movie)}
                    >
                        <FontAwesomeIcon
                            icon={faEye}
                            className={`watch-icon ${isWatched ? 'watched' : ''}`}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}


export default MovieCard;