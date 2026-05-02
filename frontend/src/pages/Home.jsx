import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import BookCard from "../components/BookCard";
import styles from "./Home.module.css";
import { API_URL } from "../config.js";
import ShimmerCard from "../components/ShimmerCard.jsx";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const searchWrapperRef = useRef(null);
  const navigate = useNavigate();

  // 500ms debounce for main search
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  // 200ms debounce for suggestions
  useEffect(() => {
    if (search.trim().length < 2) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await axios.get(`${API_URL}/books`, {
          params: { q: search.trim(), limit: 6 },
          signal: controller.signal,
        });
        const data = Array.isArray(res.data) ? res.data : res.data.books || [];
        setSuggestions(data);
      } catch {
        // cancelled — ignore
      }
    }, 200);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [search]);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, category, sort]);

  // Main books fetch
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_URL}/books`, {
          params: {
            q: debouncedSearch || undefined,
            category: category || undefined,
            sort: sort || undefined,
            page,
            limit: 12,
          },
        });
        setBooks(res.data.books || []);
        setTotalPages(res.data.pages || 1);
        setTotalBooks(res.data.total || 0);
      } catch (err) {
        console.error("Failed to fetch books", err);
        toast.error("Failed to load books");
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [debouncedSearch, category, sort, page]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = [1];
    if (page > 3) pages.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  };

  const handleSuggestionClick = (book) => {
    setShowSuggestions(false);
    setActiveIndex(-1);
    navigate(`/books/${book.id || book._id}`);
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSuggestionClick(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const highlight = (text, query) => {
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className={styles.highlight}>{text.slice(idx, idx + query.length)}</mark>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Curated Reading Room</p>
        <h1 className={styles.heroTitle}>Find your next thoughtful read.</h1>
        <p className={styles.heroText}>
          Browse a warm collection of fiction, biography, business, and craft
          titles selected for slow afternoons and ambitious mornings.
        </p>
      </section>

      <div className={styles.controls}>
        <div className={styles.searchWrapper} ref={searchWrapperRef}>
          <input
            type="text"
            placeholder="🔍 Search books or authors…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setShowSuggestions(true);
              setActiveIndex(-1);
            }}
            onFocus={() => search.trim().length >= 2 && setShowSuggestions(true)}
            onKeyDown={handleKeyDown}
            className={styles.searchInput}
            autoComplete="off"
          />

          {showSuggestions && suggestions.length > 0 && (
            <div className={styles.suggestionsDropdown}>
              {suggestions.map((book, idx) => {
                const bookId = book.id || book._id;
                const titleMatches = book.title.toLowerCase().includes(search.toLowerCase());
                const authorMatches = book.author.toLowerCase().includes(search.toLowerCase());
                return (
                  <div
                    key={bookId}
                    className={`${styles.suggestionItem} ${idx === activeIndex ? styles.suggestionActive : ""}`}
                    onMouseDown={() => handleSuggestionClick(book)}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <div className={styles.suggestionTitle}>
                      {titleMatches ? highlight(book.title, search) : book.title}
                    </div>
                    <div className={styles.suggestionMeta}>
                      <span className={styles.suggestionAuthor}>
                        {authorMatches ? highlight(book.author, search) : book.author}
                      </span>
                      <span className={styles.suggestionCategory}>{book.category}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">All Categories</option>
          <option value="Fiction">Fiction</option>
          <option value="Business">Business</option>
          <option value="Technology">Technology</option>
          <option value="Self-Help">Self-Help</option>
          <option value="Biography">Biography</option>
          <option value="Education">Education</option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className={styles.categorySelect}
        >
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      {!loading && totalBooks > 0 && (
        <p className={styles.resultsCount}>
          Showing {Math.min(books.length, totalBooks)} of {totalBooks} book{totalBooks !== 1 ? "s" : ""}
        </p>
      )}

      <div className={styles.grid}>
        {loading ? (
          Array(12).fill().map((_, i) => <ShimmerCard key={i} />)
        ) : books.length > 0 ? (
          books.map((book) => <BookCard key={book.id || book._id} book={book} />)
        ) : (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>📚</div>
            <h3>No Books Found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {!loading && totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >←</button>

          {getPageNumbers().map((p, i) =>
            p === "…" ? (
              <span key={`e${i}`} className={styles.pageEllipsis}>…</span>
            ) : (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                onClick={() => handlePageChange(p)}
              >{p}</button>
            )
          )}

          <button
            className={styles.pageBtn}
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >→</button>
        </div>
      )}
    </div>
  );
};

export default Home;
