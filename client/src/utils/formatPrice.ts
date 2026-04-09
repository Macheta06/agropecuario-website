/**
 * @file utils/formatPrice.ts
 * @description Funciones utilitarias para formateo de precios en COP.
 */

const COP_FORMATTER = new Intl.NumberFormat('es-CO', {
  style: 'currency',
  currency: 'COP',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/**
 * Formatea un número como precio en pesos colombianos.
 * @param {number} price - Precio en COP (ej. 12500).
 * @returns {string} Precio formateado (ej. "$ 12.500").
 */
export const formatPrice = (price: number): string => {
  return COP_FORMATTER.format(price);
};
