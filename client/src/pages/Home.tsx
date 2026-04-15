import { getGeneralWhatsAppUrl } from '../utils/whatsapp';

export const Home = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-zinc-900 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
            Almacén <span className="text-brand-500">Agropecuario</span>
          </h1>
          <p className="text-xl text-zinc-200 mb-8 max-w-2xl mx-auto">
            Más de 30 años equipando el campo y la construcción con las mejores marcas del mercado.
          </p>
          <a href="/tienda" className="btn-primary px-8 py-3.5 text-lg inline-block">
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
          <p className="text-zinc-500">Lun - Sáb: 7:00 AM - 6:00 PM</p>
        </div>

        <div className="product-card p-8 flex flex-col items-center">
           <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mb-4 text-brand-500">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
          </div>
          <h3 className="text-xl font-bold text-surface-800 mb-2">Contacto</h3>
          <p className="text-zinc-500">Cel: +57 320 460 2858<br/>Ventas y pedidos mayoristas</p>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-brand-50 py-16 px-4 text-center">
         <h2 className="text-3xl font-bold text-brand-600 mb-6 font-mono">¿Necesitas asesoría técnica?</h2>
         <a href={getGeneralWhatsAppUrl()} target="_blank" className="btn-primary px-10 py-4 font-bold">
           Hablar con un Experto
         </a>
      </section>
    </div>
  );
};
