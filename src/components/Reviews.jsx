import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import MovieReviews from './MovieReviews';
import MovieReview from './MovieReview';
import SessionStatus from "./SessionStatus";
import '../styles/Reviews.css';
import axios from '../api/axiosInstance';
import useCurrentUser from '../hooks/useCurrentUser';

const Reviews = ({ onEdit, onDelete }) => {
    const { currentUser, isAdmin } = useCurrentUser();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch reviews
    const fetchReviews = async () => {
        try {
            setLoading(true);
            const endpoint = isAdmin ? '/review/all' : '/review/user/all';
            const response = await axios.get(endpoint);
            setReviews(response.data);
        } catch (err) {
            console.error('Error details:', err.response || err);
            setError(`Failed to load reviews: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            fetchReviews();
        } else {
            setLoading(false);
        }
    }, [currentUser, isAdmin]);

    // Handle edit review
    const handleEditReview = async (reviewId, updatedData) => {
        try {
            const response = await axios.put(`/review/${reviewId}/update`, updatedData);
            setReviews(prevReviews => 
                prevReviews.map(review => 
                    review.reviewId === reviewId ? response.data : review
                )
            );
        } catch (err) {
            console.error('Error updating review:', err);
            setError('Failed to update review');
        }
    };

    // Handle delete review
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`/review/${reviewId}/delete`);
            setReviews(prevReviews => 
                prevReviews.filter(review => review.reviewId !== reviewId)
            );
        } catch (err) {
            console.error('Error deleting review:', err);
            setError('Failed to delete review');
        }
    };
        

    if (!currentUser) {
        return (
            <div>   
                <div className="nav-container">
                    <span className="nav">
                        <NavBar/>
                        <SessionStatus/>
                </span>
                </div>
                <div className="reviews-container">
                    <h2>Reviews</h2>
                    <div className="movie-list">
                        <p>Please log in to view your reviews.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="nav-container">
                <span className="nav">
                    <NavBar/>
                    <SessionStatus/>
                </span>
                <h2>{isAdmin ? 'All User Reviews' : 'Reviews'}</h2>
            </div>
    
            <div className="reviews-container">

                {isAdmin && (
                    <div className="admin-stats">
                        <p>Total Reviews: {reviews.length}</p>
                    </div>
                )}
                {loading ? (
                    <p>Loading reviews...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : reviews.length === 0 ? (
                    <p>{isAdmin 
                        ? 'No reviews available.' 
                        : 'You haven\'t written any reviews yet.'}
                    </p>
                ) : (
                    <div className="reviews-list">
                        {reviews.map(review => (
                            <MovieReview
                                key={review.reviewId}
                                review={review}
                                onEdit={handleEditReview}
                                onDelete={handleDeleteReview}
                                isCurrentUser={isAdmin || Number(currentUser?.user_id) === review.userId}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;