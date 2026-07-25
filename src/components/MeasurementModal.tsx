import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Ruler, Check, Zap, Info, ChevronLeft, ChevronRight, HelpCircle, Sparkles } from 'lucide-react';
import { Product, MeasurementProfile } from '../types';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';
import { SizeGuideModal } from './SizeGuideModal';
import { VirtualSizeGuideModal } from './VirtualSizeGuideModal';

interface MeasurementModalProps {
  product: Product;
  onClose: () => void;
  onProceedToCheckout?: () => void;
}

const standardPresets: Record<string, Record<string, string>> = {
  S: { length: '38', chest: '36', waist: '34', shoulder: '16.5', sleeve: '23', neck: '14.5', hip: '38', armhole: '17' },
  M: { length: '40', chest: '38', waist: '36', shoulder: '17.5', sleeve: '24', neck: '15', hip: '40', armhole: '18' },
  L: { length: '42', chest: '40', waist: '38', shoulder: '18.5', sleeve: '25', neck: '15.5', hip: '42', armhole: '19' },
  XL: { length: '44', chest: '42', waist: '40', shoulder: '19.5', sleeve: '25.5', neck: '16', hip: '44', armhole: '20' },
  XXL: { length: '46', chest: '44', waist: '42', shoulder: '20.5', sleeve: '26', neck: '16.5', hip: '46', armhole: '21' },
};

