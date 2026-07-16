/**
 * @file server.ts
 * @description Punto de entrada principal de la aplicación con diagnóstico robusto.
 */
import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/database";

// 1. Log de diagnóstico inmediato (Se ejecuta al instante en cuanto Node inicia el archivo)
console.log("=== [DIAGNÓSTICO] INICIANDO PROCESO NODE.JS ===");
console.log("Ruta de ejecución (__dirname):", __dirname);
console.log("Variables de entorno detectadas:");
console.log("PORT:", process.env.PORT);
console.log(
  "MONGO_URI:",
  process.env.MONGO_URI ? "CONFIGURADA (Tiene valor)" : "NO DETECTADA (Vacía)",
);

const PORT = Number(process.env.PORT) || 3000;

/** Inicializa la base de datos y arranca el servidor */
const bootstrap = async (): Promise<void> => {
  try {
    console.log("Intentando conectar a MongoDB...");
    await connectDB();
    console.log("Conexión a MongoDB exitosa.");
  } catch (dbError) {
    // IMPORTANTE: Si la base de datos falla, atrapamos el error aquí.
    // Esto evita que la app muera o se quede colgada. El servidor HTTP se levantará igual
    // y nos permitirá entrar a /api/health para ver este error en los logs.
    console.error(
      "FATAL: Error al conectar a la base de datos durante el inicio:",
      dbError,
    );
  }

  try {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(
        `=== SERVIDOR ONLINE ESCUCHANDO EN EL PUERTO ${PORT} (0.0.0.0) ===`,
      );
    });
  } catch (listenError) {
    console.error(
      "FATAL: Error al iniciar el servidor HTTP (app.listen):",
      listenError,
    );
  }
};

bootstrap().catch((err) => {
  console.error("Error no controlado en la función bootstrap:", err);
});
