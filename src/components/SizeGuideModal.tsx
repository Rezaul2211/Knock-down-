import React, { useState, useEffect } from 'react';
import { X, Ruler, HelpCircle, Check, ArrowRight, Sparkles, Globe2, Calculator, Info } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface SizeGuideModalProps {
  category?: string;
  subcategory?: string;
  onClose: () => void;
  onSelectSize?: (size: string) => void;
}

type Unit = 'in' | 'cm';

// Conversion factor: 1 inch = 2.54 cm
const inToCm = (valInches: number) => Math.round(valInches * 2.54);

interface SizeChartRow {
  size: string;
  usUk: string;
  eu: string;
  chestIn: number;
  shoulderIn: number;
  sleeveIn: number;
  lengthIn: number;
  waistIn: number;
  collarIn: number;
}

const menPanjabiSuitsChart: SizeChartRow[] = [
  { size: 'S (36)', usUk: '36', eu: '46', chestIn: 36, shoulderIn: 16.5, sleeveIn: 23, lengthIn: 38, waistIn: 34, collarIn: 14.5 },
  { size: 'M (38)', usUk: '38', eu: '48', chestIn: 38, shoulderIn: 17.5, sleeveIn: 24, lengthIn: 40, waistIn: 36, collarIn: 15.0 },
  { size: 'L (40)', usUk: '40', eu: '50', chestIn: 40, shoulderIn: 18.5, sleeveIn: 25, lengthIn: 42, waistIn: 38, collarIn: 15.5 },
  { size: 'XL (42)', usUk: '42', eu: '52', chestIn: 42, shoulderIn: 19.5, sleeveIn: 25.5, lengthIn: 44, waistIn: 40, collarIn: 16.0 },
  { size: 'XXL (44)', usUk: '44', eu: '54', chestIn: 44, shoulderIn: 20.5, sleeveIn: 26, lengthIn: 46, waistIn: 42, collarIn: 16.5 },
];

const womenGownsKameezChart: SizeChartRow[] = [
  { size: 'S (34-36)', usUk: '6 / S', eu: '34', chestIn: 35, shoulderIn: 14.5, sleeveIn: 20, lengthIn: 46, waistIn: 30, collarIn: 13.5 },
  { size: 'M (38)', usUk: '8-10 / M', eu: '36-38', chestIn: 38, shoulderIn: 15.0, sleeveIn: 20.5, lengthIn: 48, waistIn: 33, collarIn: 14.0 },
  { size: 'L (40)', usUk: '12 / L', eu: '40', chestIn: 40, shoulderIn: 15.5, sleeveIn: 21, lengthIn: 50, waistIn: 36, collarIn: 14.5 },
  { size: 'XL (42)', usUk: '14 / XL', eu: '42', chestIn: 42, shoulderIn: 16.0, sleeveIn: 21.5, lengthIn: 52, waistIn: 39, collarIn: 15.0 },
  { size: 'XXL (44)', usUk: '16 / XXL', eu: '44', chestIn: 44, shoulderIn: 16.5, sleeveIn: 22, lengthIn: 52, waistIn: 42, collarIn: 15.5 },
];

const kidsChart: SizeChartRow[] = [
  { size: '4-5 Yrs (24)', usUk: '4T', eu: '104', chestIn: 24, shoulderIn: 11.0, sleeveIn: 14, lengthIn: 24, waistIn: 22, collarIn: 11.5 },
  { size: '6-7 Yrs (28)', usUk: '6', eu: '116', chestIn: 28, shoulderIn: 12.0, sleeveIn: 16, lengthIn: 28, waistIn: 24, collarIn: 12.0 },
  { size: '8-9 Yrs (32)', usUk: '8', eu: '128', chestIn: 32, shoulderIn: 13.0, sleeveIn: 18, lengthIn: 32, waistIn: 26, collarIn: 12.5 },
  { size: '10-12 Yrs (34)', usUk: '10-12', eu: '140', chestIn: 34, shoulderIn: 14.0, sleeveIn: 20, lengthIn: 36, waistIn: 28, collarIn: 13.0 },
];

