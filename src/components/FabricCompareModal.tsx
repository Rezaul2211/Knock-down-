import React, { useState, useEffect } from 'react';
import { 
  X, Scale, ArrowLeftRight, Check, Sparkles, Feather, MapPin, 
  ShieldCheck, AlertCircle, Info, ExternalLink, Scissors, HelpCircle, Flame, Droplets, Zap
} from 'lucide-react';
import { fabricSwatches } from '../data/fabrics';
import { FabricSwatch } from '../types';
import { useAppContext } from '../store/AppContext';

interface FabricCompareModalProps {
  initialFabricA?: FabricSwatch;
  initialFabricB?: FabricSwatch;
  onClose: () => void;
  onSelectFabric?: (fabric: FabricSwatch) => void;
}

export function FabricCompareModal({ 
  initialFabricA, 
  initialFabricB, 
  onClose,
  onSelectFabric 
}: FabricCompareModalProps) {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  // Default to Egyptian Giza Cotton and Italian Super 150s Wool if none provided
  const [fabricA, setFabricA] = useState<FabricSwatch>(
    initialFabricA || fabricSwatches[0]
  );
  const [fabricB, setFabricB] = useState<FabricSwatch>(
    initialFabricB || (fabricSwatches[1] ? fabricSwatches[1] : fabricSwatches[0])
  );

  // Lock background scroll
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleSwap = () => {
    const temp = fabricA;
    setFabricA(fabricB);
    setFabricB(temp);
  };

  // Helper function to render comparison row with highlight
  const renderSpecRow = (
    labelEn: string,
    labelBn: string,
    valA: React.ReactNode,
    valB: React.ReactNode,
    highlightWinner?: 'A' | 'B' | 'none'
  ) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2 py-3 px-4 border-b border-slate-100 hover:bg-slate-50/80 transition-colors text-xs items-center">
        {/* Label Column */}
        <div className="md:col-span-4 font-semibold text-slate-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
          <span>{isBn ? labelBn : labelEn}</span>
        </div>

        {/* Fabric A Column */}
        <div className={`md:col-span-4 p-2 rounded-xl transition-all ${
          highlightWinner === 'A' 
            ? 'bg-amber-50/90 border border-amber-300 font-bold text-amber-950 shadow-2xs' 
            : 'text-slate-800 font-medium'
        }`}>
          {valA}
        </div>

        {/* Fabric B Column */}
        <div className={`md:col-span-4 p-2 rounded-xl transition-all ${
          highlightWinner === 'B' 
            ? 'bg-amber-50/90 border border-amber-300 font-bold text-amber-950 shadow-2xs' 
            : 'text-slate-800 font-medium'
        }`}>
          {valB}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-slate-950/80 backdrop-blur-xs font-sans">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-slate-200 text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>{isBn ? 'ফেব্রিক তুলনামূলক স্পেসিফিকেশন' : 'Side-by-Side Fabric Specification Comparison'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-sans border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                  Technical Spec
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                {isBn ? 'দুটি ভিন্ন ফেব্রিকের বুনন, থ্রেড কাউন্ট, জিএসএম এবং ফিটিং বৈশিষ্ট্য তুলনা করে সঠিক কাপড় নির্বাচন করুন' : 'Compare weave pattern, GSM weight, thread count, and origin to make an informed tailoring decision'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwap}
              className="py-1.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title={isBn ? 'পজিশন অদলবদল করুন' : 'Swap Side A and B'}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isBn ? 'অদলবদল' : 'Swap Sides'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto bg-[#FAF9F6] p-4 sm:p-6 space-y-6">
          
          {/* Top Selector Grid: Fabric A vs Fabric B */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            
            {/* FABRIC A SELECTOR & CARD */}
            <div className="bg-white p-4 rounded-2xl border-2 border-amber-500/40 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase px-3 py-1 rounded-br-xl tracking-wider">
                Fabric A
              </div>

              <div className="pt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {isBn ? 'ফেব্রিক A নির্বাচন করুন:' : 'Select Fabric A:'}
                </label>
                <select
                  value={fabricA.id}
                  onChange={(e) => {
                    const found = fabricSwatches.find(f => f.id === e.target.value);
                    if (found) setFabricA(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-xs text-slate-900 outline-none focus:border-amber-600"
                >
                  {fabricSwatches.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.code} - {isBn ? f.nameBn : f.nameEn} (৳{f.pricePerYard}/yard)
                    </option>
                  ))}
                </select>
              </div>

              {/* Swatch Image Preview */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={fabricA.highResImage} 
                  alt={fabricA.nameEn} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {fabricA.code}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {isBn ? fabricA.nameBn : fabricA.nameEn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {isBn ? fabricA.descriptionBn : fabricA.descriptionEn}
                </p>
              </div>

              {onSelectFabric && (
                <button
                  onClick={() => onSelectFabric(fabricA)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ফেব্রিক A সেলেক্ট করুন' : 'Select Fabric A for Tailoring'}</span>
                </button>
              )}
            </div>

            {/* FABRIC B SELECTOR & CARD */}
            <div className="bg-white p-4 rounded-2xl border-2 border-slate-800/20 shadow-sm space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 bg-slate-800 text-white font-extrabold text-[10px] uppercase px-3 py-1 rounded-br-xl tracking-wider">
                Fabric B
              </div>

              <div className="pt-4">
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  {isBn ? 'ফেব্রিক B নির্বাচন করুন:' : 'Select Fabric B:'}
                </label>
                <select
                  value={fabricB.id}
                  onChange={(e) => {
                    const found = fabricSwatches.find(f => f.id === e.target.value);
                    if (found) setFabricB(found);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-xs text-slate-900 outline-none focus:border-amber-600"
                >
                  {fabricSwatches.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.code} - {isBn ? f.nameBn : f.nameEn} (৳{f.pricePerYard}/yard)
                    </option>
                  ))}
                </select>
              </div>

              {/* Swatch Image Preview */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                <img 
                  src={fabricB.highResImage} 
                  alt={fabricB.nameEn} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {fabricB.code}
                </div>
              </div>

              <div className="space-y-1">
                <h3 className="font-serif font-bold text-base text-slate-900">
                  {isBn ? fabricB.nameBn : fabricB.nameEn}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {isBn ? fabricB.descriptionBn : fabricB.descriptionEn}
                </p>
              </div>

              {onSelectFabric && (
                <button
                  onClick={() => onSelectFabric(fabricB)}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Scissors className="w-3.5 h-3.5" />
                  <span>{isBn ? 'ফেব্রিক B সেলেক্ট করুন' : 'Select Fabric B for Tailoring'}</span>
                </button>
              )}
            </div>

          </div>

          {/* Detailed Technical Specification Comparison Matrix */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
            <div className="bg-slate-900 text-white p-3 sm:p-4 flex items-center justify-between border-b border-slate-800">
              <span className="text-xs font-serif font-bold uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>{isBn ? 'প্রযুক্তিগত স্পেসিফিকেশন ও গুণমান তুলনা' : 'Detailed Technical Specification Matrix'}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {isBn ? 'হাইলাইট করা অংশ তুলনামূলক সুবিধাজনক' : 'Highlighted rows indicate superior features'}
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              
              {/* 1. Category & Type */}
              {renderSpecRow(
                'Category', 'ক্যাটাগরি',
                <span className="uppercase tracking-wider text-slate-900 font-bold">{fabricA.category}</span>,
                <span className="uppercase tracking-wider text-slate-900 font-bold">{fabricB.category}</span>
              )}

              {/* 2. Weave Pattern */}
              {renderSpecRow(
                'Weave Structure', 'বুনন কাঠামো',
                <span>{fabricA.weavePattern}</span>,
                <span>{fabricB.weavePattern}</span>
              )}

              {/* 3. Origin & Mill */}
              {renderSpecRow(
                'Origin & Mill', 'উৎস ও মিল',
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-600 shrink-0" /> {fabricA.origin}</span>,
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-amber-600 shrink-0" /> {fabricB.origin}</span>
              )}

              {/* 4. Fabric Weight (GSM) */}
              {renderSpecRow(
                'Fabric Weight (GSM)', 'কাপড়ের ওজন (GSM)',
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span>{fabricA.weightGsm} GSM</span>
                    <span className="text-slate-400">{fabricA.weightGsm > 250 ? 'Heavy' : fabricA.weightGsm > 170 ? 'Medium' : 'Light'}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-amber-600 h-full rounded-full" style={{ width: `${Math.min(100, (fabricA.weightGsm / 400) * 100)}%` }} />
                  </div>
                </div>,
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span>{fabricB.weightGsm} GSM</span>
                    <span className="text-slate-400">{fabricB.weightGsm > 250 ? 'Heavy' : fabricB.weightGsm > 170 ? 'Medium' : 'Light'}</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-slate-700 h-full rounded-full" style={{ width: `${Math.min(100, (fabricB.weightGsm / 400) * 100)}%` }} />
                  </div>
                </div>,
                fabricA.weightGsm !== fabricB.weightGsm ? (fabricA.weightGsm > fabricB.weightGsm ? 'A' : 'B') : 'none'
              )}

              {/* 5. Thread Count & Quality */}
              {renderSpecRow(
                'Thread Count & Fiber', 'থ্রেড কাউন্ট ও ফাইবার',
                <span>{fabricA.threadCount}</span>,
                <span>{fabricB.threadCount}</span>,
                fabricA.threadCount.includes('Super') || fabricA.threadCount.includes('200s') ? 'A' : 'none'
              )}

              {/* 6. Sheen & Luster */}
              {renderSpecRow(
                'Sheen & Luster', 'উজ্জ্বলতা ও চকচকে ভাব',
                <span className="capitalize">{fabricA.sheen.replace('-', ' ')}</span>,
                <span className="capitalize">{fabricB.sheen.replace('-', ' ')}</span>
              )}

              {/* 7. Breathability & Comfort */}
              {renderSpecRow(
                'Breathability & Climate', 'বাতাস চলাচল ও আবহাওয়া',
                <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {fabricA.breathability}</span>,
                <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5 text-blue-500" /> {fabricB.breathability}</span>,
                fabricA.breathability.includes('Ultra') ? 'A' : fabricB.breathability.includes('Ultra') ? 'B' : 'none'
              )}

              {/* 8. Price Per Yard */}
              {renderSpecRow(
                'Price Per Yard', 'প্রতি গজ মূল্য',
                <span className="text-sm font-serif font-bold text-slate-900">৳{fabricA.pricePerYard}</span>,
                <span className="text-sm font-serif font-bold text-slate-900">৳{fabricB.pricePerYard}</span>,
                fabricA.pricePerYard < fabricB.pricePerYard ? 'A' : fabricB.pricePerYard < fabricA.pricePerYard ? 'B' : 'none'
              )}

              {/* 9. Tailoring Surcharge */}
              {renderSpecRow(
                'Tailoring Surcharge', 'টেলরিং সারচার্জ',
                <span>{fabricA.surcharge > 0 ? `+৳${fabricA.surcharge}` : '৳0 (Included)'}</span>,
                <span>{fabricB.surcharge > 0 ? `+৳${fabricB.surcharge}` : '৳0 (Included)'}</span>
              )}

              {/* 10. Suitable Outfits */}
              {renderSpecRow(
                'Suitable Outfits', 'উপযোগী পোশাক',
                <div className="flex flex-wrap gap-1">
                  {fabricA.suitableFor.map(item => (
                    <span key={item} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md uppercase font-semibold">
                      {item}
                    </span>
                  ))}
                </div>,
                <div className="flex flex-wrap gap-1">
                  {fabricB.suitableFor.map(item => (
                    <span key={item} className="bg-slate-100 text-slate-700 text-[10px] px-2 py-0.5 rounded-md uppercase font-semibold">
                      {item}
                    </span>
                  ))}
                </div>
              )}

              {/* 11. Care Instructions */}
              {renderSpecRow(
                'Care & Wash Method', 'যত্ন ও ধোয়ার নিয়ম',
                <span className="text-[11px] text-slate-600">{isBn ? fabricA.careInstructionsBn : fabricA.careInstructionsEn}</span>,
                <span className="text-[11px] text-slate-600">{isBn ? fabricB.careInstructionsBn : fabricB.careInstructionsEn}</span>
              )}

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isBn ? '১০০% প্রমাণীকৃত প্রিমিয়াম মাস্টার ফেব্রিক সুতা garantee' : '100% Certified Authentic Master Mill Textiles'}</span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition-all cursor-pointer"
          >
            {isBn ? 'বন্ধ করুন' : 'Close Comparison'}
          </button>
        </div>

      </div>
    </div>
  );
}
