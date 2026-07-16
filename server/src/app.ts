/**
 * @file app.ts
 * @description Configuración de la aplicación Express.
 * Aplica middlewares globales y registra las rutas de la API.
 * Separado de server.ts siguiendo el principio de Responsabilidad Única (SRP).
 */
import express, { Application } from "express";
import cors from "cors";
import path from "path";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";

const app: Application = express();

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas de la API ---
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// --- Health Check ---
app.get("/api/health", (_req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

const CLIENT_DIST_PATH = path.join(__dirname, "../dist"); // '..' para subir de /server a la raíz
app.use(express.static(CLIENT_DIST_PATH));

app.get("*", (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST_PATH, "index.html"));
});

export default app;
