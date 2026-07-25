import React from 'react';
import { SlidersHorizontal, X, RotateCcw, Search, Check } from 'lucide-react';

interface FilterSidebarProps {
  materials: string[];
  selectedMaterials: string[];
  onToggleMaterial: (material: string) => void;
  colors: string[];
  selectedColors: string[];
  onToggleColor: (color: string) => void;
  priceRange: [number, number];
  minPriceBound: number;
  maxPriceBound: number;
  onPriceChange: (range: [number, number]) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
  activeFilterCount: number;
  language: 'en' | 'bn';
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

const colorHexMap: Record<string, string> = {
  White: '#FFFFFF',
  Black: '#1E293B',
  Navy: '#1B2A4A',
  Red: '#B91C1C',
  Green: '#047857',
  Blue: '#1D4ED8',
  Beige: '#F5F5DC',
  Yellow: '#EAB308',
  Pink: '#EC4899',
  Maroon: '#800000',
  Classic: '#6A4C6D'
};

export function FilterSidebar({
  materials,
  selectedMaterials,
  onToggleMaterial,
  colors,
  selectedColors,
  onToggleColor,
  priceRange,
  minPriceBound,
  maxPriceBound,
  onPriceChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  onClearAll,
  activeFilterCount,
  language,
  isMobileOpen,
  onCloseMobile,
}: FilterSidebarProps) {
  const isBn = language === 'bn';

  const filterContent = (
    <div className="space-y-8">
      {/* Search Input */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6A4C6D] mb-3">
          {isBn ? 'অনুসন্ধান' : 'Search Products'}
        </h3>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={isBn ? 'পণ্য খুঁজুন...' : 'Search by name...'}
            className="w-full bg-[#FAF9F6] border border-[#6A4C6D]/15 rounded-full py-2.5 pl-9 pr-4 text-xs text-[#1E293B] placeholder-[#1E293B]/40 focus:outline-none focus:border-[#6A4C6D]"
          />
          <Search className="w-4 h-4 text-[#6A4C6D]/60 absolute left-3 top-1/2 -translate-y-1/2" />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1E293B]/40 hover:text-[#1E293B]"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Sort Options */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6A4C6D] mb-3">
          {isBn ? 'সাজান' : 'Sort By'}
        </h3>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="w-full bg-[#FAF9F6] border border-[#6A4C6D]/15 rounded-2xl py-2.5 px-4 text-xs text-[#1E293B] focus:outline-none focus:border-[#6A4C6D] cursor-pointer"
        >
          <option value="featured">{isBn ? 'মূল্যবান / জনপ্রিয়' : 'Featured'}</option>
          <option value="price-asc">{isBn ? 'দাম: কম থেকে বেশি' : 'Price: Low to High'}</option>
          <option value="price-desc">{isBn ? 'দাম: বেশি থেকে কম' : 'Price: High to Low'}</option>
          <option value="title-asc">{isBn ? 'নাম: A - Z' : 'Name: A to Z'}</option>
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6A4C6D]">
            {isBn ? 'মূল্যের সীমা' : 'Price Range'}
          </h3>
          <span className="text-xs font-serif italic text-[#1E293B]">
            ৳{priceRange[0]} - ৳{priceRange[1]}
          </span>
        </div>
        <input
          type="range"
          min={minPriceBound}
          max={maxPriceBound}
          step={100}
          value={priceRange[1]}
          onChange={(e) => onPriceChange([priceRange[0], Number(e.target.value)])}
          className="w-full accent-[#6A4C6D] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#1E293B]/50 mt-1 font-serif">
          <span>৳{minPriceBound}</span>
          <span>৳{maxPriceBound}</span>
        </div>
      </div>

      {/* Material Filter */}
      {materials.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6A4C6D] mb-3">
            {isBn ? 'উপাদান / ফ্যাব্রিক' : 'Material'}
          </h3>
          <div className="flex flex-wrap gap-2">
            {materials.map((mat) => {
              const isSelected = selectedMaterials.includes(mat);
              return (
                <button
                  key={mat}
                  onClick={() => onToggleMaterial(mat)}
                  className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#1E293B] text-white border-[#1E293B]'
                      : 'bg-[#FAF9F6] text-[#1E293B]/80 border-[#6A4C6D]/15 hover:border-[#6A4C6D]/40'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  <span>{mat}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Color Filter */}
      {colors.length > 0 && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6A4C6D] mb-3">
            {isBn ? 'রং' : 'Color'}
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {colors.map((color) => {
              const isSelected = selectedColors.includes(color);
              const hex = colorHexMap[color] || '#D1D5DB';
              const isLight = color === 'White' || color === 'Beige' || color === 'Yellow';
              return (
                <button
                  key={color}
                  onClick={() => onToggleColor(color)}
                  title={color}
                  className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                    isSelected
                      ? 'bg-[#1E293B] text-white border-[#1E293B]'
                      : 'bg-[#FAF9F6] text-[#1E293B]/80 border-[#6A4C6D]/15 hover:border-[#6A4C6D]/40'
                  }`}
                >
                  <span
                    className={`w-3.5 h-3.5 rounded-full border ${
                      isLight ? 'border-gray-300' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                  <span>{color}</span>
                  {isSelected && <Check className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Clear All Filters */}
      {activeFilterCount > 0 && (
        <button
          onClick={onClearAll}
          className="w-full flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#B91C1C] hover:bg-[#B91C1C]/5 py-2.5 rounded-full border border-[#B91C1C]/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{isBn ? 'সমস্ত ফিল্টার মুছুন' : 'Reset All Filters'}</span>
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 pr-8 border-r border-[#6A4C6D]/10">
        <div className="sticky top-28 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-[#6A4C6D]/10">
            <div className="flex items-center gap-2 text-[#1E293B]">
              <SlidersHorizontal className="w-4 h-4 text-[#6A4C6D]" />
              <h2 className="font-serif italic text-xl font-medium">
                {isBn ? 'ফিল্টারসমূহ' : 'Refine Selection'}
              </h2>
            </div>
            {activeFilterCount > 0 && (
              <span className="bg-[#E8A5B8] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </div>
          {filterContent}
        </div>
      </aside>

      {/* Mobile Modal Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Content */}
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto p-6">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#6A4C6D]/10">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#6A4C6D]" />
                <h2 className="font-serif italic text-xl text-[#1E293B]">
                  {isBn ? 'ফিল্টারসমূহ' : 'Refine Selection'}
                </h2>
              </div>
              <button
                onClick={onCloseMobile}
                className="p-2 rounded-full hover:bg-gray-100 text-[#1E293B]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}
    </>
  );
}
