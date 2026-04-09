/**
 * @file components/ui/CategoryMenu.tsx
 * @description Menú de filtrado por categoría.
 * En móvil: fila de chips con scroll horizontal y snap.
 * En desktop: misma fila pero con más espacio y wrapping opcional.
 */
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
    style={{ backgroundColor: 'var(--color-surface-700)' }}
  />
);

export const CategoryMenu = ({
  categories,
  activeCategoryId,
  onSelect,
  isLoading = false,
}: CategoryMenuProps) => (
  <nav
    aria-label="Filtrar por categoría"
    className="w-full overflow-x-auto pb-1"
    style={{ scrollbarWidth: 'none' }}
  >
    <div className="flex gap-2 min-w-max px-1">
      {isLoading ? (
        // Skeletons mientras carga
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
);
