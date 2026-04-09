/**
 * @file routes/product.routes.ts
 * @description Rutas del recurso Product conectadas al controlador.
 */
import { Router } from 'express';
import { listProducts } from '../controllers/product.controller';

const router = Router();

/** GET /api/products — Lista productos con filtros opcionales y paginación */
router.get('/', listProducts);

export default router;
