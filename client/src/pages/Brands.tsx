export const Brands = () => {
  const brands = [
    { name: 'Pavinco', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=PAVINCO' },
    { name: 'Grival', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=GRIVAL' },
    { name: 'Sika', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=SIKA' },
    { name: 'Pintuco', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=PINTUCO' },
    { name: 'Stanley', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=STANLEY' },
    { name: 'Bosch', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=BOSCH' },
    { name: 'Eternit', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=ETERNIT' },
    { name: 'Mexichem', logo: 'https://placehold.co/400x200/f5f5f5/f97316?text=MEXICHEM' },
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
        <button className="btn-primary px-6 py-2">Contactar a Compras</button>
      </div>
    </div>
  );
};
