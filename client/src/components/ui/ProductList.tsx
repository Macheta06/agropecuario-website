/**
 * @file components/ui/ProductList.tsx
 * @description Grid responsivo de tarjetas de producto.
 * Gestiona estados: carga (skeletons), vacío y datos.
 */
import type { IProduct } from '../../types';
import { ProductCard } from './ProductCard';

interface ProductListProps {
  products: IProduct[];
  isLoading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/** Skeleton de tarjeta para estado de carga. */
const ProductCardSkeleton = () => (
  <div
    className="rounded-[0.875rem] overflow-hidden animate-pulse"
    style={{ backgroundColor: 'var(--color-surface-800)' }}
  >
    {/* Imagen placeholder */}
    <div
      className="w-full"
      style={{ aspectRatio: '1 / 1', backgroundColor: 'var(--color-surface-700)' }}
    />
    {/* Texto placeholder */}
    <div className="p-3 flex flex-col gap-2">
      <div
        className="h-3 rounded-full w-3/4"
        style={{ backgroundColor: 'var(--color-surface-700)' }}
      />
      <div
        className="h-3 rounded-full w-1/2"
        style={{ backgroundColor: 'var(--color-surface-700)' }}
      />
      <div
        className="h-5 rounded-full w-2/5 mt-1"
        style={{ backgroundColor: 'var(--color-surface-600)' }}
      />
      <div
        className="h-8 rounded-full w-full mt-1"
        style={{ backgroundColor: 'var(--color-surface-700)' }}
      />
    </div>
  </div>
);

/** Estado de lista vacía. */
const EmptyState = () => (
  <div className="col-span-full flex flex-col items-center justify-center py-20 gap-4">
    <svg
      className="w-16 h-16"
      style={{ color: 'var(--color-zinc-500)' }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      />
    </svg>
    <p className="text-lg font-medium" style={{ color: 'var(--color-zinc-400)' }}>
      No se encontraron productos
    </p>
    <p className="text-sm" style={{ color: 'var(--color-zinc-500)' }}>
      Intenta con otro término o categoría
    </p>
  </div>
);

/** Controles de paginación. */
const Pagination = ({
  page,
  totalPages,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className="col-span-full flex items-center justify-center gap-2 pt-6 pb-24">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-surface-700)',
          color: 'var(--color-zinc-300)',
        }}
      >
        ← Anterior
      </button>

      <span className="text-sm px-3" style={{ color: 'var(--color-zinc-400)' }}>
        {page} / {totalPages}
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 rounded-full text-sm font-medium transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        style={{
          backgroundColor: 'var(--color-surface-700)',
          color: 'var(--color-zinc-300)',
        }}
      >
        Siguiente →
      </button>
    </div>
  );
};

export const ProductList = ({
  products,
  isLoading,
  error,
  total,
  page,
  totalPages,
  onPageChange,
}: ProductListProps) => {
  // Estado de error
  if (error) {
    return (
      <div className="col-span-full text-center py-12" style={{ color: 'var(--color-zinc-400)' }}>
        ⚠️ {error}
      </div>
    );
  }

  return (
    <>
      {/* Contador de resultados */}
      {!isLoading && total > 0 && (
        <p className="col-span-full text-xs mb-1" style={{ color: 'var(--color-zinc-500)' }}>
          {total.toLocaleString('es-CO')} productos encontrados
        </p>
      )}

      {/* Grid de productos */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {isLoading
          ? Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
          : products.length === 0
          ? <EmptyState />
          : products.map((p) => <ProductCard key={p._id} product={p} />)
        }
      </div>

      {/* Paginación */}
      {!isLoading && (
        <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
      )}
    </>
  );
};
