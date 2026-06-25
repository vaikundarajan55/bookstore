import React, { useState, useEffect } from "react";

export default function App() {
  const books = [
    {
      title: "The Glass Meridian",
      author: "C. Adeyemi",
      price: "₹499",
      rating: "★★★★★",
      genre: "fiction",
      bg: "#EEEDFE",
      color: "#26215C",
    },
    {
      title: "A Quiet Algorithm",
      author: "S. Park",
      price: "₹549",
      rating: "★★★★☆",
      genre: "sci-fi",
      bg: "#E1F5EE",
      color: "#04342C",
    },
    {
      title: "Lateef's Letters",
      author: "N. Ibrahim",
      price: "₹399",
      rating: "★★★★★",
      genre: "fiction",
      bg: "#FAECE7",
      color: "#4A1B0C",
    },
    {
      title: "The Bone Cartographer",
      author: "D. Reyes",
      price: "₹599",
      rating: "★★★★☆",
      genre: "mystery",
      bg: "#FBEAF0",
      color: "#4B1528",
    },
  ];

  const slides = [
    {
      title: "The Cartographer of Broken Maps",
      author: "Miriam Osei-Ware",
      subtitle: "Editor's Pick — June 2026",
    },
    {
      title: "Salt and Slow Thunder",
      author: "James Okafor",
      subtitle: "Booker Prize Shortlist 2026",
    },
    {
      title: "Orbiting the Last Light",
      author: "Yuki Tanaka",
      subtitle: "Science Fiction of the Year",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGenre, setActiveGenre] = useState("all");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  const filteredBooks =
    activeGenre === "all"
      ? books
      : books.filter((book) => book.genre === activeGenre);

  return (
    <div className="bg-gray-50 min-h-screen">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 flex items-center justify-between h-16">
        <div className="text-2xl font-bold text-purple-800">
          Folio
        </div>

        <ul className="hidden md:flex gap-8">
          <li>Browse</li>
          <li>New Arrivals</li>
          <li>Bestsellers</li>
          <li>Authors</li>
        </ul>

        <button className="bg-purple-800 text-white px-4 py-2 rounded-lg">
          Cart (3)
        </button>
      </nav>

      {/* Hero Slider */}
      <section className="bg-purple-900 text-white h-[340px] flex items-center justify-center relative">

        <button
          className="absolute left-5"
          onClick={() =>
            setCurrentSlide(
              (currentSlide - 1 + slides.length) %
                slides.length
            )
          }
        >
          ◀
        </button>

        <div className="text-center">
          <p className="text-purple-200 mb-2">
            {slides[currentSlide].subtitle}
          </p>

          <h1 className="text-5xl font-bold mb-3">
            {slides[currentSlide].title}
          </h1>

          <p className="mb-5">
            by {slides[currentSlide].author}
          </p>

          <button className="bg-purple-600 px-5 py-2 rounded-lg">
            Read a Chapter
          </button>
        </div>

        <button
          className="absolute right-5"
          onClick={() =>
            setCurrentSlide(
              (currentSlide + 1) % slides.length
            )
          }
        >
          ▶
        </button>
      </section>

      {/* Genre Filter */}
      <section className="px-8 py-10">

        <div className="flex gap-2 flex-wrap mb-6">

          {[
            "all",
            "fiction",
            "sci-fi",
            "mystery",
          ].map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-2 rounded-full border ${
                activeGenre === genre
                  ? "bg-purple-800 text-white"
                  : "bg-white"
              }`}
            >
              {genre}
            </button>
          ))}

        </div>

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">

          {filteredBooks.map((book, index) => (
            <div
              key={index}
              className="bg-white rounded-xl border overflow-hidden"
            >
              <div
                className="h-40 flex items-center justify-center text-center p-4"
                style={{
                  backgroundColor: book.bg,
                  color: book.color,
                }}
              >
                {book.title}
              </div>

              <div className="p-4">
                <h3 className="font-semibold">
                  {book.title}
                </h3>

                <p className="text-gray-500 text-sm">
                  {book.author}
                </p>

                <div className="flex justify-between mt-3">
                  <span className="font-semibold text-purple-800">
                    {book.price}
                  </span>

                  <span>{book.rating}</span>
                </div>
              </div>
            </div>
          ))}

        </div>
      </section>

      {/* Promo Banner */}
      <section className="mx-8 mb-10 bg-green-100 border border-green-300 rounded-xl p-6 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-green-800">
            Folio Plus
          </h3>

          <p>
            Unlimited reading. One flat price.
          </p>
        </div>

        <button className="bg-green-700 text-white px-5 py-2 rounded-lg">
          Start Free Trial
        </button>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t p-8">

        <div className="grid md:grid-cols-4 gap-6">

          <div>
            <h3 className="font-bold text-lg mb-2">
              Folio
            </h3>

            <p className="text-gray-500">
              Every great story deserves a great reader.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Discover
            </h4>

            <ul className="space-y-2">
              <li>New Arrivals</li>
              <li>Bestsellers</li>
              <li>Staff Picks</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Account
            </h4>

            <ul className="space-y-2">
              <li>My Library</li>
              <li>Wishlist</li>
              <li>Orders</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">
              Company
            </h4>

            <ul className="space-y-2">
              <li>About Us</li>
              <li>Blog</li>
              <li>Careers</li>
            </ul>
          </div>

        </div>

        <div className="border-t mt-8 pt-4 text-center text-gray-500 text-sm">
          © 2026 Folio Books Ltd. All rights reserved.
        </div>
      </footer>

    </div>
  );
}