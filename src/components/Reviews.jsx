import React, { useState, useEffect } from 'react';
import NavBar from "./NavBar";
import MovieReviews from './MovieReviews';
import MovieReview from './MovieReview';
import SessionStatus from "./SessionStatus";
import '../styles/Reviews.css';
import axios from '../api/axiosInstance';

const Reviews = ({ onEdit, onDelete }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    // Get current user from localStorage
    useEffect(() => {
        const getCurrentUser = () => {
            const first_name = localStorage.getItem('first_name');
            const profile_photo_url = localStorage.getItem('profile_photo_url');
            const user_email = localStorage.getItem('user_email');
            const user_id = localStorage.getItem('user_id');
            const role = localStorage.getItem('role'); // Add this if you store user role

            if (first_name && user_id) {
                return {
                    user_id: user_id,
                    first_name: first_name,
                    email: user_email,
                    profilePhoto: profile_photo_url,
                    role: role // Add this if you store user role
                };
            }
            return null;
        };

        const user = getCurrentUser();
        setCurrentUser(user);
        setIsAdmin(user?.role === 'ADMIN');
    }, []);


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
            <div className="reviews-container">
                <div className="reviews-header">
                    <h2>My Reviews</h2>
                </div>
                <p>Please log in to view your reviews.</p>
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
                <h2>{isAdmin ? 'All User Reviews' : 'My Reviews'}</h2>
            </div>
    
            <div className="reviews-container">

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

                {isAdmin && (
                    <div className="admin-stats">
                        <p>Total Reviews: {reviews.length}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reviews;