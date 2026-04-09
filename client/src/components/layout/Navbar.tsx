/**
 * @file components/layout/Navbar.tsx
 * @description Barra de navegación superior fija.
 * Contiene el logo/nombre del almacén y el indicador de estado de conexión.
 */

interface NavbarProps {
  /** Nombre del almacén para el encabezado. */
  storeName?: string;
  /** Callback para resetear filtros al hacer click en el logo. */
  onLogoClick?: () => void;
}

export const Navbar = ({ storeName = 'Almacén Agropecuario', onLogoClick }: NavbarProps) => (
  <header
    className="sticky top-0 z-40 w-full"
    style={{
      backgroundColor: 'rgba(10, 10, 10, 0.85)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-surface-700)',
    }}
  >
    <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
      {/* Logo + Nombre */}
      <button
        onClick={() => {
          onLogoClick?.();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-2.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
        aria-label="Volver al inicio y limpiar filtros"
      >
        {/* Ícono de ferretería / almacén */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'var(--color-brand-500)' }}
        >
          <svg
            className="w-5 h-5 fill-white"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12 3L2 9v13h6v-7h8v7h6V9L12 3zm0 2.236L20 10.3V20h-2v-7H6v7H4V10.3L12 5.236z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-bold leading-none" style={{ color: 'var(--color-zinc-300)' }}>
            {storeName}
          </p>
          <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--color-zinc-500)' }}>
            Catálogo Digital
          </p>
        </div>
      </button>

      {/* Botón de WhatsApp en Navbar para desktop */}
      <a
        href="https://wa.me/"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
        style={{
          backgroundColor: 'rgba(37, 211, 102, 0.15)',
          color: '#25d366',
          border: '1px solid rgba(37, 211, 102, 0.3)',
        }}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M16.002 2C8.268 2 2 8.267 2 16c0 2.49.657 4.83 1.804 6.855L2 30l7.332-1.777A13.94 13.94 0 0016.002 30C23.732 30 30 23.733 30 16S23.732 2 16.002 2zm6.36 19.924c-.348-.174-2.06-1.016-2.38-1.132-.32-.116-.552-.174-.784.174-.232.348-.9 1.132-1.103 1.364-.202.232-.406.26-.754.086-.348-.174-1.47-.54-2.8-1.726-1.033-.924-1.73-2.064-1.933-2.41-.203-.346-.022-.534.152-.707.157-.155.348-.406.522-.61.174-.203.232-.347.348-.578.116-.232.058-.434-.028-.61-.087-.174-.784-1.89-1.073-2.588-.283-.68-.57-.587-.784-.598l-.667-.012a1.278 1.278 0 00-.927.434c-.319.348-1.218 1.19-1.218 2.9s1.247 3.363 1.42 3.596c.174.232 2.454 3.744 5.946 5.25.83.357 1.48.57 1.985.73.833.264 1.592.226 2.192.137.668-.1 2.06-.84 2.35-1.652.29-.81.29-1.506.202-1.652-.086-.145-.32-.23-.667-.406z" />
        </svg>
        Contáctenos
      </a>
    </div>
  </header>
);
