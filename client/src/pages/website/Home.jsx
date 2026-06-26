import { useState } from "react";
import Slider from '../../componentsweb/Slider';

const books = [
  { title: "The Glass Meridian",    author: "C. Adeyemi", price: "₹499", rating: "★★★★★", genre: "fiction", bg: "#EEEDFE", color: "#26215C" },
  { title: "A Quiet Algorithm",     author: "S. Park",    price: "₹549", rating: "★★★★☆", genre: "sci-fi",  bg: "#E1F5EE", color: "#04342C" },
  { title: "Lateef's Letters",      author: "N. Ibrahim", price: "₹399", rating: "★★★★★", genre: "fiction", bg: "#FAECE7", color: "#4A1B0C" },
  { title: "The Bone Cartographer", author: "D. Reyes",   price: "₹599", rating: "★★★★☆", genre: "mystery", bg: "#FBEAF0", color: "#4B1528" },
];

const genres = ["all", "fiction", "sci-fi", "mystery"];

export default function Home() {
  const [activeGenre, setActiveGenre] = useState("all");

  const filteredBooks = activeGenre === "all"
    ? books
    : books.filter(b => b.genre === activeGenre);

  return (
    <>
      {/* Slider belongs to Home, not WebLayout */}
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
          {filteredBooks.map((book, index) => (
            <div key={index} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
              <div
                className="h-40 flex items-center justify-center text-center p-4 font-semibold"
                style={{ backgroundColor: book.bg, color: book.color }}
              >
                {book.title}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{book.title}</h3>
                <p className="text-gray-500 text-sm">{book.author}</p>
                <div className="flex justify-between mt-3">
                  <span className="font-semibold text-purple-800">{book.price}</span>
                  <span className="text-yellow-400">{book.rating}</span>
                </div>
                <button className="mt-3 w-full py-2 rounded-xl text-sm font-semibold bg-purple-700 hover:bg-purple-800 text-white transition-all duration-200 active:scale-95">
                  Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}