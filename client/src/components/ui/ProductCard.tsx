/**
 * @file components/ui/ProductCard.tsx
 * @description Tarjeta de producto individual.
 * Muestra imagen (con fallback si imageUrl está vacío), nombre, precio
 * y botón de "Pedir por WhatsApp" que genera el mensaje pre-formateado.
 */
import type { IProduct } from '../../types';
import { formatPrice } from '../../utils/formatPrice';
import { getProductWhatsAppUrl } from '../../utils/whatsapp';

interface ProductCardProps {
  product: IProduct;
}

/** Placeholder SVG cuando el producto no tiene imagen. */
const ImageFallback = () => (
  <div
    className="w-full h-full flex flex-col items-center justify-center gap-2"
    style={{ backgroundColor: 'var(--color-surface-700)' }}
  >
    <svg
      className="w-12 h-12"
      style={{ color: 'var(--color-zinc-500)' }}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z"
      />
    </svg>
    <span className="text-xs" style={{ color: 'var(--color-zinc-500)' }}>
      Sin imagen
    </span>
  </div>
);

export const ProductCard = ({ product }: ProductCardProps) => {
  const waUrl = getProductWhatsAppUrl(product.name, product.sku);

  return (
    <article className="product-card flex flex-col overflow-hidden animate-fade-in">
      {/* Imagen del producto */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            loading="lazy"
            onError={(e) => {
              // Si la imagen falla, ocultamos el img y mostramos el fallback
              (e.target as HTMLImageElement).style.display = 'none';
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden');
            }}
          />
        ) : null}
        {/* Fallback siempre presente, oculto si hay imagen */}
        <div className={product.imageUrl ? 'hidden absolute inset-0' : 'absolute inset-0'}>
          <ImageFallback />
        </div>

        {/* SKU badge */}
        <span
          className="absolute top-2 left-2 text-xs font-mono px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            color: 'var(--color-zinc-400)',
          }}
        >
          {product.sku}
        </span>
      </div>

      {/* Info del producto */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        {/* Nombre */}
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{ color: 'var(--color-zinc-300)' }}
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Precio */}
        <p
          className="text-lg font-bold mt-auto"
          style={{ color: 'var(--color-brand-500)' }}
        >
          {formatPrice(product.price)}
        </p>

        {/* CTA WhatsApp */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full text-center text-xs py-2.5 px-3 block"
          aria-label={`Pedir ${product.name} por WhatsApp`}
        >
          🛒 Pedir por WhatsApp
        </a>
      </div>
    </article>
  );
};
