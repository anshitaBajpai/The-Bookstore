import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { CartContext } from "../context/CartContext.jsx";
import styles from "./BookDetails.module.css";
import { API_URL } from "../config.js";

const Stars = ({ rating, max = 5 }) => (
  <span className={styles.starsDisplay}>
    {Array.from({ length: max }, (_, i) => (
      <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
    ))}
  </span>
);

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const [reviews, setReviews] = useState([]);
  const [canReview, setCanReview] = useState(false);
  const [userReview, setUserReview] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const navigate = useNavigate();
  const { cart, addToCart } = useContext(CartContext);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        if (isMounted) { setError("Book not found"); setLoading(false); }
        return;
      }

      try {
        const [bookRes, reviewsRes] = await Promise.all([
          axios.get(`${API_URL}/books/${id}`),
          axios.get(`${API_URL}/books/${id}/reviews`),
        ]);
        if (isMounted) {
          setBook(bookRes.data);
          setReviews(reviewsRes.data.reviews);
          setCanReview(reviewsRes.data.canReview);
          setUserReview(reviewsRes.data.userReview);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch book details");
          setBook(null);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (reviewRating === 0) return toast.error("Please select a star rating.");
    setSubmittingReview(true);
    try {
      const res = await axios.post(`${API_URL}/books/${id}/reviews`, {
        rating: reviewRating,
        text: reviewText,
      });
      const newReview = res.data;
      setReviews((prev) => [newReview, ...prev]);
      setCanReview(false);
      setUserReview(newReview);
      setReviewRating(0);
      setReviewText("");
      setBook((prev) => {
        const count = (prev.reviewCount || 0) + 1;
        const avg = Math.round(
          ((prev.avgRating || 0) * (count - 1) + reviewRating) / count * 10
        ) / 10;
        return { ...prev, avgRating: avg, reviewCount: count };
      });
      toast.success("Review submitted!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <p className={styles.loading}>Loading...</p>;
  if (error) return <p className={styles.error}>Error: {error}</p>;
  if (!book) return <p className={styles.notFound}>Book not found</p>;

  const bookId = book.id || book._id;
  const cartItem = cart.find((item) => (item.id || item._id) === bookId);
  const remainingStock = Number(book.stock) - (cartItem ? cartItem.quantity : 0);

  const handleAddToCart = () => {
    const qty = Math.max(1, Math.min(quantity, remainingStock));
    for (let i = 0; i < qty; i++) addToCart(book);
    setQuantity(1);
  };

  const displayRating = hoverRating || reviewRating;

  return (
    <div className={styles.container}>
      <button className={styles.back} onClick={() => navigate(-1)}>← Back</button>

      <div className={styles.card}>
        <div className={styles.imageWrap}>
          <img src={book.image} alt={book.title} className={styles.image} loading="lazy" decoding="async" />
        </div>

        <div className={styles.details}>
          <h1 className={styles.title}>{book.title}</h1>
          <p className={styles.author}>by {book.author}</p>

          <div className={styles.metaRow}>
            <div className={styles.price}>₹{book.price}</div>
            {book.avgRating > 0 && (
              <div className={styles.rating}>
                ⭐ {book.avgRating}
                <span className={styles.ratingCount}>({book.reviewCount})</span>
              </div>
            )}
            <div className={styles.category}>{book.category}</div>
          </div>

          <p className={styles.summary}>{book.summary}</p>

          <div className={styles.actionRow}>
            <div className={styles.qty}>
              <button className={styles.qtyBtn} onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
              <input
                className={styles.qtyInput}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
              />
              <button className={styles.qtyBtn} onClick={() => setQuantity((q) => Math.min(q + 1, remainingStock))}>+</button>
            </div>

            <button className={styles.addButton} onClick={handleAddToCart} disabled={remainingStock <= 0}>
              {remainingStock <= 0 ? "Out of stock" : "Add to Cart"}
            </button>
          </div>

          <p className={styles.stock}>Available: {Math.max(0, remainingStock)}</p>
        </div>
      </div>

      {/* Reviews */}
      <div className={styles.reviewsSection}>
        <h2 className={styles.reviewsTitle}>
          Reviews {reviews.length > 0 && <span className={styles.reviewsCount}>({reviews.length})</span>}
        </h2>

        {canReview && (
          <form className={styles.reviewForm} onSubmit={handleSubmitReview}>
            <p className={styles.reviewFormLabel}>Share your experience</p>
            <div className={styles.starPicker}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`${styles.starBtn} ${star <= displayRating ? styles.starBtnFilled : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setReviewRating(star)}
                >★</button>
              ))}
            </div>
            <textarea
              className={styles.reviewTextarea}
              placeholder="What did you think of this book?"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              rows={3}
              maxLength={1000}
              required
            />
            <button
              type="submit"
              className={styles.reviewSubmit}
              disabled={submittingReview || reviewRating === 0}
            >
              {submittingReview ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className={styles.noReviews}>
            {canReview ? "Be the first to review this book!" : "No reviews yet."}
          </p>
        ) : (
          <div className={styles.reviewsList}>
            {reviews.map((review) => {
              const isOwn = userReview && review._id === userReview._id;
              return (
                <div key={review._id} className={`${styles.reviewItem} ${isOwn ? styles.reviewItemOwn : ""}`}>
                  <div className={styles.reviewHeader}>
                    <span className={styles.reviewUsername}>
                      {review.username}
                      {isOwn && <span className={styles.youBadge}>You</span>}
                    </span>
                    <Stars rating={review.rating} />
                    <span className={styles.reviewDate}>
                      {new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "short", year: "numeric",
                      })}
                    </span>
                  </div>
                  <p className={styles.reviewText}>{review.text}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookDetails;
