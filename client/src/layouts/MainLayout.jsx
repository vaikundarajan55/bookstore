import  { useState } from 'react';
import { Outlet } from 'react-router-dom';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <Header
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div
        className={`transition-all duration-300 pt-16 min-h-screen flex flex-col ${
          sidebarOpen ? 'pl-56' : 'pl-16'
        }`}
      >
        <main className="flex-1 p-5 lg:p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}