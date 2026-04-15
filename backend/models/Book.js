import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  summary: { type: String },
  category: {
    type: String,
    required: true,
    enum: [
      "Fiction",
      "Business",
      "Technology",
      "Self-Help",
      "Biography",
      "Education",
    ],
  },
  stock: {
    type: Number,
    required: true,
    min: 0,
  },
  avgRating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
});

const Book = mongoose.model("Book", bookSchema);
export default Book;
