import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { handleImageError } from '../lib/imageUtils';
import menHeroImg from '../assets/images/men_tailoring_hero_1784914117842.jpg';
import womenHeroImg from '../assets/images/women_boutique_hero_1784917522959.jpg';
import kidsHeroImg from '../assets/images/kids_festive_hero_1784917539088.jpg';

const slides = [
  {
    id: 1,
    image: menHeroImg,
    category: 'men',
    titleEn: 'Exquisite Men Tailoring',
    titleBn: 'পুরুষদের আভিজাত্যপূর্ণ দর্জি শিল্প',
    subEn: 'Custom-fitted panjabi, suits & traditional waistcoats crafted for perfection.',
    subBn: 'নিখুঁত ফিটিংয়ের পাঞ্জাবি, স্যুট এবং ট্রেডিশনাল ওয়েস্টকোট।',
    ctaEn: 'Explore Men',
    ctaBn: 'পুরুষদের কালেকশন দেখুন'
  },
  {
    id: 2,
    image: womenHeroImg,
    category: 'women',
    titleEn: 'Designer Women Boutique',
    titleBn: 'মহিলাদের ডিজাইনার বুটিক',
    subEn: 'Luxury abaya, borka & customized salwar kameez tailored to your measurements.',
    subBn: 'আপনার মাপে তৈরি লাক্সারি আবায়া, বোরকা ও সালোয়ার কামিজ।',
    ctaEn: 'Explore Women',
    ctaBn: 'মহিলাদের কালেকশন দেখুন'
  },
  {
    id: 3,
    image: kidsHeroImg,
    category: 'kids',
    titleEn: 'Little Trends & Festive Wear',
    titleBn: 'বাচ্চাদের উৎসবের পোশাক',
    subEn: 'Comfortable and stylish festival outfits tailored for young ones.',
    subBn: 'ছোটদের জন্য আরামদায়ক ও স্টাইলিশ উৎসবের পোশাক।',
    ctaEn: 'Explore Kids',
    ctaBn: 'বাচ্চাদের কালেকশন দেখুন'
  }
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const { language } = useAppContext();
  const isBn = language === 'bn';

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative w-full h-[65vh] min-h-[420px] max-h-[650px] overflow-hidden bg-[#1E293B]">
      {/* Slide Images */}
      {slides.map((slide, index) => {
        const isActive = index === current;
        return (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10" />
            <img
              src={slide.image}
              alt={isBn ? slide.titleBn : slide.titleEn}
              referrerPolicy="no-referrer"
              onError={handleImageError}
              className="w-full h-full object-cover object-center scale-105 transition-transform duration-10000 ease-out"
            />

            {/* Content Overlay */}
            <div className="absolute inset-0 z-20 flex items-center max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
              <div className="max-w-xl text-white space-y-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif italic font-medium leading-tight text-white drop-shadow-sm">
                  {isBn ? slide.titleBn : slide.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed max-w-md">
                  {isBn ? slide.subBn : slide.subEn}
                </p>
                <div className="pt-2">
                  <Link
                    to={`/category/${slide.category}`}
                    className="inline-flex items-center gap-2 bg-white text-[#1E293B] px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#E8A5B8] hover:text-white transition-all shadow-lg hover:shadow-xl"
                  >
                    <span>{isBn ? slide.ctaBn : slide.ctaEn}</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-all"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2.5 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-all"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