// Guide Steps definition with SVG illustrations
const guideSteps = [
  {
    id: 'chest',
    titleEn: '1. Chest / Bust (বুকের মাপ)',
    titleBn: '১. বুকের মাপ (Chest)',
    descEn: 'Wrap the measuring tape under your arms around the fullest part of your chest. Keep tape flat and comfortable.',
    descBn: 'বগল থেকে ফিতা দিয়ে বুকের সবচেয়ে উঁচু অংশের চারপাশে সমান্তরালভাবে মেপে নিন।',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full max-h-40 text-[#6A4C6D]">
        {/* Body Outline */}
        <path d="M70,40 Q100,30 130,40 L150,80 L135,80 L130,170 L70,170 L65,80 L50,80 Z" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="100" cy="25" r="14" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        {/* Chest Highlight Line */}
        <line x1="60" y1="85" x2="140" y2="85" stroke="#E8A5B8" strokeWidth="4" strokeDasharray="4 2" />
        <circle cx="100" cy="85" r="5" fill="#6A4C6D" />
        <text x="100" y="75" textAnchor="middle" fill="#6A4C6D" fontSize="11" fontWeight="bold">CHEST</text>
      </svg>
    )
  },
  {
    id: 'shoulder',
    titleEn: '2. Shoulder Width (কাঁধের চওড়া)',
    titleBn: '২. কাঁধের চওড়া (Shoulder)',
    descEn: 'Measure across the back from the tip of left shoulder bone to the right shoulder bone.',
    descBn: 'পিঠের দিক থেকে বাম কাঁধের হাড়ের শেষ থেকে ডান কাঁধের হাড় পর্যন্ত মেপে নিন।',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full max-h-40 text-[#6A4C6D]">
        {/* Body Back Outline */}
        <path d="M70,45 Q100,35 130,45 L155,80 L135,85 L130,170 L70,170 L65,85 L45,80 Z" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="100" cy="25" r="14" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        {/* Shoulder Line */}
        <line x1="50" y1="70" x2="150" y2="70" stroke="#E8A5B8" strokeWidth="4" />
        <circle cx="50" cy="70" r="5" fill="#6A4C6D" />
        <circle cx="150" cy="70" r="5" fill="#6A4C6D" />
        <text x="100" y="60" textAnchor="middle" fill="#6A4C6D" fontSize="11" fontWeight="bold">SHOULDER</text>
      </svg>
    )
  },
  {
    id: 'sleeve',
    titleEn: '3. Sleeve Length (হাতার মাপ)',
    titleBn: '৩. হাতার দৈর্ঘ্য (Sleeve)',
    descEn: 'Measure from shoulder tip down along the outer arm to your wrist bone.',
    descBn: 'কাঁধের জোড়া থেকে শুরু করে কনুই হয়ে হাতের কবজি পর্যন্ত মেপে নিন।',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full max-h-40 text-[#6A4C6D]">
        <path d="M70,45 Q100,35 130,45 L150,80 L135,80 L130,170 L70,170 L65,80 L50,80 Z" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="100" cy="25" r="14" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        {/* Sleeve Arrow */}
        <path d="M50,70 L40,110 L35,145" fill="none" stroke="#E8A5B8" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="70" r="4" fill="#6A4C6D" />
        <circle cx="35" cy="145" r="4" fill="#6A4C6D" />
        <text x="30" y="110" textAnchor="middle" fill="#6A4C6D" fontSize="11" fontWeight="bold">SLEEVE</text>
      </svg>
    )
  },
  {
    id: 'length',
    titleEn: '4. Full Garment Length (পোশাকের লম্বা)',
    titleBn: '৪. পোশাকের দৈর্ঘ্য (Length)',
    descEn: 'Measure straight down from top shoulder seam near neck down to preferred hemline.',
    descBn: 'গলার পাশে কাঁধের সর্বোচ্চ স্থান থেকে পোশাকের নিচের শেষ সীমানা পর্যন্ত সোজা মেপে নিন।',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full max-h-40 text-[#6A4C6D]">
        <path d="M70,45 Q100,35 130,45 L150,80 L135,80 L130,170 L70,170 L65,80 L45,80 Z" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="100" cy="25" r="14" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        {/* Vertical Length Line */}
        <line x1="85" y1="45" x2="85" y2="170" stroke="#E8A5B8" strokeWidth="4" strokeDasharray="4 2" />
        <circle cx="85" cy="45" r="4" fill="#6A4C6D" />
        <circle cx="85" cy="170" r="4" fill="#6A4C6D" />
        <text x="110" y="115" textAnchor="middle" fill="#6A4C6D" fontSize="11" fontWeight="bold">LENGTH</text>
      </svg>
    )
  },
  {
    id: 'waist',
    titleEn: '5. Waist & Hip (কোমর ও হিপ)',
    titleBn: '৫. কোমর ও হিপ (Waist & Hip)',
    descEn: 'Measure naturally around waistline above belly button, and fullest part of hips.',
    descBn: 'নাভির ওপর কোমরের সবচেয়ে সরু অংশে এবং হিপের সবচেয়ে চওড়া অংশে মেপে নিন।',
    svg: (
      <svg viewBox="0 0 200 200" className="w-full h-full max-h-40 text-[#6A4C6D]">
        <path d="M70,45 Q100,35 130,45 L150,80 L135,80 L130,170 L70,170 L65,80 L45,80 Z" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        <circle cx="100" cy="25" r="14" fill="none" stroke="#CBD5E1" strokeWidth="3" />
        {/* Waist & Hip Lines */}
        <line x1="68" y1="110" x2="132" y2="110" stroke="#E8A5B8" strokeWidth="4" />
        <line x1="65" y1="135" x2="135" y2="135" stroke="#6A4C6D" strokeWidth="3" strokeDasharray="3 2" />
        <text x="100" y="105" textAnchor="middle" fill="#6A4C6D" fontSize="10" fontWeight="bold">WAIST</text>
        <text x="100" y="148" textAnchor="middle" fill="#1E293B" fontSize="10" fontWeight="bold">HIP</text>
      </svg>
    )
  }
];

