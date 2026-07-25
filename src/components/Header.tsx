import React, { useState, useRef, useEffect } from 'react';
import { ShoppingBag, Menu, Search, X, User, Sparkles, ArrowRight, Home } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../store/AppContext';
import { useFlyingCart } from './FlyingCartAnimation';
import { translations } from '../i18n';
import { Product } from '../types';
import { handleImageError } from '../lib/imageUtils';
import zoponoGoldLogoImg from '../assets/images/zopono_gold_logo_1784923279901.jpg';

export function Header() {
  const { language, setLanguage, cart, setIsCartOpen, setIsAdminOpen, products } = useAppContext();
  const { cartPulse } = useFlyingCart();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const t = translations[language];
  const isBn = language === 'bn';

  // Popular search chips for quick grounding queries
  const popularKeywords = [
    { labelEn: 'Panjabi', labelBn: 'পাঞ্জাবি', term: 'panjabi' },
    { labelEn: 'Suit', labelBn: 'সুট', term: 'suit' },
    { labelEn: 'Gown', labelBn: 'গাউন', term: 'gown' },
    { labelEn: 'Customizable', labelBn: 'কাস্টমাইজড', term: 'customizable' },
    { labelEn: 'Cotton', labelBn: 'কটন', term: 'cotton' },
    { labelEn: 'Kids', labelBn: 'বাচ্চাদের', term: 'kids' },
  ];

  // Grounded search filtering logic
  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.toLowerCase().trim();
        const titleEn = (p.titleEn || '').toLowerCase();
        const titleBn = (p.titleBn || '').toLowerCase();
        const descEn = (p.descriptionEn || '').toLowerCase();
        const descBn = (p.descriptionBn || '').toLowerCase();
        const category = (p.category || '').toLowerCase();
        const subcategory = (p.subcategory || '').toLowerCase();
        const material = (p.material || '').toLowerCase();
        const color = (p.color || '').toLowerCase();

        if (q === 'customizable') return p.isCustomizable;

        return (
          titleEn.includes(q) ||
          titleBn.includes(q) ||
          descEn.includes(q) ||
          descBn.includes(q) ||
          category.includes(q) ||
          subcategory.includes(q) ||
          material.includes(q) ||
          color.includes(q)
        );
      })
    : [];

  // Focus input when search opens
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Click outside to close search dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut ESC to close
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E1D8]/80 shadow-2xs font-serif">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-18 sm:h-24 gap-2">
          
          {/* Left Side: Brand Logo & Title */}
          <div className="flex items-center shrink-0">
            <Link
              to="/"
              className="flex items-center gap-2.5 sm:gap-3.5 group transition-transform active:scale-98"
            >
              {/* Circular Gold Emblem Logo */}
              <div className="relative w-10 h-10 sm:w-13 sm:h-13 rounded-full p-0.5 bg-gradient-to-tr from-[#B8860B] via-[#E5C158] to-[#996515] shadow-xs flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-full bg-[#FAF8F5] p-0.5 overflow-hidden flex items-center justify-center">
                  <img
                    src={zoponoGoldLogoImg}
                    alt="Zopono Gold Logo"
                    referrerPolicy="no-referrer"
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-full mix-blend-multiply"
                  />
                </div>
              </div>

              {/* Text Brand Name & Subtitle */}
              <div className="flex flex-col">
                <span className="text-xl sm:text-2xl lg:text-3xl font-serif font-extrabold tracking-tight text-[#23201A] group-hover:text-[#B8860B] transition-colors leading-none">
                  ZOPONO
                </span>
                <span className="text-[10px] sm:text-[11px] lg:text-[12px] font-sans font-semibold uppercase tracking-[0.28em] text-[#555046] mt-0.5 sm:mt-1 leading-none">
                  {isBn ? 'টেইলার' : 'TAILOR'}
                </span>
              </div>
            </Link>
          </div>

          {/* Center-Right Navigation & Search Input Modal Container */}
          <div ref={searchContainerRef} className="relative hidden md:block">
            {isSearchOpen && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 lg:w-96 bg-white rounded-full border border-[#D5CFC3] shadow-lg flex items-center px-4 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                <Search className="w-4 h-4 text-[#8C8476] shrink-0 mr-2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={
                    isBn
                      ? 'পোশাক, ক্যাটাগরি বা ফেব্রিক খুঁজুন...'
                      : 'Search suits, panjabi, fabrics...'
                  }
                  className="w-full bg-transparent text-xs text-slate-900 font-sans placeholder-[#9C9486] outline-none"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="text-[#8C8476] hover:text-slate-800 p-1"
                >
                  <X size={16} />
                </button>

                {/* Instant Search Dropdown Panel */}
                <div className="absolute top-full right-0 mt-3 w-80 lg:w-96 bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E0D9CC] overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="p-3 bg-[#F3EFE6] border-b border-[#E0D9CC] flex flex-wrap items-center gap-1.5 text-xs font-sans">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#70685B] mr-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#B8860B]" />
                      {isBn ? 'জনপ্রিয়:' : 'Popular:'}
                    </span>
                    {popularKeywords.map((kw) => (
                      <button
                        key={kw.term}
                        onClick={() => setSearchQuery(kw.term)}
                        className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border transition-all ${
                          searchQuery.toLowerCase() === kw.term
                            ? 'bg-[#B8860B] text-white border-[#B8860B]'
                            : 'bg-white border-[#DCD5C8] text-[#555046] hover:bg-[#FAF8F5]'
                        }`}
                      >
                        {isBn ? kw.labelBn : kw.labelEn}
                      </button>
                    ))}
                  </div>

                  <div className="max-h-80 overflow-y-auto p-2 divide-y divide-[#EAE4D8] font-sans">
                    {searchQuery.trim() === '' ? (
                      <div className="p-5 text-center text-[#8C8476] space-y-1">
                        <Search className="w-6 h-6 mx-auto text-[#C2BBAE] stroke-1" />
                        <p className="text-xs font-medium">
                          {isBn
                            ? 'যেকোনো পোশাকের নাম লিখে সার্চ করুন'
                            : 'Type any product name or material'}
                        </p>
                      </div>
                    ) : filteredProducts.length === 0 ? (
                      <div className="p-5 text-center text-[#8C8476] space-y-1">
                        <p className="text-xs font-semibold text-slate-700">
                          {isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No items found'}
                        </p>
                      </div>
                    ) : (
                      filteredProducts.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => {
                            navigate(`/product/${product.id}`);
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="flex items-center gap-3 p-2 hover:bg-white rounded-xl cursor-pointer transition-colors group"
                        >
                          <img
                            src={product.image}
                            alt={product.titleEn}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-10 h-12 object-cover rounded-md border border-[#E0D9CC] shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#B8860B]">
                              {isBn ? product.titleBn : product.titleEn}
                            </h4>
                            <p className="text-[11px] font-bold text-[#2B2823]">
                              ৳{product.price.toLocaleString()}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#B8860B]" />
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Side: Clean Action Icons matching screenshot */}
          <div className="flex items-center gap-3.5 sm:gap-5 lg:gap-7 shrink-0 text-[#2C2821]">
            
            {/* Search Icon */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              aria-label="Search"
              className="hover:text-[#B8860B] transition-colors p-1 rounded-full"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
            </button>

            {/* Shopping Bag Icon with Badge */}
            <button
              id="header-cart-icon"
              onClick={() => setIsCartOpen(true)}
              aria-label="Shopping Bag"
              className={`relative p-1 hover:text-[#B8860B] transition-all duration-300 ${
                cartPulse ? 'scale-125 text-[#B8860B]' : 'scale-100'
              }`}
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              {cart.length > 0 && (
                <span className={`absolute -top-1 -right-1.5 bg-[#4A453D] text-white text-[10px] font-sans font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs transition-transform ${
                  cartPulse ? 'scale-125 bg-[#B8860B]' : 'scale-100'
                }`}>
                  {cart.length}
                </span>
              )}
            </button>

            {/* User Profile / Admin Icon */}
            <button
              onClick={() => setIsAdminOpen(true)}
              aria-label="User Account"
              className="hover:text-[#B8860B] transition-colors p-1 rounded-full"
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
            </button>

            {/* Menu Drawer Toggle Icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              className="hover:text-[#B8860B] transition-colors p-1 rounded-full"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" strokeWidth={1.75} />
              ) : (
                <Menu className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Search Overlay Input Bar */}
      {isSearchOpen && (
        <div className="md:hidden bg-[#FAF8F5] border-b border-[#E6E1D8] p-3 shadow-lg animate-in slide-in-from-top-2 font-sans">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-[#8C8476]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isBn ? 'পোশাক বা ফেব্রিক খুঁজুন...' : 'Search clothing or fabric...'}
              className="w-full bg-white border border-[#DCD5C8] text-xs text-slate-900 pl-9 pr-8 py-2.5 rounded-xl outline-none"
              autoFocus
            />
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute right-2 text-[#8C8476] p-1"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex flex-wrap gap-1 mt-2.5">
            {popularKeywords.map((kw) => (
              <button
                key={kw.term}
                onClick={() => setSearchQuery(kw.term)}
                className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-white border border-[#DCD5C8] text-[#555046]"
              >
                {isBn ? kw.labelBn : kw.labelEn}
              </button>
            ))}
          </div>

          {searchQuery.trim() && (
            <div className="max-h-72 overflow-y-auto mt-3 divide-y divide-[#EAE4D8] border-t border-[#EAE4D8] pt-2">
              {filteredProducts.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  {isBn ? 'কোনো ফলাফল পাওয়া যায়নি' : 'No matching items'}
                </p>
              ) : (
                filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 py-2.5 cursor-pointer"
                  >
                    <img
                      src={product.image}
                      alt={product.titleEn}
                      referrerPolicy="no-referrer"
                      onError={handleImageError}
                      className="w-10 h-12 object-cover rounded border border-[#E0D9CC] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-800 truncate">
                        {isBn ? product.titleBn : product.titleEn}
                      </h4>
                      <p className="text-[11px] font-bold text-[#2B2823]">
                        ৳{product.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Navigation Drawer Menu (Toggled by Menu Icon) */}
      {isMobileMenuOpen && (
        <div className="bg-[#FAF8F5] border-t border-[#E6E1D8] absolute top-full left-0 w-full shadow-xl z-50 animate-in fade-in slide-in-from-top-2 font-sans">
          <div className="max-w-7xl mx-auto p-6">
            <nav className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#2C2821]">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="hover:text-[#B8860B] transition-colors p-3 rounded-xl bg-white border border-[#E0D9CC] flex items-center gap-3"
              >
                <Home size={18} className="text-[#B8860B] shrink-0" />
                <span>{isBn ? 'হোম (Home)' : 'Home'}</span>
              </Link>

              <Link 
                to="/category/men" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="hover:text-[#B8860B] transition-colors p-3 rounded-xl bg-white border border-[#E0D9CC]"
              >
                {t.men}
              </Link>

              <Link 
                to="/category/women" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="hover:text-[#B8860B] transition-colors p-3 rounded-xl bg-white border border-[#E0D9CC]"
              >
                {t.women}
              </Link>

              <Link 
                to="/category/kids" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="hover:text-[#B8860B] transition-colors p-3 rounded-xl bg-white border border-[#E0D9CC]"
              >
                {t.kids || 'Kids'}
              </Link>

              <a 
                href="/#track-order" 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="hover:text-[#B8860B] transition-colors p-3 rounded-xl bg-white border border-[#E0D9CC]"
              >
                {t.trackOrder}
              </a>

              <button 
                onClick={() => {
                  setIsAdminOpen(true);
                  setIsMobileMenuOpen(false);
                }} 
                className="text-left hover:text-[#B8860B] transition-colors p-3 rounded-xl bg-white border border-[#E0D9CC]"
              >
                {isBn ? 'এডমিন প্যানেল' : 'Admin Panel'}
              </button>
            </nav>

            {/* Language Selector in Drawer */}
            <div className="border-t border-[#E0D9CC] mt-6 pt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-[#70685B]">
                {isBn ? 'ভাষা নির্বাচন করুন:' : 'Select Language:'}
              </span>
              <div className="flex bg-[#EFECE6] p-1 rounded-full text-xs font-bold uppercase">
                <button 
                  onClick={() => setLanguage('en')}
                  className={`px-4 py-1 rounded-full transition-all ${language === 'en' ? 'bg-[#2B2823] text-white shadow-xs' : 'text-[#70685B] hover:text-black'}`}
                >
                  English
                </button>
                <button 
                  onClick={() => setLanguage('bn')}
                  className={`px-4 py-1 rounded-full transition-all ${language === 'bn' ? 'bg-[#2B2823] text-white shadow-xs' : 'text-[#70685B] hover:text-black'}`}
                >
                  বাংলা
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

