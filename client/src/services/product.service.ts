/**
 * @file services/product.service.ts
 * @description Servicio de acceso a datos para Productos.
 * Construye los query params y llama al cliente HTTP genérico.
 */
import { apiGet } from './api';
import type { IProduct, IProductFilters, IPaginatedResponse } from '../types';

/**
 * Obtiene una página de productos aplicando filtros opcionales.
 * @param {IProductFilters} filters - Filtros de búsqueda, categoría y paginación.
 * @returns {Promise<IPaginatedResponse<IProduct>>} Respuesta paginada con productos.
 */
export const fetchProducts = async (
  filters: IProductFilters = {}
): Promise<IPaginatedResponse<IProduct>> => {
  const params: Record<string, string> = {};

  if (filters.search)     params.search     = filters.search;
  if (filters.categoryId) params.categoryId = filters.categoryId;
  if (filters.page)       params.page       = String(filters.page);
  if (filters.limit)      params.limit      = String(filters.limit);

  return apiGet<IPaginatedResponse<IProduct>>('/products', params);
};
