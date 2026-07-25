import React, { useState } from 'react';
import { fabricSwatches } from '../data/fabrics';
import { FabricSwatch, FabricCategory } from '../types';
import { FabricMagnifierModal } from '../components/FabricMagnifierModal';
import { FabricStudioModal } from '../components/FabricStudioModal';
import { FabricCompareModal } from '../components/FabricCompareModal';
import { useAppContext } from '../store/AppContext';
import { Search, Filter, Sparkles, Eye, Scissors, MapPin, Feather, Check, ArrowRight, ShieldCheck, Scale, Plus, X } from 'lucide-react';

export function FabricCatalogPage() {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  const [selectedCategory, setSelectedCategory] = useState<FabricCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-low' | 'price-high' | 'gsm'>('recommended');
  
  const [inspectFabric, setInspectFabric] = useState<FabricSwatch | null>(null);
  const [studioFabric, setStudioFabric] = useState<FabricSwatch | null>(null);
  const [showStudio, setShowStudio] = useState(false);

  // Compare Fabrics state
  const [compareList, setCompareList] = useState<FabricSwatch[]>([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  const toggleCompare = (fab: FabricSwatch) => {
    if (compareList.some(f => f.id === fab.id)) {
      setCompareList(compareList.filter(f => f.id !== fab.id));
    } else {
      if (compareList.length >= 2) {
        // Replace second one or notify
        setCompareList([compareList[0], fab]);
      } else {
        setCompareList([...compareList, fab]);
      }
    }
  };

  const openCompareModalWithFabrics = (fab1?: FabricSwatch, fab2?: FabricSwatch) => {
    if (fab1 && fab2) {
      setCompareList([fab1, fab2]);
    } else if (compareList.length < 2) {
      const remaining = fabricSwatches.filter(f => !compareList.some(c => c.id === f.id));
      if (compareList.length === 0) {
        setCompareList([fabricSwatches[0], fabricSwatches[1]]);
      } else if (compareList.length === 1) {
        setCompareList([compareList[0], remaining[0] || fabricSwatches[0]]);
      }
    }
    setShowCompareModal(true);
  };

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

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => open3DStudioWithFabric(fabricSwatches[0])}
                className="py-3.5 px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Scissors className="w-4 h-4" />
                <span>{isBn ? '৩ডি ফেব্রিক স্টুডিও ওপেন করুন' : 'Launch 3D Visualizer Studio'}</span>
              </button>

              <button
                onClick={() => openCompareModalWithFabrics()}
                className="py-3.5 px-6 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 rounded-2xl font-bold uppercase tracking-wider text-xs transition-all flex items-center gap-2 shadow-lg cursor-pointer"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>{isBn ? 'ফেব্রিক তুলনামূলক গাইড (Compare)' : 'Compare Fabrics Side-by-Side'}</span>
              </button>
            </div>
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
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase">
                      {isBn ? 'মূল্য/গজ' : 'Price / Yard'}
                    </span>
                    <span className="text-lg font-serif font-bold text-slate-900">
                      ৳{fab.pricePerYard}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => toggleCompare(fab)}
                      className={`p-2.5 rounded-xl border text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        compareList.some(c => c.id === fab.id)
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                      title={isBn ? 'তুলনা তালিকায় যোগ করুন' : 'Compare this fabric'}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{compareList.some(c => c.id === fab.id) ? (isBn ? 'তুলনায়' : 'Comparing') : (isBn ? 'তুলনা' : 'Compare')}</span>
                    </button>

                    <button
                      onClick={() => open3DStudioWithFabric(fab)}
                      className="py-2.5 px-3 bg-slate-900 hover:bg-amber-700 text-white rounded-xl font-bold uppercase text-[11px] tracking-wider transition-colors flex items-center gap-1 shadow-xs cursor-pointer"
                    >
                      <span>{isBn ? '৩ডি' : '3D'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Floating Compare Drawer Tray when items are selected */}
      {compareList.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white p-3 sm:p-4 rounded-3xl shadow-2xl border border-amber-500/40 flex items-center gap-4 max-w-xl w-[92%] sm:w-auto animate-in slide-in-from-bottom-6 duration-300">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="text-xs font-bold text-amber-300 whitespace-nowrap">
              {isBn ? `তুলনা তালিকা (${compareList.length}/২):` : `Compare Tray (${compareList.length}/2):`}
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {compareList.map(item => (
              <div key={item.id} className="relative bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-1 flex items-center gap-2 text-xs shrink-0">
                <img src={item.highResImage} alt={item.nameEn} className="w-6 h-6 rounded-md object-cover" />
                <span className="font-bold text-slate-200 max-w-[100px] truncate">{isBn ? item.nameBn : item.nameEn}</span>
                <button
                  onClick={() => toggleCompare(item)}
                  className="text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => openCompareModalWithFabrics()}
            className="py-2.5 px-5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-2xl uppercase tracking-wider transition-all whitespace-nowrap shadow-lg cursor-pointer"
          >
            {isBn ? 'এখনই তুলনা করুন' : 'Compare Now'}
          </button>
        </div>
      )}

      {/* Fabric Specification Comparison Modal */}
      {showCompareModal && (
        <FabricCompareModal
          initialFabricA={compareList[0]}
          initialFabricB={compareList[1]}
          onClose={() => setShowCompareModal(false)}
          onSelectFabric={(fab) => {
            setShowCompareModal(false);
            open3DStudioWithFabric(fab);
          }}
        />
      )}

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
