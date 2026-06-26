import { useEffect, useState } from "react";

const slides = [  // ← Move slides OUTSIDE or BEFORE useEffect
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

export default function Slider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (  // ← THIS was missing
    <section className="bg-purple-900 text-white h-[340px] flex items-center justify-center relative">
      <button
        className="absolute left-5"
        onClick={() =>
          setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)
        }
      >
        ◀
      </button>

      <div className="text-center">
        <p className="text-purple-200 mb-2">{slides[currentSlide].subtitle}</p>
        <h1 className="text-5xl font-bold mb-3">{slides[currentSlide].title}</h1>
        <p className="mb-5">by {slides[currentSlide].author}</p>
        <button className="bg-purple-600 px-5 py-2 rounded-lg">
          Read a Chapter
        </button>
      </div>

      <button
        className="absolute right-5"
        onClick={() =>
          setCurrentSlide((currentSlide + 1) % slides.length)
        }
      >
        ▶
      </button>
    </section>
  );
}