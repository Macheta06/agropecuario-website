import { useState, useEffect } from 'react';
import { SearchBar } from '../components/ui/SearchBar';
import { CategoryMenu } from '../components/ui/CategoryMenu';
import { ProductList } from '../components/ui/ProductList';
import { useCategories } from '../hooks/useCategories';
import { useProducts } from '../hooks/useProducts';

export const Shop = () => {
  const [search, setSearch] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  const { categories, isLoading: categoriesLoading } = useCategories();
  const {
    products,
    total,
    page,
    totalPages,
    isLoading: productsLoading,
    error,
    setPage,
  } = useProducts({ search, categoryId: selectedCategoryId });

  // ── Título Dinámico ────────────────────────────────────────────────────────
  useEffect(() => {
    const activeCategory = categories.find(c => c._id === selectedCategoryId);
    const suffix = 'El Agropecuario';
    
    if (search) {
      document.title = `Buscando "${search}" | ${suffix}`;
    } else if (activeCategory) {
      document.title = `${activeCategory.name} | ${suffix}`;
    } else {
      document.title = `Tienda | ${suffix}`;
    }
  }, [search, selectedCategoryId, categories]);

  // ── Auto-scroll al inicio ──────────────────────────────────────────────────
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page, selectedCategoryId, search]);

  const handleCategorySelect = (categoryId: string | undefined) => {
    setSelectedCategoryId(categoryId);
    setPage(1);
  };

  return (
    <div className="animate-fade-in">
      <div
        className="sticky z-30 w-full px-4 pt-4 pb-4 flex flex-col gap-3"
        style={{
          top: '3.5rem',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--color-surface-200)',
        }}
      >
        <div className="max-w-7xl mx-auto w-full flex flex-col gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <CategoryMenu
            categories={categories}
            activeCategoryId={selectedCategoryId}
            onSelect={handleCategorySelect}
            isLoading={categoriesLoading}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 pt-8 pb-24">
        {/* Avisos Informativos */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-4 bg-brand-50 border border-brand-100 rounded-xl text-brand-800 shadow-xs">
            <span className="text-brand-500 mt-0.5 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </span>
            <p className="text-xs md:text-sm leading-relaxed">
              <strong>Nota sobre Precios:</strong> Los precios de los productos pueden variar sin previo aviso. Confirma el precio final al realizar tu pedido.
            </p>
          </div>
          <div className="flex items-start gap-3 p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-700 shadow-xs">
            <span className="text-zinc-500 mt-0.5 flex-shrink-0">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
              </svg>
            </span>
            <p className="text-xs md:text-sm leading-relaxed">
              <strong>Imágenes de Referencia:</strong> Las fotos mostradas son ilustrativas. La presentación del producto real puede variar ligeramente.
            </p>
          </div>
        </div>

        <ProductList
          products={products}
          isLoading={productsLoading}
          error={error}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </main>
    </div>
  );
};
