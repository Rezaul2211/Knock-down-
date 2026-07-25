import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { OrderTracking } from '../components/OrderTracking';
import { ProductCard } from '../components/ProductCard';
import { PullToRefresh } from '../components/PullToRefresh';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';

export function HomePage() {
  const { products, language, refreshProducts } = useAppContext();
  const t = translations[language];
  const isBn = language === 'bn';

  // Preview up to 4 items per category for homepage
  const menPreview = products.filter((p) => p.category === 'men').slice(0, 4);
  const womenPreview = products.filter((p) => p.category === 'women').slice(0, 4);
  const kidsPreview = products.filter((p) => p.category === 'kids').slice(0, 4);

  return (
    <PullToRefresh onRefresh={refreshProducts}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* 1. Hero Image Carousel */}
        <HeroCarousel />

        {/* Main Container */}
        <div className="py-6 sm:py-10 space-y-10 sm:space-y-14 max-w-7xl mx-auto px-3 sm:px-6 lg:px-10">

          {/* Men's Section */}
          <section id="men">
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#6A4C6D]/15 pb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1E293B]">
                  {isBn ? 'এক্সপ্লোর ম্যান' : 'Explore Men'}
                </h2>
              </div>
              <Link
                to="/category/men"
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-2xs hover:shadow-xs active:scale-95"
              >
                <span>{isBn ? 'সবগুলো দেখুন' : 'See All'}</span>
                <ChevronRight className="w-3 h-3 text-[#2563EB]" />
              </Link>
            </div>

            {/* 2-Column Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {menPreview.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

          {/* Women's Section */}
          <section id="women" className="relative my-2">
            <div className="absolute inset-0 bg-[#EFECE6]/60 -mx-3 sm:-mx-6 lg:-mx-10 rounded-2xl sm:rounded-3xl -z-10" />
            <div className="py-6 sm:py-8">
              <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#6A4C6D]/15 pb-3">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1E293B]">
                    {isBn ? 'এক্সপ্লোর ওমেন' : 'Explore Women'}
                  </h2>
                </div>
                <Link
                  to="/category/women"
                  className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-2xs hover:shadow-xs active:scale-95"
                >
                  <span>{isBn ? 'সবগুলো দেখুন' : 'See All'}</span>
                  <ChevronRight className="w-3 h-3 text-[#2563EB]" />
                </Link>
              </div>

              {/* 2-Column Product Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {womenPreview.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>

          {/* Kids' Section */}
          <section id="kids">
            <div className="flex items-center justify-between mb-4 sm:mb-6 border-b border-[#6A4C6D]/15 pb-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-serif italic text-[#1E293B]">
                  {isBn ? 'এক্সপ্লোর কিডস' : 'Explore Kids'}
                </h2>
              </div>
              <Link
                to="/category/kids"
                className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] px-3 py-1.5 rounded-full transition-all flex items-center gap-1 shadow-2xs hover:shadow-xs active:scale-95"
              >
                <span>{isBn ? 'সবগুলো দেখুন' : 'See All'}</span>
                <ChevronRight className="w-3 h-3 text-[#2563EB]" />
              </Link>
            </div>

            {/* 2-Column Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {kidsPreview.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>

        </div>

        <OrderTracking />
      </motion.div>
    </PullToRefresh>
  );
}
