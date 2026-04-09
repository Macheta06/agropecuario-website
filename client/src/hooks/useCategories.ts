/**
 * @file hooks/useCategories.ts
 * @description Hook para obtener y cachear la lista de categorías.
 * Abstrae el ciclo de vida de la petición (loading, error, data) del componente.
 * Principio: los componentes no hacen fetch directamente.
 */
import { useState, useEffect } from 'react';
import type { ICategory } from '../types';
import { fetchCategories } from '../services/category.service';

/** Estado que expone el hook de categorías. */
interface UseCategoriesState {
  categories: ICategory[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Carga la lista completa de categorías al montar el componente.
 * @returns {UseCategoriesState} Estado reactivo con las categorías, carga y error.
 */
export const useCategories = (): UseCategoriesState => {
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const load = async (): Promise<void> => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await fetchCategories();
        if (!cancelled) setCategories(data);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error al cargar categorías.');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void load();

    // Cleanup: evita actualizaciones de estado en componente desmontado
    return () => { cancelled = true; };
  }, []);

  return { categories, isLoading, error };
};
