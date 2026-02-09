import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      const res = await axios.get(`http://localhost:5000/books/${id}`);
      setBook(res.data);
    };
    fetchBook();
  }, [id]);

  if (!book) return <p>Loading...</p>;

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
