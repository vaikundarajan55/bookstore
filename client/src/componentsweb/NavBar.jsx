export default function NavBar() {
  return (  // ← missing
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 px-8 flex items-center justify-between h-16">
      <div className="text-2xl font-bold text-purple-800">Folio</div>
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
  );  // ← missing
}