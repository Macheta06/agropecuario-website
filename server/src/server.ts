/**
 * @file server.ts
 * @description Punto de entrada principal de la aplicación.
 * Carga las variables de entorno, establece la conexión a BD y levanta el servidor HTTP.
 */
import 'dotenv/config';
import app from './app';
import { connectDB } from './config/database';

const PORT = process.env.PORT ?? 3000;

/** Inicializa la base de datos y arranca el servidor de forma secuencial. */
const bootstrap = async (): Promise<void> => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
    console.log(`   Entorno: ${process.env.NODE_ENV ?? 'development'}`);
  });
};

bootstrap();
