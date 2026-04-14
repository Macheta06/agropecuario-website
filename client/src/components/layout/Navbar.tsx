import { NavLink, Link } from 'react-router-dom';

export const Navbar = () => {
  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Tienda', path: '/tienda' },
    { name: 'Marcas', path: '/marcas' },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full"
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--color-surface-200)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Izquierda: Logo */}
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-all">
          <img 
            src="/logo.png" 
            alt="Almacén Agropecuario Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Centro/Navegación: Pestañas */}
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

        {/* Derecha: Espacio equilibrado (móvil menu o vacío por ahora) */}
        <div className="flex md:hidden">
           {/* Aquí podríamos poner un menú hamburguesa si fuera necesario */}
           <span className="text-brand-600 font-bold">MENU</span>
        </div>
        <div className="hidden md:block w-32">
          {/* Espaciador para centrar ópticamente el nav */}
        </div>
      </div>
    </header>
  );
};
