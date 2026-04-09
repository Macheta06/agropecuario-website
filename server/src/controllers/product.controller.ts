/**
 * @file controllers/product.controller.ts
 * @description Controlador HTTP para el recurso Product.
 * Extrae y normaliza los query params, delega la lógica al service y serializa la response.
 */
import { Request, Response } from 'express';
import { getProducts } from '../services/product.service';
import { IProductQueryParams } from '../types';

/**
 * GET /api/products
 * Soporta los siguientes query params:
 *  - search     {string}  Texto libre para buscar por nombre o SKU.
 *  - categoryId {string}  ObjectId de la categoría para filtrar.
 *  - page       {number}  Página actual (default: 1).
 *  - limit      {number}  Productos por página (default: 20, max: 100).
 *
 * @param {Request} req - Request de Express con query params.
 * @param {Response} res - Response de Express.
 */
export const listProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const params: IProductQueryParams = {
      search: req.query.search as string | undefined,
      categoryId: req.query.categoryId as string | undefined,
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 20,
    };

    const result = await getProducts(params);
    res.json(result);
  } catch (error) {
    console.error('[ProductController] Error al listar productos:', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};
