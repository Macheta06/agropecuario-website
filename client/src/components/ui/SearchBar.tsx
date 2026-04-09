/**
 * @file components/ui/SearchBar.tsx
 * @description Input de búsqueda controlado con icono de lupa.
 * Componente "dumb": solo recibe valor y callback, sin lógica interna.
 */

interface SearchBarProps {
  /** Valor actual del input (controlado desde el padre). */
  value: string;
  /** Callback invocado con el nuevo valor en cada keystroke. */
  onChange: (value: string) => void;
}

export const SearchBar = ({ value, onChange }: SearchBarProps) => (
  <div className="relative w-full">
    {/* Icono de lupa */}
    <svg
      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
      style={{ color: 'var(--color-zinc-500)' }}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" strokeLinecap="round" />
    </svg>

    <input
      id="product-search"
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar por nombre o referencia..."
      className="search-input w-full pl-11 pr-4 py-3 text-sm"
      autoComplete="off"
      aria-label="Buscar productos"
    />
  </div>
);
