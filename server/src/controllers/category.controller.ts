/**
 * @file controllers/category.controller.ts
 * @description Controlador HTTP para el recurso Category.
 * Responsabilidad única: interpretar la request, delegar al service y serializar la response.
 * No contiene lógica de negocio ni acceso a Mongoose.
 */
import { Request, Response } from 'express';
import { getAllCategories } from '../services/category.service';

/**
 * GET /api/categories
 * Devuelve la lista completa de categorías para pintar el menú de navegación.
 *
 * @param {Request} _req - Request de Express (no se usa en este endpoint).
 * @param {Response} res - Response de Express.
 */
export const listCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.json({ data: categories });
  } catch (error) {
    console.error('[CategoryController] Error al listar categorías:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
