import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100">
      <div className={`bg-gray-800 text-white w-64 flex-shrink-0 ${isSidebarOpen ? 'block' : 'hidden'} md:block`}>
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">NoveCrafter</h1>
          <nav>
            <ul>
              <li className="mb-2">
                <a href="/" className="block p-2 rounded hover:bg-gray-700">Home</a>
              </li>
              <li className="mb-2">
                <a href="/codex" className="block p-2 rounded hover:bg-gray-700">Codex</a>
              </li>
              <li className="mb-2">
                <a href="/markdown" className="block p-2 rounded hover:bg-gray-700">Markdown Editor</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-lg font-semibold text-gray-900">NoveCrafter</h1>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;