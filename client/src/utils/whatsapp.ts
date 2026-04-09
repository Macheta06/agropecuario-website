/**
 * @file utils/whatsapp.ts
 * @description Generadores de URLs para la API de WhatsApp Business.
 * Centraliza el número de teléfono y los mensajes pre-formateados.
 */

/** Número de WhatsApp del almacén (con código de país, sin espacios ni +). */
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER ?? '57XXXXXXXXXX';

/**
 * Genera el URL de WhatsApp para consultar la disponibilidad de un producto específico.
 * @param {string} productName - Nombre del producto de interés.
 * @param {string} sku - Código SKU del producto.
 * @returns {string} URL de wa.me con mensaje pre-formateado.
 */
export const getProductWhatsAppUrl = (productName: string, sku: string): string => {
  const message = `Hola, estoy interesado en el producto *${productName}* (SKU: ${sku}). ¿Tienen disponibilidad?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};

/**
 * Genera el URL de WhatsApp para contacto general con el almacén.
 * @returns {string} URL de wa.me sin mensaje pre-definido.
 */
export const getGeneralWhatsAppUrl = (): string => {
  const message = '¡Hola! Me gustaría recibir más información sobre sus productos.';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
};
