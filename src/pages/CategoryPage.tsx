import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Home, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { ProductCard } from '../components/ProductCard';
import { ProductCardSkeleton } from '../components/ProductCardSkeleton';
import { FilterSidebar } from '../components/FilterSidebar';
import { PullToRefresh } from '../components/PullToRefresh';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';

export function CategoryPage() {
  const { type } = useParams<{ type: string }>();
  const { products, language, refreshProducts } = useAppContext();
  const t = translations[language];
  const isBn = language === 'bn';

  // Base category products
  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category === type);
  }, [products, type]);

  // Extract unique materials & colors
  const availableMaterials = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.material) set.add(p.material);
    });
    return Array.from(set).sort();
  }, [categoryProducts]);

  const availableColors = useMemo(() => {
    const set = new Set<string>();
    categoryProducts.forEach((p) => {
      if (p.color) set.add(p.color);
    });
    return Array.from(set).sort();
  }, [categoryProducts]);

  // Min and Max prices for the category
  const { minPriceBound, maxPriceBound } = useMemo(() => {
    if (categoryProducts.length === 0) return { minPriceBound: 0, maxPriceBound: 20000 };
    const prices = categoryProducts.map((p) => p.price);
    return {
      minPriceBound: Math.min(...prices),
      maxPriceBound: Math.max(...prices)
    };
  }, [categoryProducts]);

  // Filter state
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([minPriceBound, maxPriceBound]);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Reset price range and show skeleton loader when category changes
  useEffect(() => {
    setIsLoading(true);
    setPriceRange([minPriceBound, maxPriceBound]);
    setSelectedMaterials([]);
    setSelectedColors([]);
    setSearchQuery('');
    setSortBy('featured');

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [type, minPriceBound, maxPriceBound]);

  // Filter toggles
  const handleToggleMaterial = (mat: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(mat) ? prev.filter((m) => m !== mat) : [...prev, mat]
    );
  };

  const handleToggleColor = (col: string) => {
    setSelectedColors((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
    );
  };

  const handleClearAll = () => {
    setSelectedMaterials([]);
    setSelectedColors([]);
    setPriceRange([minPriceBound, maxPriceBound]);
    setSearchQuery('');
    setSortBy('featured');
  };

  // Active filter count
  const activeFilterCount = useMemo(() => {
    let count = selectedMaterials.length + selectedColors.length;
    if (priceRange[1] < maxPriceBound) count += 1;
    if (searchQuery.trim() !== '') count += 1;
    return count;
  }, [selectedMaterials, selectedColors, priceRange, maxPriceBound, searchQuery]);

  // Dynamic Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return categoryProducts
      .filter((product) => {
        // Material filter
        if (selectedMaterials.length > 0) {
          if (!product.material || !selectedMaterials.includes(product.material)) {
            return false;
          }
        }

        // Color filter
        if (selectedColors.length > 0) {
          if (!product.color || !selectedColors.includes(product.color)) {
            return false;
          }
        }

        // Price filter
        if (product.price > priceRange[1]) {
          return false;
        }

        // Search query filter
        if (searchQuery.trim() !== '') {
          const query = searchQuery.toLowerCase();
          const matchTitleEn = product.titleEn.toLowerCase().includes(query);
          const matchTitleBn = product.titleBn.toLowerCase().includes(query);
          const matchDescEn = product.descriptionEn.toLowerCase().includes(query);
          const matchSubcat = product.subcategory.toLowerCase().includes(query);
          const matchMat = product.material ? product.material.toLowerCase().includes(query) : false;
          const matchCol = product.color ? product.color.toLowerCase().includes(query) : false;

          if (!matchTitleEn && !matchTitleBn && !matchDescEn && !matchSubcat && !matchMat && !matchCol) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'title-asc') {
          const nameA = isBn ? a.titleBn : a.titleEn;
          const nameB = isBn ? b.titleBn : b.titleEn;
          return nameA.localeCompare(nameB);
        }
        return 0;
      });
  }, [categoryProducts, selectedMaterials, selectedColors, priceRange, searchQuery, sortBy, isBn]);

  const titleMap: Record<string, string> = {
    men: isBn ? 'পুরুষদের কালেকশন' : 'Men Collection',
    women: isBn ? 'মহিলাদের কালেকশন' : 'Women Collection',
    kids: isBn ? 'বাচ্চাদের কালেকশন' : 'Kids Collection'
  };

  const title = type ? titleMap[type] || type : 'Collection';

  const handlePullRefresh = async () => {
    setIsLoading(true);
    await refreshProducts();
    setIsLoading(false);
  };

  return (
    <PullToRefresh onRefresh={handlePullRefresh}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="py-6 sm:py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 min-h-[40vh]"
      >
      {/* Page Header */}
      <div className="mb-8 border-b border-[#6A4C6D]/10 pb-6">
        {/* Breadcrumb Navigation Trail */}
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-[#1E293B]/60">
            <li>
              <Link
                to="/"
                className="flex items-center gap-1 text-[#1E293B]/70 hover:text-[#6A4C6D] transition-colors"
              >
                <Home className="w-3.5 h-3.5 text-[#6A4C6D]" />
                <span>{isBn ? 'হোম' : 'Home'}</span>
              </Link>
            </li>
            <li className="text-[#6A4C6D]/30">
              <ChevronRight className="w-3.5 h-3.5" />
            </li>
            <li>
              <span className="font-semibold text-[#6A4C6D]">
                {title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-[10px] font-bold text-[#E8A5B8] uppercase tracking-[0.3em] block mb-1">
              {t[type as keyof typeof t] || type}
            </span>
            <h1 className="text-3xl md:text-5xl font-serif italic text-[#1E293B]">
              {title}
            </h1>
          </div>
          
          <div className="flex items-center justify-between md:justify-end gap-4">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 bg-[#FAF9F6] border border-[#6A4C6D]/20 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-[#1E293B]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#6A4C6D]" />
              <span>{isBn ? 'ফিল্টার' : 'Filter'}</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#E8A5B8] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {activeFilterCount > 0 && (
        <div className="mb-8 flex flex-wrap items-center gap-2 bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#6A4C6D]/10">
          <span className="text-xs font-bold uppercase tracking-wider text-[#6A4C6D] mr-1">
            {isBn ? 'সক্রিয় ফিল্টার:' : 'Active:'}
          </span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#6A4C6D]/20 text-[#1E293B] text-xs px-3 py-1 rounded-full shadow-2xs">
              <span>"{searchQuery}"</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-[#B91C1C]">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedMaterials.map((mat) => (
            <span
              key={mat}
              className="inline-flex items-center gap-1.5 bg-[#1E293B] text-white text-xs px-3 py-1 rounded-full shadow-2xs"
            >
              <span>{mat}</span>
              <button onClick={() => handleToggleMaterial(mat)} className="hover:text-[#E8A5B8]">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {selectedColors.map((col) => (
            <span
              key={col}
              className="inline-flex items-center gap-1.5 bg-[#1E293B] text-white text-xs px-3 py-1 rounded-full shadow-2xs"
            >
              <span>{col}</span>
              <button onClick={() => handleToggleColor(col)} className="hover:text-[#E8A5B8]">
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}

          {priceRange[1] < maxPriceBound && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-[#6A4C6D]/20 text-[#1E293B] text-xs px-3 py-1 rounded-full shadow-2xs">
              <span>Up to ৳{priceRange[1]}</span>
              <button
                onClick={() => setPriceRange([minPriceBound, maxPriceBound])}
                className="hover:text-[#B91C1C]"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleClearAll}
            className="ml-auto text-xs text-[#B91C1C] font-semibold hover:underline"
          >
            {isBn ? 'সব মুছুন' : 'Clear All'}
          </button>
        </div>
      )}

      {/* Main Content Layout with Sidebar */}
      <div className="flex gap-8">
        <FilterSidebar
          materials={availableMaterials}
          selectedMaterials={selectedMaterials}
          onToggleMaterial={handleToggleMaterial}
          colors={availableColors}
          selectedColors={selectedColors}
          onToggleColor={handleToggleColor}
          priceRange={priceRange}
          minPriceBound={minPriceBound}
          maxPriceBound={maxPriceBound}
          onPriceChange={setPriceRange}
          sortBy={sortBy}
          onSortChange={setSortBy}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearAll={handleClearAll}
          activeFilterCount={activeFilterCount}
          language={language}
          isMobileOpen={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Product Grid Area - 2 Columns */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-[#FAF9F6] rounded-3xl p-12 text-center border border-[#6A4C6D]/10">
              <h3 className="font-serif italic text-2xl text-[#1E293B] mb-2">
                {isBn ? 'কোন পণ্য পাওয়া যায়নি' : 'No products found'}
              </h3>
              <p className="text-xs text-[#1E293B]/60 max-w-md mx-auto mb-6">
                {isBn
                  ? 'আপনার নির্বাচিত ফিল্টারগুলোর সাথে মেলানো কোন পণ্য এই মুহূর্তে পাওয়া যায়নি। অনুগ্রহ করে কিছু ফিল্টার বাদ দিন।'
                  : 'We couldn’t find any products matching your current filters. Try relaxing your material, color, or price selection.'}
              </p>
              <button
                onClick={handleClearAll}
                className="bg-[#1E293B] text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#6A4C6D] transition-colors"
              >
                {isBn ? 'সমস্ত ফিল্টার রিসেট করুন' : 'Reset All Filters'}
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
    </PullToRefresh>
  );
}
