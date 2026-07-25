import React, { useState } from 'react';
import { fabricSwatches } from '../data/fabrics';
import { FabricSwatch, FabricCategory } from '../types';
import { FabricMagnifierModal } from '../components/FabricMagnifierModal';
import { FabricStudioModal } from '../components/FabricStudioModal';
import { useAppContext } from '../store/AppContext';
import { Search, Filter, Sparkles, Eye, Scissors, MapPin, Feather, Check, ArrowRight, ShieldCheck } from 'lucide-react';

export function FabricCatalogPage() {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<FabricCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'gsm'>('recommended');
  
  const [inspectFabric, setInspectFabric] = useState<FabricSwatch | null>(null);
  const [studioFabric, setStudioFabric] = useState<FabricSwatch | null>(null);
  const [showStudio, setShowStudio] = useState(false);

  // Filter and sort fabrics
  const filteredFabrics = fabricSwatches
    .filter(f => {
      const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || 
        f.nameEn.toLowerCase().includes(q) || 
        f.nameBn.toLowerCase().includes(q) ||
        f.code.toLowerCase().includes(q) ||
        f.origin.toLowerCase().includes(q) ||
        f.tags.some(t => t.includes(q));
      return matchesCat && matchesQuery;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.pricePerYard - b.pricePerYard;
      if (sortBy === 'price-high') return b.pricePerYard - a.pricePerYard;
      if (sortBy === 'gsm') return b.weightGsm - a.weightGsm;
      return 0;
    });

  const open3DStudioWithFabric = (fab: FabricSwatch) => {
    setStudioFabric(fab);
    setShowStudio(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-8 px-4 sm:px-6 lg:px-8 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Page Hero Header */}
        <div className="relative rounded-3xl bg-slate-900 text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isBn ? 'প্রিমিয়াম ফেব্রিক আর্কাইভ' : 'Luxury Fabric Archive'}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-serif font-extrabold leading-tight">
              {isBn ? 'বিশ্বমানের ফেব্রিক ক্যাটালগ ও ৩ডি ভিজ্যুয়ালাইজার' : 'Curated World-Class Fabric Catalog & 3D Studio'}
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {isBn 
                ? 'ইজিপশিয়ান গিজা কটন, ইতালিয়ান সুপার ১৫০s উল, কোমো মুলবেরি সিল্ক এবং ঐতিহ্যবাহী তাঁতের জামদানি বোনা কাপড়ের বিশদ স্পেসিফিকেশন ও হাই-রেস ছবি থ্রি-ডি ভিজ্যুয়ালাইজারে দেখুন।'
                : 'Explore Egyptian Giza Cotton, Italian Super 150s Wool, Como Mulberry Silk, and UNESCO Heritage Jamdani weave in interactive 3D simulation.'}
            </p>

            <button
              onClick={() => open3DStudioWithFabric(fabricSwatches[0])}
              className="mt-2 py-3.5 px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 shadow-lg"
            >
              <Scissors className="w-4 h-4" />
              <span>{isBn ? '৩ডি ফেব্রিক স্টুডিও ওপেন করুন' : 'Launch 3D Visualizer Studio'}</span>
            </button>
          </div>
        </div>

        {/* Filter and Search Bar Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder={isBn ? 'ফেব্রিক, উল, কটন, থ্রেড বা অরিজিন খুঁজুন...' : 'Search Egyptian cotton, merino wool, silk...'}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 outline-none focus:border-amber-600"
              />
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full md:w-auto justify-end text-xs">
              <span className="font-semibold text-slate-500 whitespace-nowrap">{isBn ? 'সাজান:' : 'Sort by:'}</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value="recommended">{isBn ? 'পছন্দনীয়' : 'Recommended'}</option>
                <option value="price-low">{isBn ? 'মূল্য: কম থেকে বেশি' : 'Price: Low to High'}</option>
                <option value="price-high">{isBn ? 'মূল্য: বেশি থেকে কম' : 'Price: High to Low'}</option>
                <option value="gsm">{isBn ? 'ওজন (GSM High)' : 'Heavy Weight (GSM)'}</option>
              </select>
            </div>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{isBn ? 'ক্যাটাগরি:' : 'Category:'}</span>
            </span>
            {[
              { id: 'all', label: isBn ? 'সব ফেব্রিক' : 'All Fabrics' },
              { id: 'cotton', label: isBn ? 'কটন (Cotton)' : 'Cotton' },
              { id: 'wool', label: isBn ? 'উল (Wool)' : 'Fine Wool' },
              { id: 'silk', label: isBn ? 'সিল্ক (Silk)' : 'Pure Silk' },
              { id: 'linen', label: isBn ? 'লিনেন (Linen)' : 'Organic Linen' },
              { id: 'velvet', label: isBn ? 'ভেলভেট (Velvet)' : 'Plush Velvet' },
              { id: 'blend', label: isBn ? 'ব্লেন্ড (Blend)' : 'Luxury Blend' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`py-1.5 px-4 rounded-full text-xs font-bold shrink-0 transition-all border ${
                  selectedCategory === cat.id
                    ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fabric Swatches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFabrics.map(fab => (
            <div
              key={fab.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group"
            >
              {/* Image & Micro Zoom Hover */}
              <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                <img
                  src={fab.highResImage}
                  alt={fab.nameEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {fab.code} &bull; {fab.category}
                </div>

                <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 font-bold text-[10px] px-2 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Feather className="w-3 h-3" />
                  <span>{fab.weightGsm} GSM</span>
                </div>

                {/* Inspect Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    onClick={() => setInspectFabric(fab)}
                    className="p-3 bg-white text-slate-900 rounded-full font-bold shadow-lg hover:scale-110 transition-transform"
                    title="Inspect 4x Micro Zoom"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => open3DStudioWithFabric(fab)}
                    className="p-3 bg-amber-600 text-white rounded-full font-bold shadow-lg hover:scale-110 transition-transform"
                    title="Try in 3D Studio"
                  >
                    <Scissors className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Swatch Content */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>{fab.origin}</span>
                  </div>

                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-amber-700 transition-colors">
                    {isBn ? fab.nameBn : fab.nameEn}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                    {isBn ? fab.descriptionBn : fab.descriptionEn}
                  </p>
                </div>

                {/* Specs Pill */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 grid grid-cols-2 gap-2 text-[11px] font-medium text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">{isBn ? 'বুনন' : 'Weave'}</span>
                    <span className="font-bold text-slate-800 truncate block">{fab.weavePattern}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[9px] uppercase">{isBn ? 'থ্রেড' : 'Thread'}</span>
                    <span className="font-bold text-slate-800 truncate block">{fab.threadCount}</span>
                  </div>
                </div>

                {/* Price & Action Row */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      {isBn ? 'মূল্য/গজ' : 'Price / Yard'}
                    </span>
                    <span className="text-lg font-serif font-bold text-slate-900">
                      ৳{fab.pricePerYard}
                    </span>
                  </div>

                  <button
                    onClick={() => open3DStudioWithFabric(fab)}
                    className="py-2.5 px-4 bg-slate-900 hover:bg-amber-700 text-white rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <span>{isBn ? '৩ডি ভিজ্যুয়ালাইজ' : '3D Visualize'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Magnifier Inspection Modal */}
      {inspectFabric && (
        <FabricMagnifierModal
          fabric={inspectFabric}
          onClose={() => setInspectFabric(null)}
          onApplyFabric={(fab) => open3DStudioWithFabric(fab)}
        />
      )}

      {/* Full 3D Studio Modal */}
      {showStudio && studioFabric && (
        <FabricStudioModal
          initialFabric={studioFabric}
          onClose={() => setShowStudio(false)}
        />
      )}
    </div>
  );
}
