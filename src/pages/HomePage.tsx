import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight, Sparkles, Scissors, Eye, ArrowRight } from 'lucide-react';
import { HeroCarousel } from '../components/HeroCarousel';
import { OrderTracking } from '../components/OrderTracking';
import { ProductCard } from '../components/ProductCard';
import { PullToRefresh } from '../components/PullToRefresh';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';
import { fabricSwatches } from '../data/fabrics';

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

        {/* 2. 3D Fabric Visualization Studio Feature Banner */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-10 mt-6 sm:mt-10">
          <div className="relative rounded-3xl bg-slate-900 text-white p-6 sm:p-10 overflow-hidden shadow-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative z-10 max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>{isBn ? 'নতুন ৩ডি ফিচার' : 'Interactive Feature'}</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-snug">
                {isBn ? '৩ডি ফেব্রিক ভিজ্যুয়ালাইজার স্টুডিও' : '3D Fabric Visualization Studio'}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {isBn
                  ? 'গিজা কটন, ইতালিয়ান উল এবং মুলবেরি সিল্ক সোয়াচ থ্রি-ডি মডেলে লাগিয়ে কাপড় নির্বাচন ও টেক্সচারের লুক যাচাই করুন।'
                  : 'Browse world-class fabric swatches, inspect micro-weave textures in 4x zoom, and apply them dynamically onto 3D garment silhouettes.'}
              </p>

              {/* Swatch Previews */}
              <div className="flex items-center gap-2 pt-1 overflow-x-auto pb-1">
                {fabricSwatches.slice(0, 5).map(f => (
                  <div key={f.id} className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700/80 p-1.5 rounded-xl text-[10px] text-slate-300 shrink-0">
                    <img src={f.textureImage} alt={f.nameEn} className="w-5 h-5 rounded-md object-cover" />
                    <span className="font-semibold text-white">{f.code}</span>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link
                  to="/fabrics"
                  className="inline-flex items-center gap-2 py-3 px-6 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  <Scissors className="w-4 h-4" />
                  <span>{isBn ? 'ফেব্রিক গ্যালারি দেখুন' : 'Explore Fabric Studio'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Preview Card */}
            <div className="relative w-full md:w-80 aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden border border-slate-700 shadow-xl shrink-0 group">
              <img
                src={fabricSwatches[1].highResImage}
                alt="3D Fabric Visualizer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent p-4 flex flex-col justify-end">
                <span className="text-amber-400 font-bold text-xs">Italian Super 150s Merino Wool</span>
                <span className="text-[10px] text-slate-300">Biella, Italy &bull; 260 GSM</span>
              </div>
            </div>
          </div>
        </div>

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
