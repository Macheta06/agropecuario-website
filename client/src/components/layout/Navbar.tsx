import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Tienda', path: '/tienda' },
    { name: 'Marcas', path: '/marcas' },
  ];

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-surface-200)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all">
          <img
            src="/logo-principal.png"
            alt="El Agropecuario Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `px-6 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                  isActive
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'text-zinc-500 hover:text-brand-500 hover:bg-brand-50'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Hamburger button (mobile only) */}
        <button
          className="flex md:hidden items-center justify-center w-10 h-10 rounded-lg hover:bg-zinc-100 transition-colors"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
        >
          <div className="relative w-5 h-4 flex flex-col justify-between">
            <span
              className="block h-0.5 w-5 bg-zinc-700 rounded-full transition-all duration-300 origin-center"
              style={isOpen ? { transform: 'translateY(7px) rotate(45deg)' } : {}}
            />
            <span
              className="block h-0.5 w-5 bg-zinc-700 rounded-full transition-all duration-300"
              style={isOpen ? { opacity: 0, transform: 'scaleX(0)' } : {}}
            />
            <span
              className="block h-0.5 w-5 bg-zinc-700 rounded-full transition-all duration-300 origin-center"
              style={isOpen ? { transform: 'translateY(-7px) rotate(-45deg)' } : {}}
            />
          </div>
        </button>

        {/* Desktop spacer */}
        <div className="hidden md:block w-32" />
      </div>

      {/* Mobile menu overlay */}
      <div
        className="md:hidden fixed inset-0 bg-black/40 transition-opacity duration-300"
        style={{
          top: '3.5rem',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <nav
        className="md:hidden absolute left-0 right-0 bg-white border-b border-zinc-200 shadow-lg transition-all duration-300 overflow-hidden"
        style={{
          maxHeight: isOpen ? '16rem' : '0',
          opacity: isOpen ? 1 : 0,
        }}
      >
        <div className="flex flex-col px-4 py-3 gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200 ${
                  isActive
                  ? 'bg-brand-500 text-white'
                  : 'text-zinc-600 hover:bg-brand-50 hover:text-brand-600'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

