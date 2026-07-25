import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingBag, Ruler, Zap, ShieldCheck, Sparkles, Check, ArrowLeft, X, Scissors, Eye } from 'lucide-react';
import { Product, FabricSwatch } from '../types';
import { fabricSwatches } from '../data/fabrics';
import { useAppContext } from '../store/AppContext';
import { useFlyingCart } from '../components/FlyingCartAnimation';
import { translations } from '../i18n';
import { MeasurementModal } from '../components/MeasurementModal';
import { CheckoutModal } from '../components/CheckoutModal';
import { SizeGuideModal } from '../components/SizeGuideModal';
import { VirtualSizeGuideModal } from '../components/VirtualSizeGuideModal';
import { FabricStudioModal } from '../components/FabricStudioModal';
import { FabricMagnifierModal } from '../components/FabricMagnifierModal';
import { handleImageError } from '../lib/imageUtils';

import { FAQAccordion } from '../components/FAQAccordion';
import { ImageMagnifier } from '../components/ImageMagnifier';

export function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { language, products, addToCart } = useAppContext();
  const { triggerFlyToCart } = useFlyingCart();
  const t = translations[language];
  const isBn = language === 'bn';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFabric, setSelectedFabric] = useState<FabricSwatch>(fabricSwatches[0]);
  const [added, setAdded] = useState(false);
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showVirtualGuide, setShowVirtualGuide] = useState(false);
  const [showFabricStudio, setShowFabricStudio] = useState(false);
  const [inspectFabric, setInspectFabric] = useState<FabricSwatch | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Make sure we scroll to top on load
    window.scrollTo(0, 0);
    
    if (productId && products.length > 0) {
      const foundProduct = products.find(p => p.id === productId);
      setProduct(foundProduct || null);
    }
  }, [productId, products]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight > 0) {
            setScrollProgress((scrollY / docHeight) * 100);
          } else {
            setScrollProgress(0);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center">
        <h2 className="text-xl font-bold text-gray-700">
          {isBn ? 'পণ্য পাওয়া যায়নি' : 'Product not found'}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'ফিরে যান' : 'Go Back'}</span>
        </button>
      </div>
    );
  }

  const title = isBn ? product.titleBn : product.titleEn;
  const calculatedPrice = product.price + selectedFabric.surcharge;

  const handleAddToCart = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerFlyToCart(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      product.image
    );

    addToCart({
      id: crypto.randomUUID(),
      product,
      quantity: 1,
      selectedFabric,
      customPrice: calculatedPrice
    }, false);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleDirectBuyNow = () => {
    addToCart({
      id: crypto.randomUUID(),
      product,
      quantity: 1,
      selectedFabric,
      customPrice: calculatedPrice
    }, false);
    setShowDirectCheckout(true);
  };

  return (
    <>
      {/* Slim Scroll Progress Indicator */}
      <div className="fixed top-0 left-0 w-full h-1 z-[100] bg-transparent pointer-events-none">
        <div 
          className="h-full bg-[#6A4C6D] transition-all duration-75 ease-out shadow-[0_0_10px_rgba(106,76,109,0.5)]"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8 font-sans">
        {/* Main Content Area */}
        <div className="bg-white rounded-3xl shadow-lg border border-[#6A4C6D]/15 overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
          
          {/* Left Column: Premium Image Preview & Swatch Blend */}
          <div className="relative bg-[#EFECE6] h-72 sm:h-96 md:h-full md:min-h-[500px] overflow-hidden flex items-center justify-center shrink-0">
            <ImageMagnifier
              src={product.image}
              alt={title}
            />

            {/* Selected Fabric Badge Overlay on image */}
            <div className="absolute bottom-4 left-4 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-2xl border border-white/20 flex items-center gap-2 shadow-lg z-20">
              <span className="w-3.5 h-3.5 rounded-full border border-white/30" style={{ backgroundColor: selectedFabric.primaryColor }} />
              <div>
                <span className="font-bold block">{selectedFabric.nameEn}</span>
                <span className="text-[10px] text-slate-300 block">{selectedFabric.origin}</span>
              </div>
            </div>

            {/* Category Badges */}
            <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-20">
              <span className="bg-[#1E293B]/90 text-white backdrop-blur-md text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                {product.category} &bull; {product.subcategory}
              </span>
              <span className="bg-[#E8A5B8] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>{isBn ? 'কাস্টম' : 'Custom'}</span>
              </span>
            </div>

            {/* Close Button */}
            <button
              onClick={() => navigate(-1)}
              className="absolute top-4 right-4 z-30 bg-white/95 backdrop-blur-md p-2 rounded-full shadow-md text-gray-700 hover:bg-white hover:text-black hover:scale-105 active:scale-95 transition-all cursor-pointer border border-gray-200"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Right Column: Premium Details & Custom Fabric Picker */}
          <div className="p-6 sm:p-10 flex flex-col bg-white">
            <div className="flex-1 space-y-6">
              
              {/* Category & Custom Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#6A4C6D] uppercase tracking-[0.25em]">
                  {product.category} &bull; {product.subcategory}
                </span>
                <span className="text-xs bg-[#6A4C6D]/10 text-[#6A4C6D] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#E8A5B8]" />
                  <span>{isBn ? 'কাস্টম টেইলরড' : 'Custom Tailored'}</span>
                </span>
              </div>

              {/* Main Product Title */}
              <h1 className="text-2xl sm:text-4xl font-serif italic text-[#1E293B] font-bold leading-snug">
                {title}
              </h1>

              {/* Price Display & Size Guide Link */}
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-serif italic font-bold text-[#6A4C6D]">
                    ৳ {calculatedPrice.toLocaleString()}
                  </span>
                  {selectedFabric.surcharge > 0 && (
                    <span className="text-xs text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      (+৳{selectedFabric.surcharge} {isBn ? 'লাক্সারি ফেব্রিক' : 'Luxury Fabric'})
                    </span>
                  )}
                </div>

                {/* Size Guide Popup Trigger Buttons */}
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B8860B] hover:text-[#2C2821] bg-[#FAF6EE] hover:bg-[#F3EFE6] px-3.5 py-2 rounded-full border border-[#E0D9CC] transition-all cursor-pointer shadow-2xs group"
                  >
                    <Ruler className="w-4 h-4 text-[#B8860B] group-hover:scale-110 transition-transform" />
                    <span>{isBn ? 'সাইজ চার্ট' : 'Size Chart'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowVirtualGuide(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 hover:text-amber-950 bg-amber-100 hover:bg-amber-200 px-3.5 py-2 rounded-full border border-amber-300 transition-all cursor-pointer shadow-2xs group"
                  >
                    <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                    <span>{isBn ? 'ভার্চুয়াল সাইজ গাইড' : 'Virtual Size Guide'}</span>
                  </button>
                </div>
              </div>

              {/* Fabric Swatch Selector Bar */}
              <div className="bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border border-[#6A4C6D]/15 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6A4C6D] flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-amber-600" />
                    <span>{isBn ? 'পছন্দের ফেব্রিক সোয়াচ নির্বাচন করুন:' : 'Select Fabric Swatch:'}</span>
                  </label>

                  <button
                    onClick={() => setShowFabricStudio(true)}
                    className="text-xs font-bold text-amber-800 hover:text-amber-950 underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isBn ? '৩ডি স্টুডিওতে টেস্ট করুন' : '3D Fabric Studio'}</span>
                  </button>
                </div>

                {/* Swatches horizontal carousel */}
                <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                  {fabricSwatches.slice(0, 6).map(fab => (
                    <button
                      key={fab.id}
                      onClick={() => setSelectedFabric(fab)}
                      className={`relative flex items-center gap-2 p-2 rounded-xl border transition-all text-left shrink-0 ${
                        selectedFabric.id === fab.id
                          ? 'bg-amber-100/80 border-amber-600 shadow-xs ring-2 ring-amber-500/30'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <img
                        src={fab.textureImage}
                        alt={fab.nameEn}
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                      />
                      <div className="text-[11px]">
                        <span className="font-bold text-slate-800 block leading-tight max-w-[90px] truncate">{fab.nameEn}</span>
                        <span className="text-[9px] text-slate-500 block uppercase">{fab.origin}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Active fabric details pill */}
                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#6A4C6D]/10">
                  <span className="text-slate-600">
                    <strong>{selectedFabric.nameEn}</strong> &bull; {selectedFabric.weightGsm} GSM &bull; {selectedFabric.threadCount}
                  </span>
                  <button
                    onClick={() => setInspectFabric(selectedFabric)}
                    className="text-[10px] text-amber-700 font-bold hover:underline flex items-center gap-1"
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isBn ? 'মাইক্রো জুম' : 'Micro Zoom'}</span>
                  </button>
                </div>
              </div>

              {/* Guarantee Pill */}
              <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50/90 px-4 py-3 rounded-xl text-xs sm:text-sm font-medium border border-emerald-200">
                <ShieldCheck className="w-5 h-5 shrink-0 text-emerald-600" />
                <span>{isBn ? '১০০% প্রিমিয়াম টেলর্ড গ্যারান্টি এবং হোম ডেলিভারি' : '100% Custom Tailored Guarantee & Doorstep Delivery'}</span>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="pt-8 mt-8 border-t border-[#6A4C6D]/10 space-y-4">
              
              {/* 3D Visualizer Full Banner Button */}
              <button
                onClick={() => setShowFabricStudio(true)}
                className="w-full py-3 px-4 rounded-xl text-xs font-bold uppercase tracking-wider bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-all flex items-center justify-center gap-2 shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isBn ? '৩ডি স্টুডিওতে ফেব্রিকের ফিট ও আলো পরীক্ষা করুন' : 'Test Fabric Fit & Lighting in 3D Studio'}</span>
              </button>

              {/* 2 Main Buttons: Add to bag & Measurement */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. Add to bag */}
                <button
                  onClick={handleAddToCart}
                  className={`w-full py-4 px-4 rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm cursor-pointer ${
                    added
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#1E293B] text-white hover:bg-[#6A4C6D]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-5 h-5" />
                      <span>{isBn ? 'যোগ করা হয়েছে' : 'Added to bag'}</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-5 h-5" />
                      <span>{isBn ? 'কার্টে যোগ করুন' : 'Add to bag'}</span>
                    </>
                  )}
                </button>

                {/* 2. Measurement */}
                <button
                  onClick={() => setShowMeasurement(true)}
                  className="w-full py-4 px-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#FAF9F6] text-[#6A4C6D] border border-[#6A4C6D]/30 hover:bg-[#6A4C6D] hover:text-white transition-all flex items-center justify-center gap-2 shadow-2xs group cursor-pointer"
                >
                  <Ruler className="w-5 h-5 text-[#6A4C6D] group-hover:text-white" />
                  <span>{isBn ? 'মেজারমেন্ট' : 'Measurement'}</span>
                </button>
              </div>

              {/* 3. Checkout */}
              <button
                onClick={handleDirectBuyNow}
                className="w-full py-3.5 px-4 rounded-xl text-sm font-bold uppercase tracking-wider bg-[#E8A5B8] text-white hover:bg-[#d88ba0] transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <Zap className="w-5 h-5 fill-current" />
                <span>{isBn ? 'চেকআউট' : 'Checkout'}</span>
              </button>
            </div>
            
            {/* FAQ Accordion Section */}
            <FAQAccordion />
          </div>
        </div>
      </div>

      {/* Measurement Modal Popup */}
      {showMeasurement && (
        <MeasurementModal
          product={product}
          onClose={() => setShowMeasurement(false)}
        />
      )}

      {/* Direct Checkout Modal Popup */}
      {showDirectCheckout && (
        <CheckoutModal
          total={calculatedPrice}
          onClose={() => setShowDirectCheckout(false)}
        />
      )}

      {/* Size Guide Modal Popup */}
      {showSizeGuide && (
        <SizeGuideModal
          category={product.category}
          subcategory={product.subcategory}
          onClose={() => setShowSizeGuide(false)}
        />
      )}

      {/* Virtual Size Guide Modal Popup */}
      {showVirtualGuide && (
        <VirtualSizeGuideModal
          initialCategory={product.category}
          onClose={() => setShowVirtualGuide(false)}
        />
      )}

      {/* Fabric 3D Studio Modal */}
      {showFabricStudio && (
        <FabricStudioModal
          initialProduct={product}
          initialFabric={selectedFabric}
          onClose={() => setShowFabricStudio(false)}
        />
      )}

      {/* Fabric Magnifier Inspect Modal */}
      {inspectFabric && (
        <FabricMagnifierModal
          fabric={inspectFabric}
          onClose={() => setInspectFabric(null)}
          onApplyFabric={(fab) => setSelectedFabric(fab)}
        />
      )}
    </div>
    </>
  );
}

