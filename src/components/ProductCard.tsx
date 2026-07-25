import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Check, Eye, Scissors, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useAppContext } from '../store/AppContext';
import { useFlyingCart } from './FlyingCartAnimation';
import { translations } from '../i18n';
import { handleImageError } from '../lib/imageUtils';

interface ProductCardProps {
  key?: React.Key;
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { language, addToCart } = useAppContext();
  const { triggerFlyToCart } = useFlyingCart();
  const navigate = useNavigate();
  const t = translations[language];
  const isBn = language === 'bn';

  const [added, setAdded] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const rawTitle = isBn ? product.titleBn : product.titleEn;

  // Title formatting: if title is too long, show only first 3-4 words or max 14 characters + ...
  const formatCompactTitle = (text: string) => {
    if (!text) return '';
    const words = text.trim().split(/\s+/);
    if (words.length > 3) {
      return words.slice(0, 3).join(' ') + '...';
    }
    if (text.length > 15) {
      return text.substring(0, 13).trim() + '...';
    }
    return text;
  };

  const displayTitle = formatCompactTitle(rawTitle);

  // Image and Price rendering
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    triggerHaptic();

    // Trigger flying animation to top-right cart
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    triggerFlyToCart(
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      product.image
    );

    // Add to cart in background WITHOUT opening cart drawer/modal
    addToCart({ id: crypto.randomUUID(), product, quantity: 1 }, false);

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleOpenMeasurement = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerHaptic();
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    triggerHaptic();
    navigate(`/product/${product.id}`);
  };

  return (
    <>
      <div
        onClick={handleCardClick}
        className="group relative flex flex-col bg-white rounded-2xl p-2.5 sm:p-3.5 shadow-2xs border border-[#2563EB]/15 hover:border-[#2563EB]/40 transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden active:scale-[0.98] transition-transform"
      >
        {/* Product Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#F1F5F9] rounded-xl mb-2.5">
          {!isImageLoaded && (
            <div className="absolute inset-0 bg-slate-200 animate-pulse z-0" />
          )}
          <img
            src={product.image}
            alt={rawTitle}
            referrerPolicy="no-referrer"
            onError={(e) => {
              setIsImageLoaded(true);
              handleImageError(e);
            }}
            onLoad={() => setIsImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
              isImageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
          />

          {/* Top Overlay Badges */}
          <div className="absolute top-2 inset-x-2 flex items-center justify-between gap-1 z-10 pointer-events-none">
            {/* Subcategory Badge - No wrapping */}
            <span className="bg-white/95 text-[#0F172A] backdrop-blur-md text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-xs border border-gray-100 whitespace-nowrap truncate max-w-[85px] sm:max-w-[110px]">
              {product.subcategory}
            </span>

            {/* Bespoke / Custom Badge */}
            <span className="bg-[#2563EB] text-white text-[8px] sm:text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-tight shadow-xs flex items-center gap-0.5 whitespace-nowrap shrink-0">
              <Sparkles className="w-2.5 h-2.5 fill-current" />
              <span>{isBn ? 'বিস্পোক' : 'BESPOKE'}</span>
            </span>
          </div>

          {/* Quick View Hover Overlay */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-white/95 text-[#0F172A] backdrop-blur-md text-[10px] font-bold uppercase tracking-widest px-3.5 py-2 rounded-full shadow-md flex items-center gap-1.5 transform group-hover:scale-100 scale-95 transition-all">
              <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{isBn ? 'ঝটপট দেখুন' : 'Quick View'}</span>
            </span>
          </div>
        </div>

        {/* Content Details */}
        <div className="flex flex-col flex-1 px-0.5">
          {/* Subtitle / Material Tag */}
          <div className="text-[10px] font-black text-[#2563EB] uppercase tracking-wider mb-0.5 line-clamp-1">
            {product.material ? `${product.material} ${product.subcategory}` : `${product.category} ${product.subcategory}`}
          </div>

          {/* Main Title - Truncated cleanly to 3-4 words max */}
          <h3
            title={rawTitle}
            className="font-serif font-bold text-sm sm:text-base text-[#0F172A] leading-snug line-clamp-1 mb-2 group-hover:text-[#2563EB] transition-colors"
          >
            {displayTitle}
          </h3>

          {/* Single Price Row */}
          <div className="flex items-center justify-between mt-auto mb-2.5 pt-1.5 border-t border-gray-100">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              {isBn ? 'মূল্য' : 'Price'}
            </span>
            <span className="text-sm sm:text-base font-extrabold text-[#1E3A8A]">
              ৳{product.price.toLocaleString()}
            </span>
          </div>

          {/* Stacked Action Buttons */}
          <div className="space-y-1.5">
            {/* 1. Tailor Fit Button */}
            <button
              onClick={handleOpenMeasurement}
              className="w-full py-2 px-3 rounded-xl text-xs font-bold text-[#2563EB] bg-[#EFF6FF] border border-[#BFDBFE] hover:bg-[#DBEAFE] active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <Scissors className="w-3.5 h-3.5" />
              <span>{isBn ? 'টেইলার ফিট' : 'Tailor Fit'}</span>
            </button>

            {/* 2. Add Button (Direct Add with Flying Animation) */}
            <button
              onClick={handleAddToCart}
              className={`w-full py-2 px-3 rounded-xl text-xs font-bold text-white transition-all flex items-center justify-center gap-1.5 shadow-xs ${
                added
                  ? 'bg-emerald-700'
                  : 'bg-[#0F172A] hover:bg-[#1E293B] active:scale-95'
              }`}
            >
              {added ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{isBn ? 'যোগ হলো' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{isBn ? 'কার্টে যোগ করুন' : 'Add'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

    </>
  );
}
