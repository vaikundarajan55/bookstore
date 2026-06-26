import { Outlet } from 'react-router-dom';
import NavBar from '../componentsweb/NavBar';
import Footer from '../componentsweb/Footer';

export default function WebLayout() {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <NavBar />

      {/* Page content renders here — Slider, sections, etc come from each page */}
      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}