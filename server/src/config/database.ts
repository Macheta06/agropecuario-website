/**
 * @file config/database.ts
 * @description Establece y gestiona la conexión con MongoDB Atlas usando Mongoose.
 * Implementa el patrón Singleton implícito de Mongoose para reutilizar la conexión.
 */
import mongoose from 'mongoose';

/**
 * Conecta la aplicación a MongoDB Atlas usando la URI definida en variables de entorno.
 * @returns {Promise<void>} Resuelve cuando la conexión es exitosa.
 * @throws {Error} Si la variable MONGODB_URI no está definida o la conexión falla.
 */
export const connectDB = async (): Promise<void> => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('La variable de entorno MONGODB_URI no está definida.');
  }

  try {
    await mongoose.connect(uri);
    console.log('✅ MongoDB Atlas conectado exitosamente.');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
};