export function SizeGuideModal({ category, subcategory, onClose, onSelectSize }: SizeGuideModalProps) {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  // Determine initial tab based on category
  const getInitialTab = () => {
    const cat = (category || '').toLowerCase();
    if (cat.includes('women') || cat.includes('gown') || cat.includes('kameez')) {
      return 'women';
    } else if (cat.includes('kid') || cat.includes('child')) {
      return 'kids';
    }
    return 'men';
  };

  const [activeTab, setActiveTab] = useState<'men' | 'women' | 'kids'>(getInitialTab());
  const [unit, setUnit] = useState<Unit>('in');
  const [userChestInput, setUserChestInput] = useState<string>('');
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  // Lock background page body scroll when modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const currentChart = activeTab === 'women' 
    ? womenGownsKameezChart 
    : activeTab === 'kids' 
      ? kidsChart 
      : menPanjabiSuitsChart;

  const handleCalculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(userChestInput);
    if (isNaN(val) || val <= 0) {
      setCalculatedSize(null);
      return;
    }

    const chestInches = unit === 'cm' ? val / 2.54 : val;

    let rec = 'Custom Tailored Size';
    if (activeTab === 'men') {
      if (chestInches <= 36.5) rec = 'S (36)';
      else if (chestInches <= 38.5) rec = 'M (38)';
      else if (chestInches <= 40.5) rec = 'L (40)';
      else if (chestInches <= 42.5) rec = 'XL (42)';
      else if (chestInches <= 45.0) rec = 'XXL (44)';
      else rec = 'Custom Bespoke';
    } else if (activeTab === 'women') {
      if (chestInches <= 35.5) rec = 'S (34-36)';
      else if (chestInches <= 38.5) rec = 'M (38)';
      else if (chestInches <= 40.5) rec = 'L (40)';
      else if (chestInches <= 42.5) rec = 'XL (42)';
      else if (chestInches <= 45.0) rec = 'XXL (44)';
      else rec = 'Custom Bespoke';
    } else {
      if (chestInches <= 25) rec = '4-5 Yrs (24)';
      else if (chestInches <= 29) rec = '6-7 Yrs (28)';
      else if (chestInches <= 33) rec = '8-9 Yrs (32)';
      else rec = '10-12 Yrs (34)';
    }

    setCalculatedSize(rec);
  };

  const formatVal = (valInches: number) => {
    if (unit === 'cm') {
      return `${inToCm(valInches)} cm`;
    }
    return `${valInches}"`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      {/* Dark Overlay Backdrop */}
      <div 
        className="fixed inset-0 bg-[#1E293B]/70 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-[#FAF8F5] rounded-2xl sm:rounded-3xl shadow-2xl z-10 overflow-hidden border border-[#DCD5C8] flex flex-col max-h-[88vh] text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-[#FAF8F5] border-b border-[#E0D9CC] px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#B8860B]/10 border border-[#B8860B]/30 flex items-center justify-center text-[#B8860B]">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-[#2C2821] flex items-center gap-2">
                <span>{isBn ? 'সাইজ ও মেজারমেন্ট গাইড' : 'International Size & Measurement Guide'}</span>
              </h3>
              <p className="text-[11px] sm:text-xs text-[#70685B]">
                {isBn 
                  ? 'সঠিক ফিটিং নিশ্চিত করতে আন্তর্জাতিক কনভার্সন চার্ট ও গাইড দেখুন' 
                  : 'Detailed measurement charts across US, UK, EU & BD sizing to avoid sizing errors'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-[#EFECE6] text-[#2C2821] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Top Controls: Category Tabs & Unit Switcher */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-[#E0D9CC] shadow-2xs">
            
            {/* Category Selector Tabs */}
            <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE4D8] overflow-x-auto">
              <button
                onClick={() => { setActiveTab('men'); setCalculatedSize(null); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'men'
                    ? 'bg-[#2B2823] text-white shadow-xs'
                    : 'text-[#70685B] hover:text-[#2C2821]'
                }`}
              >
                {isBn ? 'পুরুষের পাঞ্জাবি ও সুট' : 'Men (Panjabi & Suits)'}
              </button>

              <button
                onClick={() => { setActiveTab('women'); setCalculatedSize(null); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'women'
                    ? 'bg-[#2B2823] text-white shadow-xs'
                    : 'text-[#70685B] hover:text-[#2C2821]'
                }`}
              >
                {isBn ? 'নারীদের গাউন ও কামিজ' : 'Women (Gowns & Kameez)'}
              </button>

              <button
                onClick={() => { setActiveTab('kids'); setCalculatedSize(null); }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all whitespace-nowrap ${
                  activeTab === 'kids'
                    ? 'bg-[#2B2823] text-white shadow-xs'
                    : 'text-[#70685B] hover:text-[#2C2821]'
                }`}
              >
                {isBn ? 'বাচ্চাদের পোশাক' : 'Kids Collection'}
              </button>
            </div>

            {/* Inches / Centimeters Toggle */}
            <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-[#70685B] flex items-center gap-1">
                <Globe2 className="w-3.5 h-3.5 text-[#B8860B]" />
                {isBn ? 'একক (Unit):' : 'Unit:'}
              </span>
              <div className="flex bg-[#FAF8F5] p-1 rounded-xl border border-[#EAE4D8] text-xs font-bold">
                <button
                  onClick={() => setUnit('in')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    unit === 'in' ? 'bg-[#B8860B] text-white shadow-2xs' : 'text-[#70685B] hover:text-[#2C2821]'
                  }`}
                >
                  Inches (in)
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    unit === 'cm' ? 'bg-[#B8860B] text-white shadow-2xs' : 'text-[#70685B] hover:text-[#2C2821]'
                  }`}
                >
                  CM (cm)
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Size Calculator / Finder Widget */}
          <div className="bg-gradient-to-r from-[#FAF6EE] to-[#F3EFE6] p-4 sm:p-5 rounded-2xl border border-[#E0D9CC] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#B8860B]" />
                <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2C2821]">
                  {isBn ? 'তাত্ক্ষণিক সাইজ ফাইন্ডার (Smart Size Recommender)' : 'Smart Size Finder'}
                </h4>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-[#B8860B]/10 text-[#B8860B] rounded-full">
                {isBn ? 'জিরো সাইজিং ভুল' : 'Zero Sizing Error'}
              </span>
            </div>

            <form onSubmit={handleCalculateSize} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="flex-1 relative">
                <input
                  type="number"
                  step="0.5"
                  value={userChestInput}
                  onChange={(e) => setUserChestInput(e.target.value)}
                  placeholder={
                    isBn 
                      ? `বুকের মাপ লিখুন (${unit === 'in' ? 'ইঞ্চি' : 'সেমি'}) e.g. ${unit === 'in' ? '38' : '96'}`
                      : `Enter Chest Measurement (${unit === 'in' ? 'inches' : 'cm'}) e.g. ${unit === 'in' ? '38' : '96'}`
                  }
                  className="w-full bg-white border border-[#DCD5C8] rounded-xl px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]/30"
                />
              </div>
              <button
                type="submit"
                className="bg-[#2B2823] hover:bg-[#B8860B] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors shrink-0 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isBn ? 'সাইজ নির্ধারণ করুন' : 'Recommend Size'}</span>
              </button>
            </form>

            {calculatedSize && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900 animate-in fade-in duration-200">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>
                    {isBn ? 'আপনার জন্য প্রস্তাবিত উপযুক্ত সাইজ:' : 'Your Recommended Tailored Size:'}{' '}
                    <strong className="text-sm font-bold text-emerald-950">{calculatedSize}</strong>
                  </span>
                </div>
                {onSelectSize && (
                  <button
                    onClick={() => {
                      onSelectSize(calculatedSize);
                      onClose();
                    }}
                    className="text-[11px] font-bold underline text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                  >
                    <span>{isBn ? 'এই সাইজটি নির্বাচন করুন' : 'Apply Size'}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Regional Size & Conversion Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-serif font-bold text-[#2C2821] flex items-center gap-2">
                <span>{isBn ? 'পরিমাপ ও আঞ্চলিক সাইজ চার্ট' : 'Measurement & Regional Conversion Chart'}</span>
              </h4>
              <span className="text-[11px] text-[#70685B]">
                {isBn ? `প্রদর্শিত একক: ${unit === 'in' ? 'ইঞ্চি' : 'সেন্টিমিটার'}` : `Display Unit: ${unit === 'in' ? 'Inches' : 'Centimeters'}`}
              </span>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-[#E0D9CC] bg-white shadow-2xs">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#E0D9CC] text-[#70685B] font-bold text-[10px] uppercase tracking-wider">
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'সাইজ (BD/IN)' : 'Size Tag'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'ইউএস / ইউকে' : 'US / UK'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'ইউরোপ (EU)' : 'EU'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap bg-[#B8860B]/5 text-[#2C2821]">{isBn ? 'বুক (Chest)' : 'Chest'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'কাঁধ (Shoulder)' : 'Shoulder'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'হাতা (Sleeve)' : 'Sleeve'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'দৈর্ঘ্য (Length)' : 'Length'}</th>
                    <th className="p-3 sm:p-3.5 whitespace-nowrap">{isBn ? 'কোমর (Waist)' : 'Waist'}</th>
                    {onSelectSize && <th className="p-3 sm:p-3.5 text-center">{isBn ? 'অ্যাকশন' : 'Action'}</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE4D8] text-[#2C2821]">
                  {currentChart.map((row, idx) => (
                    <tr key={idx} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3 sm:p-3.5 font-bold text-slate-900 whitespace-nowrap">
                        {row.size}
                      </td>
                      <td className="p-3 sm:p-3.5 font-semibold text-[#555046] whitespace-nowrap">
                        {row.usUk}
                      </td>
                      <td className="p-3 sm:p-3.5 text-[#70685B] whitespace-nowrap">
                        {row.eu}
                      </td>
                      <td className="p-3 sm:p-3.5 font-bold text-[#B8860B] bg-[#B8860B]/5 whitespace-nowrap">
                        {formatVal(row.chestIn)}
                      </td>
                      <td className="p-3 sm:p-3.5 font-medium whitespace-nowrap">
                        {formatVal(row.shoulderIn)}
                      </td>
                      <td className="p-3 sm:p-3.5 font-medium whitespace-nowrap">
                        {formatVal(row.sleeveIn)}
                      </td>
                      <td className="p-3 sm:p-3.5 font-medium whitespace-nowrap">
                        {formatVal(row.lengthIn)}
                      </td>
                      <td className="p-3 sm:p-3.5 font-medium whitespace-nowrap">
                        {formatVal(row.waistIn)}
                      </td>
                      {onSelectSize && (
                        <td className="p-3 sm:p-3.5 text-center">
                          <button
                            onClick={() => {
                              onSelectSize(row.size);
                              onClose();
                            }}
                            className="px-2.5 py-1 bg-[#2B2823] hover:bg-[#B8860B] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors"
                          >
                            {isBn ? 'বাছাই করুন' : 'Select'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* How to Measure Instructions Box */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E0D9CC] space-y-3">
            <div className="flex items-center gap-2 text-[#2C2821]">
              <HelpCircle className="w-4 h-4 text-[#B8860B]" />
              <h4 className="text-xs sm:text-sm font-serif font-bold">
                {isBn ? 'সঠিক মাপ নেওয়ার নির্দেশিকা (How to Measure)' : 'How to Measure Yourself Accurately'}
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#B8860B] tracking-wider block">
                  1. Chest / Bust
                </span>
                <p className="text-[#555046] text-[11px] leading-relaxed">
                  {isBn
                    ? 'বগল থেকে ফিতা দিয়ে বুকের সবচেয়ে উঁচু অংশের চারপাশে সমান্তরালভাবে মেপে নিন।'
                    : 'Wrap measuring tape comfortably under arms around fullest part of chest.'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#B8860B] tracking-wider block">
                  2. Shoulder
                </span>
                <p className="text-[#555046] text-[11px] leading-relaxed">
                  {isBn
                    ? 'পিঠের দিক থেকে এক কাঁধের হাড়ের শেষ সীমানা থেকে অপর কাঁধ পর্যন্ত মেপুন।'
                    : 'Measure across the back from shoulder bone tip to opposite shoulder bone.'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#B8860B] tracking-wider block">
                  3. Sleeve
                </span>
                <p className="text-[#555046] text-[11px] leading-relaxed">
                  {isBn
                    ? 'কাঁধের জোড়া থেকে শুরু করে হাতের কবজি পর্যন্ত বাইরের দিক দিয়ে মেপে নিন।'
                    : 'Measure from shoulder seam down along outer arm to wrist bone.'}
                </p>
              </div>

              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EAE4D8] space-y-1">
                <span className="text-[10px] font-bold uppercase text-[#B8860B] tracking-wider block">
                  4. Length
                </span>
                <p className="text-[#555046] text-[11px] leading-relaxed">
                  {isBn
                    ? 'গলার পাশে কাঁধের সর্বোচ্চ বিন্দু থেকে পোশাকের শেষ সীমানা পর্যন্ত মেপুন।'
                    : 'Measure vertically from highest shoulder point down to desired hemline.'}
                </p>
              </div>
            </div>
          </div>

          {/* Bespoke / Custom Tailoring Advice Banner */}
          <div className="p-4 bg-[#2B2823] text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5 text-center sm:text-left">
              <span className="text-[#E5C158] font-serif font-bold text-sm block">
                {isBn ? 'আপনার বডির নিখুঁত কাস্টম ফিটিং প্রয়োজন?' : 'Need 100% Bespoke Custom Tailored Fit?'}
              </span>
              <p className="text-[#DCD5C8] text-[11px]">
                {isBn
                  ? 'আমাদের রয়েছে কাস্টম মেজারমেন্ট সার্ভিস। বুক করার পর কারিগর সরাসরি যোগাযোগ করবে।'
                  : 'We offer free tailor consultation and custom sleeve, shoulder & length adjustments.'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-[#B8860B] hover:bg-[#a07409] text-white px-4 py-2 rounded-xl font-bold uppercase tracking-wider text-[10px] transition-colors shrink-0 whitespace-nowrap"
            >
              {isBn ? 'বুঝেছি' : 'Got it'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