export function MeasurementModal({ product, onClose, onProceedToCheckout }: MeasurementModalProps) {
  const { language, addToCart } = useAppContext();
  const t = translations[language];
  const isBn = language === 'bn';

  const [selectedPreset, setSelectedPreset] = useState<string>('Custom');
  const [unit, setUnit] = useState<'inch' | 'cm'>('inch');
  const [activeGuideStep, setActiveGuideStep] = useState<number>(0);
  const [showGuide, setShowGuide] = useState<boolean>(true);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [showVirtualGuide, setShowVirtualGuide] = useState<boolean>(false);

  const [measurements, setMeasurements] = useState({
    length: '40', chest: '38', waist: '36', shoulder: '17.5', sleeve: '24', neck: '15', hip: '40', armhole: '18'
  });

  const [customizations, setCustomizations] = useState({
    collarStyle: 'classic', pocketStyle: 'none', fitPreference: 'regular', sleeveFinish: 'standard'
  });

  // Lock background page body scroll when modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSelectPreset = (sizeKey: string) => {
    setSelectedPreset(sizeKey);
    if (standardPresets[sizeKey]) {
      setMeasurements({ ...standardPresets[sizeKey] });
    }
  };

  const handleMeasurementChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedPreset('Custom');
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const handleCustomizationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomizations({ ...customizations, [e.target.name]: e.target.value });
  };

  const createProfileAndAddToCart = () => {
    const profile: MeasurementProfile = {
      id: crypto.randomUUID(),
      name: selectedPreset,
      measurements,
      customizations
    };

    addToCart({
      id: crypto.randomUUID(),
      product,
      quantity: 1,
      measurements: profile
    });
  };

  const handleSaveAndAdd = () => {
    createProfileAndAddToCart();
    onClose();
  };

  const handleDirectCheckout = () => {
    createProfileAndAddToCart();
    if (onProceedToCheckout) {
      onProceedToCheckout();
    } else {
      onClose();
    }
  };

  const fieldLabels: Record<string, { en: string; bn: string }> = {
    length: { en: 'Length (লম্বা)', bn: 'লম্বা (Length)' },
    chest: { en: 'Chest / Bust (বুক)', bn: 'বুক (Chest)' },
    waist: { en: 'Waist (কোমর)', bn: 'কোমর (Waist)' },
    shoulder: { en: 'Shoulder (কাাঁধ)', bn: 'কাঁধ (Shoulder)' },
    sleeve: { en: 'Sleeve (হাতা)', bn: 'হাতা (Sleeve)' },
    neck: { en: 'Neck (গলা/কলার)', bn: 'গলা (Neck)' },
    hip: { en: 'Hip (হিপ)', bn: 'হিপ (Hip)' },
    armhole: { en: 'Armhole (বগল)', bn: 'বগল (Armhole)' },
  };

  const step = guideSteps[activeGuideStep];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-[#1E293B]/60 backdrop-blur-xs">
      
      {/* Modal Dialog Sheet */}
      <div className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-[#6A4C6D]/15 text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header with Back & Close */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-[#6A4C6D]/10 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] border border-[#6A4C6D]/15 text-xs font-bold text-[#1E293B] hover:bg-[#1E293B] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#6A4C6D]" />
            <span>{isBn ? 'পিছনে যান' : 'Back'}</span>
          </button>

          <div className="text-center">
            <h3 className="text-base sm:text-lg font-serif italic text-[#1E293B] font-bold">
              {isBn ? 'কাস্টম সাইজ ও ফিটিং' : 'Custom Measurement Guide'}
            </h3>
            <p className="text-[10px] text-[#6A4C6D] font-medium">
              {isBn ? product.titleBn : product.titleEn}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 text-[#1E293B] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Visual "How to Measure" Mini-Slider Banner */}
          <div className="bg-[#FAF9F6] rounded-2xl border border-[#6A4C6D]/15 overflow-hidden shadow-2xs">
            <div className="px-4 py-2.5 bg-[#6A4C6D]/5 border-b border-[#6A4C6D]/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#6A4C6D]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                  {isBn ? 'মাপ নেওয়ার নিয়মাবলী (Visual Guide)' : 'How-to-Measure Visual Guide'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setShowGuide(!showGuide)}
                className="text-[10px] font-bold uppercase tracking-wider text-[#6A4C6D] hover:underline"
              >
                {showGuide ? (isBn ? 'লুকান' : 'Hide Guide') : (isBn ? 'দেখুন' : 'Show Guide')}
              </button>
            </div>

            {showGuide && (
              <div className="p-4 space-y-3">
                {/* Step Selector Chips */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 border-b border-[#6A4C6D]/10 pb-3">
                  {guideSteps.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setActiveGuideStep(idx)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                        activeGuideStep === idx
                          ? 'bg-[#6A4C6D] text-white shadow-xs'
                          : 'bg-white text-[#1E293B]/70 border border-[#6A4C6D]/15 hover:border-[#6A4C6D]'
                      }`}
                    >
                      {s.id}
                    </button>
                  ))}
                </div>

                {/* Infographic Illustration & Instruction Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center bg-white p-3.5 rounded-xl border border-[#6A4C6D]/10">
                  <div className="sm:col-span-1 flex justify-center bg-[#FAF9F6] p-2 rounded-lg border border-[#6A4C6D]/10">
                    {step.svg}
                  </div>

                  <div className="sm:col-span-2 space-y-1.5 text-left">
                    <h5 className="font-serif italic font-bold text-sm text-[#1E293B]">
                      {isBn ? step.titleBn : step.titleEn}
                    </h5>
                    <p className="text-xs text-[#1E293B]/80 font-light leading-relaxed">
                      {isBn ? step.descBn : step.descEn}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex gap-1 text-[10px] text-[#6A4C6D] font-semibold">
                        <span>{activeGuideStep + 1} / {guideSteps.length}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => setActiveGuideStep((prev) => (prev - 1 + guideSteps.length) % guideSteps.length)}
                          className="p-1 rounded bg-[#FAF9F6] text-[#1E293B] hover:bg-[#6A4C6D] hover:text-white transition-colors"
                          title="Previous Tip"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setActiveGuideStep((prev) => (prev + 1) % guideSteps.length)}
                          className="p-1 rounded bg-[#FAF9F6] text-[#1E293B] hover:bg-[#6A4C6D] hover:text-white transition-colors"
                          title="Next Tip"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Size Preset Pills */}
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#6A4C6D]/10 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6A4C6D]">
                  {isBn ? 'স্ট্যান্ডার্ড সাইজ নির্বাচন করুন:' : 'Standard Size Presets:'}
                </span>

                <button
                  type="button"
                  onClick={() => setShowSizeGuide(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#B8860B] hover:text-[#2C2821] bg-[#FAF6EE] hover:bg-[#F3EFE6] px-2.5 py-1 rounded-full border border-[#E0D9CC] transition-all cursor-pointer shadow-2xs"
                >
                  <Ruler className="w-3 h-3 text-[#B8860B]" />
                  <span>{isBn ? 'সাইজ চার্ট' : 'Size Chart'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowVirtualGuide(true)}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-full border border-amber-300 transition-all cursor-pointer shadow-2xs"
                >
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{isBn ? 'ভার্চুয়াল সাইজ গাইড' : 'Virtual Size Guide'}</span>
                </button>
              </div>

              <div className="flex items-center gap-1 text-[10px] font-bold">
                <button
                  type="button"
                  onClick={() => setUnit('inch')}
                  className={`px-2 py-0.5 rounded ${unit === 'inch' ? 'bg-[#1E293B] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Inches (ইঞ্চি)
                </button>
                <button
                  type="button"
                  onClick={() => setUnit('cm')}
                  className={`px-2 py-0.5 rounded ${unit === 'cm' ? 'bg-[#1E293B] text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  CM
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL', 'Custom'].map((sizeKey) => {
                const isActive = selectedPreset === sizeKey;
                return (
                  <button
                    key={sizeKey}
                    type="button"
                    onClick={() => handleSelectPreset(sizeKey)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-[#1E293B] text-white shadow-xs'
                        : 'bg-white text-[#1E293B] border border-[#6A4C6D]/20 hover:border-[#6A4C6D]'
                    }`}
                  >
                    {sizeKey === 'Custom' ? (isBn ? 'কাস্টম সাইজ' : 'Custom') : sizeKey}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Measurements Grid */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Ruler className="w-4 h-4 text-[#6A4C6D]" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                {isBn ? 'শারীরিক পরিমাপ (ইঞ্চি)' : 'Body Measurements (Inches)'}
              </h4>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.keys(fieldLabels).map((field) => (
                <div key={field} className="bg-[#FAF9F6] p-2.5 rounded-xl border border-[#6A4C6D]/10">
                  <label className="text-[10px] font-bold text-[#6A4C6D] uppercase block mb-1">
                    {fieldLabels[field][isBn ? 'bn' : 'en']}
                  </label>
                  <input
                    type="number"
                    name={field}
                    step="0.5"
                    value={measurements[field as keyof typeof measurements]}
                    onChange={handleMeasurementChange}
                    className="w-full bg-white border border-[#6A4C6D]/20 rounded-lg py-1.5 px-2 text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#6A4C6D]"
                    placeholder="0.0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Style Preferences */}
          <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#6A4C6D]/10 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#6A4C6D]">
              {isBn ? 'স্টাইল ও সেলাইয়ের পছন্দ' : 'Style & Tailoring Customizations'}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="text-[10px] font-bold text-[#1E293B]/60 uppercase block mb-1">
                  {t.collarStyle}
                </label>
                <select
                  name="collarStyle"
                  value={customizations.collarStyle}
                  onChange={handleCustomizationChange}
                  className="w-full bg-white border border-[#6A4C6D]/20 rounded-lg py-1.5 px-2 text-xs text-[#1E293B] focus:outline-none"
                >
                  <option value="classic">Classic Collar / ক্লাসিক</option>
                  <option value="mandarin">Mandarin Band / ব্যান্ড কলার</option>
                  <option value="none">No Collar / কলার বিহীন</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1E293B]/60 uppercase block mb-1">
                  {t.pocketStyle}
                </label>
                <select
                  name="pocketStyle"
                  value={customizations.pocketStyle}
                  onChange={handleCustomizationChange}
                  className="w-full bg-white border border-[#6A4C6D]/20 rounded-lg py-1.5 px-2 text-xs text-[#1E293B] focus:outline-none"
                >
                  <option value="none">No Pocket / পকেট নেই</option>
                  <option value="single">Single Chest Pocket / বুক পকেট</option>
                  <option value="double">Double Side Pockets / সাইড পকেট</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#1E293B]/60 uppercase block mb-1">
                  {t.fitPreference}
                </label>
                <select
                  name="fitPreference"
                  value={customizations.fitPreference}
                  onChange={handleCustomizationChange}
                  className="w-full bg-white border border-[#6A4C6D]/20 rounded-lg py-1.5 px-2 text-xs text-[#1E293B] focus:outline-none"
                >
                  <option value="regular">Regular Fit / রেগুলার ফিট</option>
                  <option value="slim">Slim Fit / স্লিম ফিট</option>
                  <option value="loose">Loose / কমফোর্ট ফিট</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#6A4C6D] bg-[#6A4C6D]/5 p-3 rounded-xl text-xs">
            <Info className="w-4 h-4 shrink-0" />
            <span>{isBn ? 'আমাদের মাস্টার দর্জি এই মাপে আপনার পোশাকটি নিখুঁতভাবে তৈরি করবে।' : 'Our master tailors will craft this garment precisely to these specs.'}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-[#6A4C6D]/10 bg-white flex flex-col sm:flex-row gap-3 items-center justify-between shrink-0">
          <div className="flex items-center justify-between w-full sm:w-auto gap-4">
            <div>
              <span className="text-[9px] uppercase font-bold text-[#1E293B]/50 block">Price</span>
              <span className="text-xl font-serif font-bold italic text-[#6A4C6D]">৳{product.price}</span>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-1 rounded font-semibold border border-emerald-200 sm:hidden">
              Free Customization
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleSaveAndAdd}
              className="flex-1 sm:flex-none px-4 py-3 bg-[#FAF9F6] text-[#1E293B] border border-[#6A4C6D]/20 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all"
            >
              {isBn ? 'সেভ করুন ও কার্টে নিন' : 'Save & Add to Cart'}
            </button>

            <button
              onClick={handleDirectCheckout}
              className="flex-1 sm:flex-none px-6 py-3 bg-[#1E293B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6A4C6D] transition-all flex items-center justify-center gap-1.5 shadow-md"
            >
              <Zap className="w-4 h-4 text-[#E8A5B8]" />
              <span>{isBn ? 'সরাসরি অর্ডার করুন' : 'Direct Checkout'}</span>
            </button>
          </div>
        </div>

      </div>

      {/* Size Guide Modal Popup */}
      {showSizeGuide && (
        <SizeGuideModal
          category={product.category}
          subcategory={product.subcategory}
          onClose={() => setShowSizeGuide(false)}
          onSelectSize={(selectedSize) => {
            const cleanSize = selectedSize.split(' ')[0]; // e.g. 'S', 'M', 'L'
            if (standardPresets[cleanSize]) {
              handleSelectPreset(cleanSize);
            }
          }}
        />
      )}

      {/* Virtual Size Guide Modal Popup */}
      {showVirtualGuide && (
        <VirtualSizeGuideModal
          initialCategory={product.category}
          onClose={() => setShowVirtualGuide(false)}
          onApplyProfile={(profile) => {
            setShowVirtualGuide(false);
            if (profile.measurements) {
              setMeasurements(prev => ({ ...prev, ...profile.measurements }));
            }
          }}
        />
      )}
    </div>
  );
}
