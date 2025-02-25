import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faCirclePlus, faEye, faHeart } from '@fortawesome/free-solid-svg-icons';
import useCurrentUser from '../hooks/useCurrentUser';
import '../styles/MovieIcons.css';

const MovieIcons = ({ 
    movie,
    isRecommended,
    isQueued,
    isWatched,
    isFavorited,
    onToggleRecommended,
    onToggleQueued,
    onToggleWatched,
    onToggleFavorite
}) => {
    const { isAdmin } = useCurrentUser();

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

    return (
        <div className="icon-container">
            {isAdmin && (
                <div
                    className="home-icon-container"
                    onClick={handleRecommendedClick}
                >
                    <FontAwesomeIcon
                        icon={faHouse}
                        className={`home-icon ${isRecommended ? 'recommended' : ''}`}
                    />
                </div>
            )}
            <div
                className="queue-icon-container"
                onClick={handleQueuedClick}
            >
                <FontAwesomeIcon
                    icon={faCirclePlus}
                    className={`queue-icon ${isQueued ? 'queued' : ''}`}
                />
            </div>
            <div
                className="watch-icon-container"
                onClick={handleWatchedClick}
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
    );
};

export default MovieIcons; 