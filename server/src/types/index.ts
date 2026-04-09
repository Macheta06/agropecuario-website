/**
 * @file types/index.ts
 * @description Definiciones de interfaces TypeScript globales del dominio.
 * Estas interfaces modelan los datos de negocio y son la fuente de verdad del tipado.
 */

/** Interfaz base para documentos de Mongoose (agrega _id y timestamps). */
export interface IBaseDocument {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Representa una categoría de productos en el catálogo.
 */
export interface ICategory extends IBaseDocument {
  /** Nombre único y legible de la categoría (ej. "Herramientas Eléctricas"). */
  name: string;
  /** Slug URL-friendly para uso en rutas (ej. "herramientas-electricas"). */
  slug: string;
  /** URL opcional de un ícono o imagen representativa de la categoría. */
  imageUrl?: string;
}

/**
 * Representa un producto dentro del catálogo de la ferretería.
 */
export interface IProduct extends IBaseDocument {
  /** Nombre comercial del producto. */
  name: string;
  /** Descripción breve del producto para mostrar en la tarjeta. */
  description: string;
  /** Precio en moneda local (COP). */
  price: number;
  /** Código de referencia interno o SKU del fabricante. */
  sku: string;
  /** URL de la imagen del producto. Puede estar vacío; el frontend usará un fallback. */
  imageUrl: string;
  /** Referencia al ID de la categoría a la que pertenece este producto. */
  categoryId: string;
  /** Indica si el producto está activo y visible en el catálogo. */
  isActive: boolean;
}

/**
 * Parámetros de consulta para el endpoint GET /api/products.
 */
export interface IProductQueryParams {
  /** Término de búsqueda de texto libre (por nombre o SKU). */
  search?: string;
  /** Filtrar por ID de categoría. */
  categoryId?: string;
  /** Número de página para paginación (base 1). */
  page?: number;
  /** Número de elementos por página. */
  limit?: number;
}

/**
 * Estructura de respuesta paginada genérica de la API.
 * @template T - Tipo de los elementos en el array `data`.
 */
export interface IPaginatedResponse<T> {
  /** Array de elementos de la página actual. */
  data: T[];
  /** Total de elementos que coincidieron con el filtro. */
  total: number;
  /** Página actual. */
  page: number;
  /** Elementos por página usados en la consulta. */
  limit: number;
  /** Total de páginas disponibles. */
  totalPages: number;
}
