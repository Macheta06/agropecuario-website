/**
 * @file hooks/useProducts.ts
 * @description Hook para obtener productos con filtros, búsqueda y paginación.
 * Re-ejecuta la petición automáticamente cuando cambian los filtros.
 * Incluye debounce interno para evitar peticiones en cada keystroke de búsqueda.
 */
import { useState, useEffect, useCallback } from 'react';
import type { IProduct, IProductFilters, IPaginatedResponse } from '../types';
import { fetchProducts } from '../services/product.service';

/** Estado que expone el hook de productos. */
interface UseProductsState {
  products: IProduct[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  /** Cambia la página actual y recarga los productos. */
  setPage: (page: number) => void;
}

const DEBOUNCE_MS = 350;
const DEFAULT_LIMIT = 20;

/**
 * Carga productos paginados y los recarga al cambiar los filtros.
 * El término de búsqueda aplica un debounce de 350ms para no sobrecargar la API.
 *
 * @param {IProductFilters} filters - Filtros controlados desde el componente padre.
 * @returns {UseProductsState} Estado reactivo con productos, paginación y helpers.
 */
export const useProducts = (filters: IProductFilters): UseProductsState => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(filters.search);

  // Debounce del término de búsqueda
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filters.search);
      setPage(1); // Reset de página al buscar
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [filters.search]);

  // Reset de página al cambiar de categoría
  useEffect(() => {
    setPage(1);
  }, [filters.categoryId]);

  const load = useCallback(async (cancelled: { value: boolean }): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);

      const result: IPaginatedResponse<IProduct> = await fetchProducts({
        search: debouncedSearch,
        categoryId: filters.categoryId,
        page,
        limit: DEFAULT_LIMIT,
      });

      if (!cancelled.value) {
        setProducts(result.data);
        setTotal(result.total);
        setTotalPages(result.totalPages);
      }
    } catch (err) {
      if (!cancelled.value) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos.');
      }
    } finally {
      if (!cancelled.value) setIsLoading(false);
    }
  }, [debouncedSearch, filters.categoryId, page]);

  useEffect(() => {
    const cancelled = { value: false };
    void load(cancelled);
    return () => { cancelled.value = true; };
  }, [load]);

  return { products, total, page, totalPages, isLoading, error, setPage };
};
