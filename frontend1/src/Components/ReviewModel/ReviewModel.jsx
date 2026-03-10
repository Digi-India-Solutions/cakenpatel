import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ReviewModel.css";

const StarIcon = ({ filled, half, onClick, onHover }) => (
  <svg
    onClick={onClick}
    onMouseEnter={onHover}
    viewBox="0 0 24 24"
    className={`star-icon ${filled ? "filled" : ""} ${half ? "half" : ""}`}
  >
    <defs>
      <linearGradient id="halfGrad">
        <stop offset="50%" stopColor="#e8a838" />
        <stop offset="50%" stopColor="#d4d4d4" />
      </linearGradient>
    </defs>
    <polygon
      points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={half ? "url(#halfGrad)" : filled ? "#e8a838" : "#d4d4d4"}
      stroke={filled || half ? "#e8a838" : "#c0c0c0"}
      strokeWidth="1"
    />
  </svg>
);

const StarRating = ({ rating, setRating }) => {
  const [hovered, setHovered] = useState(0);

  const labels = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

  return (
    <div className="star-rating-wrapper">
      <div
        className="stars-row"
        onMouseLeave={() => setHovered(0)}
      >
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIcon
            key={star}
            filled={star <= (hovered || rating)}
            onClick={() => setRating(star)}
            onHover={() => setHovered(star)}
          />
        ))}
      </div>
      {(hovered || rating) > 0 && (
        <span className="rating-label">{labels[hovered || rating]}</span>
      )}
    </div>
  );
};

const ReviewModel = ({ show, onHide, productId, onReviewAdded }) => {
  const [rating, setRating]     = useState(0);
  const [review, setReview]     = useState("");
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [loading, setLoading]   = useState(false);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!review.trim()) {
      toast.error("Please write a review");
      return;
    }
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL || "https://api.cakenpetals.com"}/api/reviews/create`,
        { productId, rating, review: review.trim(), name: name.trim(), email: email.trim() },
        { withCredentials: true }
      );

      if (res.status === 201) {
        toast.success("Review submitted! Thank you 🎂");
        onReviewAdded?.(res.data.data);
        handleClose();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    setName("");
    setEmail("");
    onHide();
  };

  return (
    <>
      {/* Backdrop */}
      <div className="rm-backdrop" onClick={handleClose} />

      {/* Modal */}
      <div className="rm-modal" role="dialog" aria-modal="true" aria-label="Write a Review">

        {/* Decorative top strip */}
        <div className="rm-top-strip">
          <span className="rm-strip-dot" />
          <span className="rm-strip-dot" />
          <span className="rm-strip-dot" />
        </div>

        {/* Close button */}
        <button className="rm-close" onClick={handleClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="rm-header">
          <div className="rm-icon">🎂</div>
          <h2 className="rm-title">Share Your Experience</h2>
          <p className="rm-subtitle">How did we do? Your feedback means the world to us.</p>
        </div>

        {/* Form */}
        <form className="rm-form" onSubmit={handleSubmit}>

          {/* Star Rating */}
          <div className="rm-field">
            <label className="rm-label">Your Rating <span className="rm-required">*</span></label>
            <StarRating rating={rating} setRating={setRating} />
          </div>

          {/* Review Text */}
          <div className="rm-field">
            <label className="rm-label" htmlFor="rm-review">
              Your Review <span className="rm-required">*</span>
            </label>
            <textarea
              id="rm-review"
              className="rm-textarea"
              placeholder="Tell others what you loved about this product..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <span className="rm-char-count">{review.length}/500</span>
          </div>

          {/* Name & Email row */}
          <div className="rm-row">
            <div className="rm-field">
              <label className="rm-label" htmlFor="rm-name">
                Name <span className="rm-required">*</span>
              </label>
              <input
                id="rm-name"
                type="text"
                className="rm-input"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={60}
              />
            </div>
            <div className="rm-field">
              <label className="rm-label" htmlFor="rm-email">Email</label>
              <input
                id="rm-email"
                type="email"
                className="rm-input"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                maxLength={100}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="rm-actions">
            <button type="button" className="rm-btn-cancel" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="rm-btn-submit" disabled={loading}>
              {loading ? (
                <span className="rm-spinner" />
              ) : (
                <>Submit Review <span>✨</span></>
              )}
            </button>
          </div>

        </form>
      </div>
    </>
  );
};

export default ReviewModel;