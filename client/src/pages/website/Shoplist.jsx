import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  Star,
  ShoppingCart,
  BookOpen,
  X,
  ArrowLeft,
} from "lucide-react";
// import { getBooks } from "../../Redux/slices/bookSlice"; // adjust to your actual book slice
// import { addToCart } from "../../Redux/slices/cartSlice"; // adjust to your actual cart slice

const CATEGORIES = ["All", "Fiction", "Non-Fiction", "Fantasy", "Romance", "Mystery", "Self-Help"];
const SORT_OPTIONS = [
  { id: "popular", label: "Most Popular" },
  { id: "price_low", label: "Price: Low to High" },
  { id: "price_high", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
];

export default function Shoplist() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const status = useSelector((state) => state.book?.status);
  const books = useSelector((state) => state.book?.items ?? []);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);
  const [addedId, setAddedId] = useState(null);

  useEffect(() => {
    // if (status === 'idle') dispatch(getBooks());
  }, [dispatch, status]);

  const isLoading = status === "loading" || status === "idle";

  const filteredBooks = useMemo(() => {
    let result = [...books];

    if (activeCategory !== "All") {
      result = result.filter((b) => b.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (b) =>
          b.book_name?.toLowerCase().includes(q) ||
          b.book_author?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price_low":
        result.sort((a, b) => (a.book_price ?? 0) - (b.book_price ?? 0));
        break;
      case "price_high":
        result.sort((a, b) => (b.book_price ?? 0) - (a.book_price ?? 0));
        break;
      case "rating":
        result.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
        break;
      default:
        break;
    }
    return result;
  }, [books, activeCategory, search, sortBy]);

  const handleAddToCart = (book) => {
    setAddedId(book.id);
    // dispatch(addToCart({ id: book.id, quantity: 1 }));
    setTimeout(() => setAddedId(null), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 shop-header">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-150"
            >
              <ArrowLeft size={18} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shop Books</h1>
              <p className="text-sm text-gray-500">
                {isLoading ? "Loading titles..." : `${filteredBooks.length} ${filteredBooks.length === 1 ? "book" : "books"} found`}
              </p>
            </div>
          </div>
          <Link
            to="/cart"
            className="w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors duration-150"
          >
            <ShoppingCart size={17} className="text-gray-600" />
          </Link>
        </div>

        {/* Search + filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5 shop-toolbar">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or author..."
              className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-9 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-shadow duration-150"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-shadow duration-150"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`sm:hidden w-11 h-11 shrink-0 rounded-xl border flex items-center justify-center transition-colors duration-150
                ${showFilters ? "bg-purple-700 border-purple-700 text-white" : "bg-white border-gray-200 text-gray-600"}`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className={`flex flex-wrap gap-2 mb-8 shop-chips ${showFilters ? "" : "hidden sm:flex"}`}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 active:scale-95
                ${activeCategory === cat
                  ? "bg-purple-700 border-purple-700 text-white"
                  : "bg-white border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-700"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 p-3 animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-xl mb-3" />
                <div className="h-3.5 bg-gray-200 rounded w-4/5 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-2/5 mb-3" />
                <div className="h-3.5 bg-gray-200 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center shop-empty-state">
            <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-5 shop-empty-icon">
              <BookOpen size={36} className="text-purple-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800">No books found</h3>
            <p className="text-sm text-gray-400 mt-1 mb-6">Try a different search term or category.</p>
            <button
              onClick={() => { setSearch(""); setActiveCategory("All"); }}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-95"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="shop-card group bg-white rounded-2xl border border-gray-100 p-3 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                style={{ animationDelay: `${Math.min(index, 12) * 45}ms` }}
              >
                <Link to={`/book/${book.id}`} className="block">
                  <div
                    className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 flex items-center justify-center text-center p-3 text-xs font-semibold"
                    style={{ backgroundColor: book.bg || "#EEEDFE", color: book.color || "#26215C" }}
                  >
                    {book.book_image_url ? (
                      <img
                        src={book.book_image_url}
                        alt={book.book_name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      book.book_name
                    )}
                    {book.discount_percent > 0 && (
                      <span className="absolute top-2 left-2 bg-purple-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                        -{book.discount_percent}%
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-semibold text-gray-900 truncate">{book.book_name}</h3>
                  <p className="text-xs text-gray-400 truncate mb-1.5">{book.book_author}</p>

                  {book.rating != null && (
                    <div className="flex items-center gap-1 mb-1.5">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs text-gray-500">{book.rating.toFixed(1)}</span>
                    </div>
                  )}
                </Link>

                <div className="flex items-center justify-between mt-1">
                  <span className="font-semibold text-purple-800 text-sm">
                    ₹{Number(book.book_price ?? 0).toFixed(0)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(book)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 active:scale-90
                      ${addedId === book.id
                        ? "bg-green-600 text-white"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-700 hover:text-white"}`}
                    aria-label="Add to cart"
                  >
                    <ShoppingCart size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes shopFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .shop-header {
          animation: shopFadeUp 0.4s ease-out both;
        }
        .shop-toolbar {
          animation: shopFadeUp 0.4s ease-out 0.05s both;
        }
        .shop-chips {
          animation: shopFadeUp 0.4s ease-out 0.1s both;
        }
        .shop-card {
          animation: shopFadeUp 0.45s ease-out both;
        }

        @keyframes shopEmptyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .shop-empty-icon {
          animation: shopEmptyFloat 2.5s ease-in-out infinite;
        }
        .shop-empty-state {
          animation: shopFadeUp 0.5s ease-out both;
        }

        @media (prefers-reduced-motion: reduce) {
          .shop-header, .shop-toolbar, .shop-chips, .shop-card, .shop-empty-state, .shop-empty-icon {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}