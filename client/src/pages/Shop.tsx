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
    const suffix = 'Almacén Agropecuario';
    
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
