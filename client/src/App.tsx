import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { Brands } from './pages/Brands';

function App() {
  return (
    <div className="min-h-dvh flex flex-col bg-surface-50">
      {/* El Navbar se mantiene en todas las vistas */}
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tienda" element={<Shop />} />
          <Route path="/marcas" element={<Brands />} />
          {/* Fallback a Home si la ruta no existe */}
          <Route path="*" element={<Home />} />
        </Routes>
      </div>

      {/* El botón de WhatsApp es global */}
      <WhatsAppButton />
      
      {/* Footer simple sugerido para el modo Light */}
      <footer className="bg-white border-t border-zinc-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-zinc-400 text-sm">
            © {new Date().getFullYear()} Almacén Agropecuario. Machetá, Cundinamarca.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
