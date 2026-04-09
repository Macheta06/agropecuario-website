/**
 * @file services/category.service.ts
 * @description Servicio de acceso a datos para Categorías.
 * Encapsula las llamadas HTTP al backend; los hooks no saben nada de fetch/URLs.
 */
import { apiGet } from './api';
import type { ICategory } from '../types';

/**
 * Obtiene todas las categorías disponibles del catálogo.
 * @returns {Promise<ICategory[]>} Lista de categorías ordenadas alfabéticamente.
 */
export const fetchCategories = async (): Promise<ICategory[]> => {
  const response = await apiGet<{ data: ICategory[] }>('/categories');
  return response.data;
};
