import { useEffect, useState } from "react";
import Slider from '../../componentsweb/Slider';
import { useDispatch, useSelector } from "react-redux";
import { getAllBooksData } from "../../Redux/slices/websiteSlice";
import { ImageOff } from "lucide-react";

const genres = ["all", "fiction", "sci-fi", "mystery"];

export default function Home() {
  const [activeGenre, setActiveGenre] = useState("all");
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);
  const status = useSelector((state) => state.allwebsitedata?.status);
  const allBooks = useSelector((state) => state.allwebsitedata?.allwebsite ?? []);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(getAllBooksData());
    }
  }, [dispatch, status]);

  const filteredBooks = activeGenre === "all"
    ? allBooks
    : allBooks.filter(b => b.genre === activeGenre);

  const isLoading = status === 'loading' || status === 'idle';

  return (
    <>
      <Slider />

      <section className="px-8 py-10">
        {/* Genre Filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          {genres.map(genre => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-full border capitalize transition-all duration-200 active:scale-95
                ${activeGenre === genre
                  ? "bg-purple-800 text-white border-purple-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border overflow-hidden animate-pulse"
              >
                <div className="h-40 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                  <div className="h-3 bg-gray-200 rounded w-1/3 mt-3" />
                  <div className="h-9 bg-gray-200 rounded-xl mt-3" />
                </div>
              </div>
            ))
          ) : filteredBooks.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-center book-empty-state">
              <div className="w-24 h-24 rounded-full bg-purple-50 flex items-center justify-center mb-4 book-empty-icon">
                <ImageOff size={36} className="text-purple-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No books found</h3>
              <p className="text-sm text-gray-400 mt-1">Try a different genre filter.</p>
            </div>
          ) : (
            filteredBooks.map((book, index) => {
              const imageUrl = book.book_image_url || book.image_url || book.image || null;
              return (
                <div
                  key={book.book_id ?? book.id ?? index}
                  className="book-card bg-white rounded-xl border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                  style={{ animationDelay: `${index * 70}ms` }}
                >
                  <div
                    className="h-40 flex items-center justify-center text-center p-4 font-semibold relative overflow-hidden"
                    style={{ backgroundColor: book.bg || "#EEEDFE", color: book.color || "#26215C" }}
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={book.book_name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={(e) => { e.target.style.display = 'none'; }}
                        loading="lazy"
                      />
                    ) : (
                      <span className="relative z-10">{book.book_name}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate">{book.book_name}</h3>
                    <p className="text-gray-500 text-sm truncate">{book.book_author}</p>
                    <div className="flex justify-between mt-3">
                      <span className="font-semibold text-purple-800">₹{book.book_price}</span>
                      <span className="text-yellow-400">{book.rating || "★★★★☆"}</span>
                    </div>
                    <button className="mt-3 w-full py-2 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-95">
                      Buy Now
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      <style>{`
        @keyframes bookFadeInUp {
          from {
            opacity: 0;
            transform: translateY(24px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .book-card {
          animation: bookFadeInUp 0.5s ease-out both;
        }
        @keyframes emptyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .book-empty-icon {
          animation: emptyFloat 2.5s ease-in-out infinite;
        }
        .book-empty-state {
          animation: bookFadeInUp 0.5s ease-out both;
        }
      `}</style>
    </>
  );
}