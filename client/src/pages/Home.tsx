import { useState, useEffect } from 'react';
import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

const HERO_IMAGES = [
  '/banner/banner-1.webp',
  '/banner/banner-2.webp',
  '/banner/banner-3.webp',
  '/banner/banner-4.webp',
  '/banner/banner-5.webp',
  '/banner/banner-6.webp',
  '/banner/banner-7.webp',
  '/banner/banner-8.webp',
  '/banner/banner-9.webp',
  '/banner/banner-10.webp',
  '/banner/banner-11.webp',
  '/banner/banner-12.webp',
  '/banner/banner-13.webp'
];

const BRAND_LOGOS = [
  { name: 'ABRACOL', logo: '/logos/abracol.webp' },
  { name: 'AGROALIANZA SEMILLAS', logo: '/logos/agroalianza-semillas.webp' },
  { name: 'BELLOTA', logo: '/logos/bellota.webp' },
  { name: 'BOCCHERINI', logo: '/logos/boccherini.webp' },
  { name: 'CODELCA', logo: '/logos/codelca.webp' },
  { name: 'CORONA', logo: '/logos/corona.webp' },
  { name: 'DEWALT', logo: '/logos/dewalt.webp' },
  { name: 'EL CABALLO', logo: '/logos/el-caballo.webp' },
  { name: 'GRIVAL', logo: '/logos/grival.webp' },
  { name: 'HERRAGRO', logo: '/logos/herragro.webp' },
  { name: 'LHAURA', logo: '/logos/lhaura.webp' },
  { name: 'PALMERA GEL', logo: '/logos/palmera-gel.webp' },
  { name: 'PAVCO', logo: '/logos/pavco.webp' },
  { name: 'ROUND UP', logo: '/logos/round-up.webp' },
  { name: 'ROYAL CONDOR', logo: '/logos/royal-condor.webp' },
  { name: 'STIHL', logo: '/logos/stihl.webp' },
  { name: 'TRAMONTINA', logo: '/logos/tramontina.webp' },
  { name: 'TRUPER', logo: '/logos/truper.webp' },
  { name: 'VARTA', logo: '/logos/varta.webp' },
  { name: 'ZUBIOLA', logo: '/logos/zubiola.webp' }
];

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero Section con Carrusel Automático (80vh de alto) - Solo visualización de fotos */}
      <section className="relative h-[80vh] flex items-center justify-center bg-zinc-950 overflow-hidden">
        {/* Imágenes del carrusel con efecto de fundido suave (cross-fade) */}
        {HERO_IMAGES.map((imgUrl, index) => (
          <div
            key={imgUrl}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Fondo difuminado para rellenar los bordes (evita cortes de la imagen) */}
            <div
              className="absolute inset-0 bg-cover bg-center filter blur-xl opacity-25 scale-110"
              style={{ backgroundImage: `url('${imgUrl}')` }}
            />
            {/* Imagen principal contenida al 100% en el centro con opacidad original */}
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-100"
              style={{ backgroundImage: `url('${imgUrl}')` }}
            />
          </div>
        ))}

        {/* Indicadores de diapositivas (Dots) */}
        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-2">
          {HERO_IMAGES.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrentSlide(index)}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                index === currentSlide
                  ? 'bg-brand-500 w-8'
                  : 'bg-white/50 hover:bg-white w-2.5'
              }`}
              aria-label={`Ir a la diapositiva ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Banda de Marcas Aliadas (Infinite Marquee) */}
      <section className="w-full bg-white border-y border-zinc-200 py-6 overflow-hidden">
        <div className="relative w-full flex overflow-x-hidden">
          <div className="flex gap-16 animate-marquee whitespace-nowrap">
            {/* Primera tanda de marcas */}
            {BRAND_LOGOS.map((brand, idx) => (
              <div
                key={`brand-1-${idx}`}
                className="flex items-center justify-center w-36 h-12 flex-shrink-0"
                title={brand.name}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
            {/* Segunda tanda duplicada para el bucle continuo sin saltos */}
            {BRAND_LOGOS.map((brand, idx) => (
              <div
                key={`brand-2-${idx}`}
                className="flex items-center justify-center w-36 h-12 flex-shrink-0"
                title={brand.name}
              >
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-w-full max-h-full object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sección de Llamado a la Acción (CTA) para conocer productos */}
      <section className="bg-zinc-50 border-b border-zinc-200 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-surface-800 tracking-tight">
            Conozca nuestros productos
          </h2>
          <p className="text-zinc-500 max-w-xl leading-relaxed">
            Explore nuestro catálogo digital completo y descubra por qué llevamos más de 50 años siendo la opción líder de la región.
          </p>
          <a
            href="/tienda"
            className="btn-primary px-10 py-3.5 text-lg font-semibold shadow-md inline-block hover:scale-105 transition-transform"
          >
            Explorar Catálogo
          </a>
        </div>
      </section>

      {/* Información del Local */}
      <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="product-card p-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-surface-800 mb-2">Dirección</h3>
          <p className="text-zinc-500">Calle 7 #4-15<br/>Madrid, Cundinamarca</p>
        </div>

        <div className="product-card p-8 flex flex-col items-center">
          <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-surface-800 mb-2">Horarios</h3>
          <p className="text-zinc-500">Lun - Sáb: 7:30 AM - 6:00 PM</p>
        </div>

        <div className="product-card p-8 flex flex-col items-center">
           <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-surface-800 mb-2">Contacto</h3>
          <p className="text-zinc-500">Cel: +57 320 460 2858<br/>Ventas y pedidos</p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-brand-50 py-16 px-4 text-center">
         <h2 className="text-3xl font-bold text-brand-600 mb-6 font-mono">¿Necesitas asesoría técnica?</h2>
         <a href={getGeneralWhatsAppUrl()} target="_blank" rel="noopener noreferrer" className="btn-primary px-10 py-4 font-bold">
           Hablar con un Experto
         </a>
      </section>
    </div>
  );
};
