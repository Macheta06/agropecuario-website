import { useRef, useState, useEffect } from 'react';
import type { ICategory } from '../../types';

interface CategoryMenuProps {
  /** Lista de categorías disponibles. */
  categories: ICategory[];
  /** ID de la categoría actualmente seleccionada (undefined = "Todas"). */
  activeCategoryId: string | undefined;
  /** Callback invocado al seleccionar una categoría. */
  onSelect: (categoryId: string | undefined) => void;
  /** Indica si las categorías aún se están cargando. */
  isLoading?: boolean;
}

/** Chip de categoría individual. */
const CategoryChip = ({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`category-chip px-4 py-2 text-sm font-medium flex-shrink-0 ${isActive ? 'active' : ''}`}
    aria-pressed={isActive}
  >
    {label}
  </button>
);

/** Skeleton de chip para estado de carga. */
const ChipSkeleton = () => (
  <div
    className="h-9 w-24 rounded-full flex-shrink-0 animate-pulse"
    style={{ backgroundColor: 'var(--color-surface-200)' }}
  />
);

export const CategoryMenu = ({
  categories,
  activeCategoryId,
  onSelect,
  isLoading = false,
}: CategoryMenuProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Calcula si hay desbordamiento a la izquierda o derecha
  const checkScrollLimits = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 2); // margen de 2px para evitar imprecisiones
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 2);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Ejecutar después de que la carga de categorías y renderizado finalice
    const timer = setTimeout(() => {
      checkScrollLimits();
    }, 100);

    el.addEventListener('scroll', checkScrollLimits);
    window.addEventListener('resize', checkScrollLimits);

    return () => {
      clearTimeout(timer);
      el.removeEventListener('scroll', checkScrollLimits);
      window.removeEventListener('resize', checkScrollLimits);
    };
  }, [categories, isLoading]);

  // Maneja el scroll suave al hacer clic en los botones
  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -250 : 250;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full group">
      {/* Botón de navegación izquierdo + Degrado difuminado */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white via-white/90 to-transparent z-10 flex items-center justify-start pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-600 hover:text-brand-500 hover:scale-105 active:scale-95 transition-all ml-1 cursor-pointer"
            aria-label="Desplazar categorías a la izquierda"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
        </div>
      )}

      {/* Contenedor principal con scroll */}
      <nav
        ref={scrollContainerRef}
        aria-label="Filtrar por categoría"
        className="w-full overflow-x-auto pb-1 no-scrollbar scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex gap-2 min-w-max px-1">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <ChipSkeleton key={i} />)
          ) : (
            <>
              {/* Opción "Todas" siempre primera */}
              <CategoryChip
                label="Todas"
                isActive={activeCategoryId === undefined}
                onClick={() => onSelect(undefined)}
              />
              {categories.map((cat) => (
                <CategoryChip
                  key={cat._id}
                  label={cat.name}
                  isActive={activeCategoryId === cat._id}
                  onClick={() =>
                    onSelect(activeCategoryId === cat._id ? undefined : cat._id)
                  }
                />
              ))}
            </>
          )}
        </div>
      </nav>

      {/* Botón de navegación derecho + Degrado difuminado */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white via-white/90 to-transparent z-10 flex items-center justify-end pointer-events-none">
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border border-zinc-200 text-zinc-600 hover:text-brand-500 hover:scale-105 active:scale-95 transition-all mr-1 cursor-pointer"
            aria-label="Desplazar categorías a la derecha"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

