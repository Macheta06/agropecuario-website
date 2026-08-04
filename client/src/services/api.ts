/**
 * @file services/api.ts
 * @description Cliente HTTP resiliente para comunicación con el backend.
 * Implementa un Retry Pattern con Exponential Backoff + Jitter para manejar
 * de forma transparente los cold starts del servidor en hosting gratuito.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

/** Maximum time (ms) to wait for a single request before aborting. */
const REQUEST_TIMEOUT_MS = 15_000;

/** Default retry configuration. */
const RETRY_DEFAULTS = {
  maxRetries: 3,
  baseDelayMs: 1_500,
  backoffMultiplier: 2,
};

/**
 * Adds random jitter (±25%) to a delay to prevent thundering herd when
 * multiple clients retry at the exact same instant.
 */
const withJitter = (delayMs: number): number => {
  const jitterFactor = 0.75 + Math.random() * 0.5; // 0.75 – 1.25
  return Math.round(delayMs * jitterFactor);
};

/**
 * Determines whether a failed fetch should be retried.
 * - Network errors (TypeError from fetch) → always retry.
 * - Abort/timeout errors → always retry (the server is likely waking up).
 * - 5xx server errors → retry (transient).
 * - 4xx client errors → never retry (our fault, not transient).
 */
const isRetryable = (error: unknown, response?: Response): boolean => {
  if (response && response.status >= 400 && response.status < 500) return false;
  if (response && response.status >= 500) return true;
  if (error instanceof DOMException && error.name === 'AbortError') return true;
  if (error instanceof TypeError) return true; // network failure
  return false;
};

/**
 * Resilient fetch wrapper that retries on transient failures using
 * exponential backoff with jitter. Each attempt has its own AbortController
 * timeout so a cold-starting server doesn't hang the UI forever.
 */
const fetchWithRetry = async (
  url: string,
  options: RequestInit = {},
  retriesLeft = RETRY_DEFAULTS.maxRetries,
  currentDelay = RETRY_DEFAULTS.baseDelayMs,
): Promise<Response> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (!response.ok && isRetryable(null, response) && retriesLeft > 0) {
      throw Object.assign(new Error(`Server error: ${response.status}`), {
        response,
      });
    }

    return response;
  } catch (error) {
    if (retriesLeft > 0 && isRetryable(error)) {
      const delay = withJitter(currentDelay);
      console.warn(
        `[api] Request failed → retrying in ${delay}ms (${retriesLeft} left)`,
      );
      await new Promise((r) => setTimeout(r, delay));
      return fetchWithRetry(
        url,
        options,
        retriesLeft - 1,
        currentDelay * RETRY_DEFAULTS.backoffMultiplier,
      );
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
};

/**
 * Realiza una petición GET resiliente a la API del backend.
 * @template T - Tipo de dato esperado en la respuesta.
 * @param {string} endpoint - Ruta relativa del endpoint (ej. "/products").
 * @param {Record<string, string>} [params] - Parámetros de query string opcionales.
 * @returns {Promise<T>} Los datos de la respuesta tipados.
 * @throws {Error} Si la respuesta HTTP no es exitosa tras agotar reintentos.
 */
export const apiGet = async <T>(
  endpoint: string,
  params?: Record<string, string>,
): Promise<T> => {
  const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.append(key, value);
      }
    });
  }

  const response = await fetchWithRetry(url.toString());

  if (!response.ok) {
    throw new Error(`Error de API [${response.status}]: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
};
