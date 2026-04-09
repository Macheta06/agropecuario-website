/**
 * @file routes/category.routes.ts
 * @description Rutas del recurso Category conectadas al controlador.
 */
import { Router } from 'express';
import { listCategories } from '../controllers/category.controller';

const router = Router();

/** GET /api/categories — Lista todas las categorías */
router.get('/', listCategories);

export default router;
