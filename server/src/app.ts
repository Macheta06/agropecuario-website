/**
 * @file app.ts
 * @description Configuración de la aplicación Express.
 * Aplica middlewares globales y registra las rutas de la API.
 * Separado de server.ts siguiendo el principio de Responsabilidad Única (SRP).
 */
import express, { Application } from 'express';
import cors from 'cors';
import path from 'path';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';

const app: Application = express();

// --- Middlewares Globales ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Rutas de la API ---
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);

// --- Health Check ---
app.get('/api/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// --- Servidor de Archivos Estáticos del Frontend (Fase de Producción) ---
const CLIENT_DIST_PATH = process.env.CLIENT_DIST_PATH || path.join(__dirname, '../../client/dist');
app.use(express.static(CLIENT_DIST_PATH));

// Cualquier petición que no coincida con la API servirá el index.html de React (Router fallback)
app.get('*', (_req, res) => {
  res.sendFile(path.join(CLIENT_DIST_PATH, 'index.html'));
});

export default app;
