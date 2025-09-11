import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: 'Feed', path: '/' },
    { label: 'Search', path: '/search' },
    { label: 'Messages', path: '/messages' },
    { label: 'Profile', path: '/profile' },
    ...(user?.role === 'owner'
      ? [
          { label: 'Admin', path: '/admin' },
          { label: 'Users', path: '/admin/users' },
          { label: 'Logs', path: '/admin/logs' },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black text-white flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-purple-500/20 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-wide">🔮 SpiritTok</h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-sm font-medium transition-colors ${
                location.pathname === item.path
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </header>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="md:hidden bg-black border-b border-purple-500/20 px-4 py-2 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={`block text-sm font-medium ${
                location.pathname === item.path
                  ? 'text-purple-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      )}

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-gray-500 border-t border-purple-500/20">
        &copy; {new Date().getFullYear()} SpiritTok. All rights reserved.
      </footer>
    </div>
  );
};

export default AppLayout;
