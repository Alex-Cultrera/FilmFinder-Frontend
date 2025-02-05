import React, { useState, useEffect } from 'react';
import MovieReview from './MovieReview';
import '../styles/MovieReviews.css';
import axios from '../api/axiosInstance';

const MovieReviews = ({ movieId, movieDetails, currentUser }) => {
    const [reviews, setReviews] = useState([]);
    const [newReview, setNewReview] = useState({ 
        reviewSubject: '',
        content: '', 
        rating: 5 
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch reviews
    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const response = await axios.get(`review/movies/${movieId}/all`);
                setReviews(response.data);
                console.log(response.data);
            } catch (err) {
                setError('Failed to load reviews');
                console.error(err);
            }
        };
        fetchReviews();
    }, [movieId]);

    // Add new review
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!currentUser) {
            setError('Please log in to leave a review');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const reviewData = {
                reviewSubject: newReview.reviewSubject,
                content: newReview.content,
                rating: newReview.rating,
                userId: currentUser.user_id,
                firstName: currentUser.first_name,
                profilePhotoUrl: currentUser.profilePhoto,
                movieId: movieId,
                title: movieDetails.Title,
                year: movieDetails.Year,
                type: movieDetails.Type,
                posterUrl: movieDetails.Poster,
            };

            const response = await axios.post(`/review/movies/${movieId}/new`, reviewData);
            setReviews(prev => [...prev, response.data]);
            setNewReview({ reviewSubject: '', content: '', rating: 5 });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Edit review
    const handleEditReview = async (reviewId, updatedData) => {
        try {
            const response = await axios.put(`/review/${reviewId}/update`, updatedData);
            setReviews(prev => 
                prev.map(review => 
                    review.reviewId === reviewId ? response.data : review
                )
            );
        } catch (err) {
            setError('Failed to update review');
            console.error(err);
        }
    };

    // Delete review
    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`/review/${reviewId}/delete`);
            setReviews(prev => prev.filter(review => review.reviewId !== reviewId));
        } catch (err) {
            setError('Failed to delete review');
            console.error(err);
        }
    };

    return (
        <div className="movie-reviews">
            <h3>Reviews</h3>
            
            {currentUser && (
                <form onSubmit={handleSubmitReview} className="review-form">
                    <input
                        type="text"
                        placeholder="Review Title"
                        value={newReview.reviewSubject}
                        onChange={(e) => setNewReview(prev => ({
                            ...prev,
                            reviewSubject: e.target.value
                        }))}
                        required
                        className="review-subject-input"
                    />
                    <textarea
                        placeholder="Write your review..."
                        value={newReview.content}
                        onChange={(e) => setNewReview(prev => ({
                            ...prev,
                            content: e.target.value
                        }))}
                        required
                    />
                    <div className="review-form-footer">
                        <select
                            value={newReview.rating}
                            onChange={(e) => setNewReview(prev => ({
                                ...prev,
                                rating: Number(e.target.value)
                            }))}
                        >
                            {[1, 2, 3, 4, 5].map(num => (
                                <option key={num} value={num}>{num} Stars</option>
                            ))}
                        </select>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            )}

            {error && <div className="error-message">{error}</div>}

            <div className="reviews-list">
                {reviews.length === 0 ? (
                    <p>No reviews yet. Be the first to review!</p>
                ) : (
                    reviews.map(review => (
                        <MovieReview
                            key={review.reviewId}
                            review={review}
                            onEdit={handleEditReview}
                            onDelete={handleDeleteReview}
                            isCurrentUser={currentUser?.user_id === String(review.userId)}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default MovieReviews; 