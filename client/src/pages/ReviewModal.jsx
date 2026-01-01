import { useState } from "react";
import Modal from "./Modal";
import { createReview } from "../services/api";
import "./StarRating.css";

const ReviewModal = ({ carId, bookingId, isOpen, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [comment, setComment] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (rating === 0) {
            setError("Please select a rating");
            return;
        }

        try {
            setSubmitting(true);
            await createReview({
                carId,
                bookingId, // Optional depending on backend requirement, but good to pass if available
                rating,
                comment,
                car: carId // Backend fix earlier supports both carId and car, let's allow both
            });
            if (onReviewSubmitted) onReviewSubmitted();
            onClose();
            // Reset form
            setRating(0);
            setComment("");
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal show={isOpen} onClose={onClose}>
            <h2 style={{ marginTop: 0 }}>Write a Review</h2>
            {error && <div className="alert error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Rating:</label>
                    <div className="star-rating" style={{ fontSize: '2rem', cursor: 'pointer' }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <span
                                key={star}
                                className={`star ${star <= (hover || rating) ? "active" : ""}`}
                                style={{
                                    color: star <= (hover || rating) ? '#fbbf24' : '#d1d5db',
                                    transition: 'color 0.2s'
                                }}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            >
                                ★
                            </span>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="comment" style={{ display: 'block', marginBottom: '0.5rem' }}>Comment:</label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        required
                        rows="4"
                        style={{ width: '100%', padding: '0.5rem', borderRadius: '0.25rem', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text-color)' }}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                    <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                    <button type="submit" className="btn-primary" disabled={submitting || rating === 0}>
                        {submitting ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default ReviewModal;
