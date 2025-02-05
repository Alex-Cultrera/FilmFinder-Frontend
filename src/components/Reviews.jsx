import React, {useState, useEffect} from 'react';
import NavBar from "./NavBar";
import MovieReviews from './MovieReviews';
import MovieReview from './MovieReview';
import SessionStatus from "./SessionStatus";
import '../styles/Reviews.css';

const Reviews = ({ currentUser, reviews = [], onEdit, onDelete }) => {
    // show reviews based on user role
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check if user has admin role
        setIsAdmin(currentUser?.role === 'ADMIN');
    }, [currentUser]);

    // Filter reviews based on user role
    const displayedReviews = isAdmin 
        ? reviews // Admin sees all reviews
        : reviews.filter(review => Number(currentUser?.user_id) === review.userId); // Users see only their reviews

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
                <h2>{isAdmin ? 'All User Reviews' : 'My Reviews'}</h2>
            </div>
    
            <div className="reviews-container">

                {!reviews ? (
                    <p>Loading reviews...</p>
                ) : displayedReviews.length === 0 ? (
                    <p>{isAdmin 
                        ? 'No reviews available.' 
                        : 'You haven\'t written any reviews yet.'}
                    </p>
                ) : (
                    <div className="reviews-list">
                        {displayedReviews.map(review => (
                            <MovieReview
                                key={review.reviewId}
                                review={review}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                // Admin can delete any review, users can only edit/delete their own
                                isCurrentUser={isAdmin || Number(currentUser?.user_id) === review.userId}
                            />
                        ))}
                    </div>
                )}

                {isAdmin && (
                    <div className="admin-stats">
                        <p>Total Reviews: {reviews.length}</p>
                        <p>Showing: {displayedReviews.length} reviews</p>
                    </div>
                )}
            </div>
        </div>
    );
};
export default Reviews;