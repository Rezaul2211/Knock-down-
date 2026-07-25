import React, { useState } from 'react';
import { FabricSwatch, FabricCategory, Product } from '../types';
import { fabricSwatches } from '../data/fabrics';
import { FabricVisualizerCanvas, GarmentType } from './FabricVisualizerCanvas';
import { FabricMagnifierModal } from './FabricMagnifierModal';
import { useAppContext } from '../store/AppContext';
import { useFlyingCart } from './FlyingCartAnimation';
import { X, Search, Sparkles, Filter, Check, ShoppingBag, Eye, Layers, Scissors, RefreshCw, ArrowRight } from 'lucide-react';

interface FabricStudioModalProps {
  initialProduct?: Product | null;
  initialFabric?: FabricSwatch | null;
  onClose: () => void;
}

export function FabricStudioModal({
  initialProduct,
  initialFabric,
  onClose
}: FabricStudioModalProps) {
  const { language, addToCart } = useAppContext();
  const { triggerFlyToCart } = useFlyingCart();
  const isBn = language === 'bn';

  const [selectedFabric, setSelectedFabric] = useState<FabricSwatch>(
    initialFabric || fabricSwatches[0]
  );
  const [compareFabric, setCompareFabric] = useState<FabricSwatch | null>(null);

  // Map initial product category or default to panjabi
  const getInitialGarment = (): GarmentType => {
    if (!initialProduct) return 'panjabi';
    const sub = initialProduct.subcategory.toLowerCase();
    if (sub.includes('suit')) return 'suit';
    if (sub.includes('gown')) return 'gown';
    if (sub.includes('waistcoat')) return 'waistcoat';
    if (sub.includes('kameez') || sub.includes('salwar')) return 'kameez';
    if (sub.includes('frock')) return 'frock';
    return 'panjabi';
  };

  const [garmentType, setGarmentType] = useState<GarmentType>(getInitialGarment());
  const [selectedCategory, setSelectedCategory] = useState<FabricCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectFabric, setInspectFabric] = useState<FabricSwatch | null>(null);
  const [added, setAdded] = useState(false);

  // Filtered fabric catalog
  const filteredFabrics = fabricSwatches.filter(f => {
    const matchesCat = selectedCategory === 'all' || f.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      f.nameEn.toLowerCase().includes(q) || 
      f.nameBn.toLowerCase().includes(q) ||
      f.code.toLowerCase().includes(q) ||
      f.origin.toLowerCase().includes(q) ||
      f.tags.some(t => t.includes(q));
    return matchesCat && matchesQuery;
  });

  // Calculate final custom price
  const basePrice = initialProduct ? initialProduct.price : 3500;
  const totalPrice = basePrice + selectedFabric.surcharge;

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerFlyToCart(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      selectedFabric.highResImage
    );

    const customProduct: Product = initialProduct || {
      id: `custom-${selectedFabric.id}`,
      titleEn: `Custom Tailored ${garmentType.toUpperCase()} (${selectedFabric.nameEn})`,
      titleBn: `কাস্টম টেইলরড ${garmentType.toUpperCase()} (${selectedFabric.nameBn})`,
      category: garmentType === 'gown' || garmentType === 'kameez' ? 'women' : garmentType === 'frock' ? 'kids' : 'men',
      subcategory: garmentType,
      price: totalPrice,
      image: selectedFabric.highResImage,
      descriptionEn: `Custom tailored ${garmentType} crafted with ${selectedFabric.nameEn} (${selectedFabric.origin}).`,
      descriptionBn: `${selectedFabric.nameBn} দিয়ে তৈরি কাস্টম টেইলরড ${garmentType}।`,
      isCustomizable: true,
      material: selectedFabric.nameEn,
      color: selectedFabric.primaryColor
    };

    addToCart({
      id: crypto.randomUUID(),
      product: customProduct,
      quantity: 1,
      selectedFabric,
      customPrice: totalPrice
    }, true);

    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl bg-[#FAF9F6] rounded-3xl shadow-2xl border border-slate-300/80 overflow-hidden flex flex-col max-h-[92vh] my-auto">
        
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl border border-amber-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <span>{isBn ? '৩ডি ফেব্রিক ভিজ্যুয়ালাইজার স্টুডিও' : '3D Fabric Visualization Studio'}</span>
              </h2>
              <p className="text-[11px] text-slate-400">
                {isBn ? 'সোয়াচ সিলেক্ট করে থ্রি-ডি মডেলে ফেব্রিকের লুক যাচাই করুন' : 'Select premium swatches and apply in real-time on garment silhouette'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Studio Content Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Column (Lg: 7 cols): Interactive Visualizer Stage */}
          <div className="lg:col-span-7 bg-[#EFECE6] p-4 sm:p-6 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-200">
            <FabricVisualizerCanvas
              fabric={selectedFabric}
              compareFabric={compareFabric}
              garmentType={garmentType}
              onGarmentTypeChange={setGarmentType}
              className="w-full"
            />

            {/* Stage Footer Bar: Price & Order Action */}
            <div className="mt-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isBn ? 'কাস্টম স্যুটিং মূল্য' : 'Custom Tailored Price'}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-serif font-bold text-amber-700">
                    ৳{totalPrice.toLocaleString()}
                  </span>
                  {selectedFabric.surcharge > 0 && (
                    <span className="text-xs text-slate-500">
                      (+৳{selectedFabric.surcharge} luxury fabric fee)
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className={`py-3 px-6 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-md ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-900 hover:bg-amber-700 text-white'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{isBn ? 'কার্টে যোগ করা হয়েছে' : 'Added to Bag'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isBn ? 'এই ফেব্রিক দিয়ে অর্ডার করুন' : 'Order with Selected Fabric'}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column (Lg: 5 cols): Fabric Catalog Browser & Swatch Picker */}
          <div className="lg:col-span-5 p-4 sm:p-6 bg-white flex flex-col justify-between space-y-4">
            
            <div className="space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder={isBn ? 'ফেব্রিকের নাম, থ্রেড কাউন্ট বা অরিজিন খুঁজুন...' : 'Search fabric name, origin, cotton, silk...'}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-800 outline-none focus:border-amber-600"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: 'all', label: isBn ? 'সব ফেব্রিক' : 'All Fabrics' },
                  { id: 'cotton', label: isBn ? 'কটন' : 'Cotton' },
                  { id: 'wool', label: isBn ? 'উল' : 'Wool' },
                  { id: 'silk', label: isBn ? 'সিল্ক' : 'Silk' },
                  { id: 'linen', label: isBn ? 'লিনেন' : 'Linen' },
                  { id: 'velvet', label: isBn ? 'ভেলভেট' : 'Velvet' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as any)}
                    className={`py-1 px-3 rounded-full text-[11px] font-bold shrink-0 transition-all border ${
                      selectedCategory === cat.id
                        ? 'bg-amber-700 text-white border-amber-700 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Compare Mode Toggle Bar */}
              {compareFabric && (
                <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                  <span className="font-semibold flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-amber-600 animate-spin-slow" />
                    Comparing with: <strong>{compareFabric.nameEn}</strong>
                  </span>
                  <button
                    onClick={() => setCompareFabric(null)}
                    className="text-amber-800 hover:text-amber-950 font-bold underline text-[10px]"
                  >
                    Clear Compare
                  </button>
                </div>
              )}

              {/* Swatch Grid Catalog */}
              <div className="max-h-[380px] sm:max-h-[420px] overflow-y-auto space-y-2 pr-1">
                {filteredFabrics.length === 0 ? (
                  <div className="p-8 text-center text-slate-400 space-y-2">
                    <Filter className="w-8 h-8 mx-auto stroke-1" />
                    <p className="text-xs font-semibold">{isBn ? 'কোনো ফেব্রিক পাওয়া যায়নি' : 'No matching fabrics found'}</p>
                  </div>
                ) : (
                  filteredFabrics.map(fab => {
                    const isSelected = selectedFabric.id === fab.id;
                    const isComparing = compareFabric?.id === fab.id;

                    return (
                      <div
                        key={fab.id}
                        onClick={() => setSelectedFabric(fab)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                          isSelected
                            ? 'bg-amber-50/80 border-amber-500 shadow-sm'
                            : 'bg-slate-50/80 border-slate-200 hover:border-slate-300 hover:bg-white'
                        }`}
                      >
                        {/* Swatch Thumbnail with Loupe Inspect Trigger */}
                        <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-slate-300 shrink-0 group-hover:scale-105 transition-transform">
                          <img
                            src={fab.textureImage}
                            alt={fab.nameEn}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setInspectFabric(fab);
                            }}
                            className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            title="Inspect Swatch in Micro Zoom"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Swatch Metadata */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold text-amber-700 uppercase">
                              {fab.code}
                            </span>
                            <span className="text-[10px] text-slate-400">&bull; {fab.category}</span>
                          </div>
                          <h4 className="text-xs font-bold text-slate-800 truncate group-hover:text-amber-800">
                            {isBn ? fab.nameBn : fab.nameEn}
                          </h4>
                          <p className="text-[10px] text-slate-500 truncate">
                            {fab.origin} &bull; {fab.weightGsm} GSM
                          </p>
                        </div>

                        {/* Price & Selection Badge */}
                        <div className="text-right shrink-0">
                          <span className="text-xs font-bold text-slate-900 block">
                            ৳{fab.pricePerYard}/yd
                          </span>
                          
                          <div className="flex items-center gap-1 mt-1 justify-end">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompareFabric(fab);
                              }}
                              className="text-[10px] text-amber-700 hover:underline font-semibold"
                            >
                              {isComparing ? 'Comparing' : 'Compare'}
                            </button>

                            {isSelected && (
                              <span className="w-4 h-4 bg-amber-600 text-white rounded-full flex items-center justify-center">
                                <Check className="w-2.5 h-2.5 stroke-[3]" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Currently Selected Fabric Info Box */}
            <div className="bg-slate-900 text-white p-4 rounded-2xl space-y-2 border border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 uppercase tracking-wider">
                  Active Swatch: {selectedFabric.code}
                </span>
                <button
                  onClick={() => setInspectFabric(selectedFabric)}
                  className="text-[10px] text-slate-300 hover:text-white underline flex items-center gap-1"
                >
                  <Eye className="w-3 h-3 text-amber-400" />
                  <span>Inspect 4x Micro Zoom</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-300 line-clamp-2">
                {isBn ? selectedFabric.descriptionBn : selectedFabric.descriptionEn}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Fabric Magnifier Inspect Overlay */}
      {inspectFabric && (
        <FabricMagnifierModal
          fabric={inspectFabric}
          onClose={() => setInspectFabric(null)}
          onApplyFabric={(fab) => {
            setSelectedFabric(fab);
            setInspectFabric(null);
          }}
          onCompareWith={(fab) => {
            setCompareFabric(fab);
            setInspectFabric(null);
          }}
        />
      )}
    </div>
  );
}
