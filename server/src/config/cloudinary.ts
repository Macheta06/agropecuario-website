import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configuración de la cuenta
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/**
 * Aplica parámetros de optimización automática a una URL de Cloudinary.
 * @param url - La URL original de la imagen en Cloudinary
 * @returns La URL con f_auto (formato automático) y q_auto (calidad automática)
 */
export const optimizeCloudinaryUrl = (url: string | undefined): string => {
  if (!url) return 'https://placehold.co/600x600?text=Sin+Imagen';
  
  // Si la imagen ya viene de Cloudinary, le inyectamos los parámetros de optimización si no los tiene
  if (url.includes('res.cloudinary.com')) {
    // Insertamos /f_auto,q_auto/ después de /upload/
    return url.replace('/upload/', '/upload/f_auto,q_auto/');
  }
  
  return url;
};

export default cloudinary;
