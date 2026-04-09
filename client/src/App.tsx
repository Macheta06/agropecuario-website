import { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { SearchBar } from './components/ui/SearchBar';
import { CategoryMenu } from './components/ui/CategoryMenu';
import { ProductList } from './components/ui/ProductList';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { useCategories } from './hooks/useCategories';
import { useProducts } from './hooks/useProducts';

function App() {
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
      document.title = `Catálogo | ${suffix}`;
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

  const handleReset = () => {
    setSearch('');
    setSelectedCategoryId(undefined);
    setPage(1);
  };

  return (
    <div className="min-h-dvh flex flex-col" style={{ backgroundColor: 'var(--color-surface-950)' }}>
      <Navbar storeName="Almacén Agropecuario" onLogoClick={handleReset} />

      <div
        className="sticky z-30 w-full px-4 pt-3 pb-3 flex flex-col gap-2.5"
        style={{
          top: '3.5rem',
          backgroundColor: 'rgba(10, 10, 10, 0.9)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid var(--color-surface-700)',
        }}
      >
        <SearchBar value={search} onChange={setSearch} />
        <CategoryMenu
          categories={categories}
          activeCategoryId={selectedCategoryId}
          onSelect={handleCategorySelect}
          isLoading={categoriesLoading}
        />
      </div>

      <main className="max-w-7xl mx-auto w-full px-4 pt-5 pb-24 flex-1">
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

      <WhatsAppButton />
    </div>
  );
}

export default App;
