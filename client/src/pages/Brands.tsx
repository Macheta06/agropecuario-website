import { getPurchasingWhatsAppUrl } from '../utils/whatsapp';

export const Brands = () => {
  const brands = [
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

  return (
    <div className="animate-fade-in max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-extrabold text-surface-800 mb-4">Marcas <span className="text-brand-500">Aliadas</span></h1>
        <p className="text-zinc-500 max-w-xl mx-auto">
          Distribuimos productos de las marcas líderes en construcción, agro y hogar, garantizando calidad en cada compra.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {brands.map((brand) => (
          <div key={brand.name} className="product-card p-6 flex items-center justify-center grayscale hover:grayscale-0 grayscale-transition">
            <img src={brand.logo} alt={brand.name} className="max-h-16 w-auto object-contain" />
          </div>
        ))}
      </div>

      <div className="mt-20 p-8 bg-zinc-50 rounded-2xl border border-zinc-200 text-center">
        <h2 className="text-xl font-bold text-zinc-800 mb-4">¿Distribuyes alguna marca y quieres trabajar con nosotros?</h2>
        <p className="text-zinc-500 mb-6">Estamos en constante búsqueda de los mejores productos para nuestros clientes en la región.</p>
        <a
          href={getPurchasingWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary px-6 py-2 inline-block"
        >
          Contactar a Compras
        </a>
      </div>
    </div>
  );
};
