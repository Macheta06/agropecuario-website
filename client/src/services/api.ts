/**
 * @file services/api.ts
 * @description Cliente HTTP base para comunicación con el backend.
 * Centraliza la URL base y los headers comunes. Patrón: Service Layer.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/**
 * Realiza una petición GET a la API del backend.
 * @template T - Tipo de dato esperado en la respuesta.
 * @param {string} endpoint - Ruta relativa del endpoint (ej. "/products").
 * @param {Record<string, string>} [params] - Parámetros de query string opcionales.
 * @returns {Promise<T>} Los datos de la respuesta tipados.
 * @throws {Error} Si la respuesta HTTP no es exitosa.
 */
export const apiGet = async <T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<T> => {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Error de API [${response.status}]: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
