/**
 * @file services/category.service.ts
 * @description Capa de lógica de negocio para el recurso Category.
 * Principio SRP: este módulo sólo sabe hablar con el modelo Category.
 * El controller no sabe nada de Mongoose; sólo llama a estas funciones.
 */
import { CategoryModel, ICategoryDocument } from '../models/category.model';

/**
 * Devuelve todas las categorías ordenadas alfabéticamente.
 * @returns {Promise<ICategoryDocument[]>} Lista completa de categorías.
 */
export const getAllCategories = async (): Promise<ICategoryDocument[]> => {
  return CategoryModel.find({}).sort({ name: 1 }).lean<ICategoryDocument[]>();
};
