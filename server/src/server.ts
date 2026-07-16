/**
 * @file server.ts
 * @description Punto de entrada principal de la aplicación.
 * Carga las variables de entorno, establece la conexión a BD y levanta el servidor HTTP.
 */
import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/database";

// Convertimos explícitamente a Number para que TypeScript esté feliz
const PORT = Number(process.env.PORT) || 3000;

/** Inicializa la base de datos y arranca el servidor de forma secuencial. */
const bootstrap = async (): Promise<void> => {
  await connectDB();

  // El puerto ahora es garantizado tipo 'number'
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
};

bootstrap();
