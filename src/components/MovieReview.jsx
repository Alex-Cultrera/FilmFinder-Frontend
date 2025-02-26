import React, { useState } from 'react';
import '../styles/MovieReview.css';
import DEFAULT_PHOTO from '../utils/defaultAvatar';

const MovieReview = ({ review, onEdit, onDelete, isCurrentUser }) => {
    const [isEditing, setIsEditing] = useState(false);
    console.log('isCurrentUser:', isCurrentUser, 'reviewId:', review.reviewId);
    const [editedContent, setEditedContent] = useState(review.content);
    const [editedSubjectLine, setEditedSubjectLine] = useState(review.reviewSubject);
    const [editedRating, setEditedRating] = useState(review.rating);

    const handleSubmitEdit = async (e) => {
        e.preventDefault();
        await onEdit(review.reviewId, {
            reviewSubject: editedSubjectLine,
            content: editedContent,
            rating: editedRating
        });
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <form onSubmit={handleSubmitEdit} className="review-edit-form">
                <input
                    type="text"
                    value={editedSubjectLine}
                    onChange={(e) => setEditedSubjectLine(e.target.value)}
                    required
                    className="review-subject-input"
                />
                <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    required
                />
                <select
                    value={editedRating}
                    onChange={(e) => setEditedRating(Number(e.target.value))}
                    required
                >
                    {[1, 2, 3, 4, 5].map(num => (
                        <option key={num} value={num}>{num} Stars</option>
                    ))}
                </select>
                <div className="review-edit-buttons">
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            </form>
        );
    }

    return (
        <div className="review">
            <div className="review-header">
                <div className="review-user-info">
                    {review.profilePhotoUrl && (
                        <img 
                            src={review.profilePhotoUrl || DEFAULT_PHOTO} 
                            alt={review.firstName}
                            className="review-user-photo"
                        />
                    )}
                    <span className="review-username">{review.firstName}</span>
                    <span className="review-rating">
                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </span>
                    <span className="review-date">
                        {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                </div>
                
                
            </div>
            <h4 className="review-subject">{review.reviewSubject}</h4>
            <p className="review-content">{review.content}</p>
            {isCurrentUser && (
                <div className="review-actions">
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                    <button onClick={() => onDelete(review.reviewId)}>Delete</button>
                    <button onClick={() => window.open(`/movie/${review.movieId}`, '_blank')}> View Movie </button>
                </div>
            )}
        </div>
    );
};

export default MovieReview; 