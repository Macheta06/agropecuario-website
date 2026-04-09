/**
 * @file services/product.service.ts
 * @description Capa de lógica de negocio para el recurso Product.
 *
 * Responsabilidades:
 * - Construir dinámicamente el query de filtrado (búsqueda + categoría).
 * - Calcular la paginación.
 * - Retornar datos listos para serializar; el controller no toca Mongoose.
 */
import { Types } from 'mongoose';
import { ProductModel, IProductDocument } from '../models/product.model';
import { IProductQueryParams, IPaginatedResponse } from '../types';

/** Límite máximo de productos por página para evitar abusos. */
const MAX_LIMIT = 100;
/** Límite por defecto si no se especifica. */
const DEFAULT_LIMIT = 20;

/**
 * Obtiene una lista paginada de productos aplicando filtros opcionales.
 *
 * @param {IProductQueryParams} params - Parámetros de búsqueda, categoría y paginación.
 * @returns {Promise<IPaginatedResponse<IProductDocument>>} Respuesta paginada tipada.
 */
export const getProducts = async (
  params: IProductQueryParams
): Promise<IPaginatedResponse<IProductDocument>> => {
  const {
    search,
    categoryId,
    page = 1,
    limit = DEFAULT_LIMIT,
  } = params;

  // Sanitizar paginación
  const safePage = Math.max(1, Number(page));
  const safeLimit = Math.min(Math.max(1, Number(limit)), MAX_LIMIT);
  const skip = (safePage - 1) * safeLimit;

  // Construir filtro dinámico (Open/Closed principle: agregar filtros sin romper los existentes)
  const filter: Record<string, unknown> = { isActive: true };

  if (categoryId && Types.ObjectId.isValid(categoryId)) {
    filter.categoryId = new Types.ObjectId(categoryId);
  }

  if (search && search.trim().length > 0) {
    // Búsqueda insensible a mayúsculas/acentos por nombre o SKU
    const regex = new RegExp(search.trim(), 'i');
    filter.$or = [{ name: regex }, { sku: regex }];
  }

  // Ejecutar conteo y listado en paralelo para optimizar el tiempo de respuesta
  const [total, data] = await Promise.all([
    ProductModel.countDocuments(filter),
    ProductModel.find(filter)
      .select('name description price sku imageUrl categoryId') // Solo campos necesarios para la UI
      .sort({ name: 1 })
      .skip(skip)
      .limit(safeLimit)
      .lean<IProductDocument[]>(),
  ]);

  return {
    data,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
};
