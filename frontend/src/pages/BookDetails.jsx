import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBook = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/books/${id}`);
        if (isMounted) {
          setBook(res.data);
          setError(null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Failed to fetch book details");
          setBook(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchBook();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!book) return <p>Book not found</p>;

  return (
    <div>
      <img src={book.image} alt={book.title} />
      <h2>{book.title}</h2>
      <h4>{book.author}</h4>
      <p>
        <strong>Category:</strong> {book.category}
      </p>
      <p>{book.summary}</p>
    </div>
  );
};

export default BookDetails;
