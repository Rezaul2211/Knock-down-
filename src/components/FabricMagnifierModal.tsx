import React, { useState } from 'react';
import { FabricSwatch } from '../types';
import { X, Check, Sparkles, ShieldCheck, MapPin, Feather, Droplets, Info, ExternalLink, Scissors, ShoppingBag, Eye } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface FabricMagnifierModalProps {
  fabric: FabricSwatch;
  onClose: () => void;
  onApplyFabric?: (fabric: FabricSwatch) => void;
  onCompareWith?: (fabric: FabricSwatch) => void;
}

export function FabricMagnifierModal({
  fabric,
  onClose,
  onApplyFabric,
  onCompareWith
}: FabricMagnifierModalProps) {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeTab, setActiveTab] = useState<'specs' | 'care' | 'drape'>('specs');
  const [swatchOrdered, setSwatchOrdered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setMousePos({ x, y });
  };

  const handleOrderFreeSwatch = () => {
    setSwatchOrdered(true);
    setTimeout(() => setSwatchOrdered(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto font-sans animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col md:flex-row my-auto">
        
        {/* Close Modal Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-slate-900/80 hover:bg-slate-900 text-white p-2.5 rounded-full transition-all cursor-pointer shadow-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Half: High-Res Interactive Fabric Loupe View */}
        <div className="w-full md:w-1/2 bg-slate-900 relative p-6 flex flex-col justify-between min-h-[360px] sm:min-h-[480px]">
          
          {/* High-res Image container with Loupe Magnifier */}
          <div
            className="relative w-full flex-1 rounded-2xl overflow-hidden cursor-crosshair border border-white/10 group shadow-inner"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={fabric.highResImage}
              alt={fabric.nameEn}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300"
            />

            {/* Magnifier Lens Loupe */}
            {isHovering && (
              <div
                className="absolute w-44 h-44 rounded-full border-2 border-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.5)] pointer-events-none overflow-hidden z-20"
                style={{
                  top: `${mousePos.y}%`,
                  left: `${mousePos.x}%`,
                  transform: 'translate(-50%, -50%)',
                  backgroundImage: `url(${fabric.highResImage})`,
                  backgroundPosition: `${mousePos.x}% ${mousePos.y}%`,
                  backgroundSize: '400%'
                }}
              />
            )}

            {/* Instruction Badge */}
            <div className="absolute top-3 left-3 bg-slate-900/85 backdrop-blur-md text-amber-300 text-[11px] font-bold px-3 py-1.5 rounded-full border border-amber-500/20 flex items-center gap-1.5 shadow-md">
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span>{isHovering ? (isBn ? '৪x জুম সক্রিয়' : '4x Micro-Weave Zoom Active') : (isBn ? 'ছবিতে মাউস রেখে জুম দেখুন' : 'Hover to Inspect Micro-Weave')}</span>
            </div>
          </div>

          {/* Color & Origin Footer Tag */}
          <div className="mt-4 flex items-center justify-between text-white text-xs pt-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full border border-white/30" style={{ backgroundColor: fabric.primaryColor }} />
              <span className="font-bold">{fabric.code}</span>
            </div>
            <div className="flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{fabric.origin}</span>
            </div>
          </div>
        </div>

        {/* Right Half: High-Spec Details & Action Buttons */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-between bg-white">
          <div className="space-y-5">
            
            {/* Header: Fabric Name & Category */}
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {fabric.category}
                </span>
                <span className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2.5 py-0.5 rounded-full uppercase">
                  {fabric.weavePattern}
                </span>
              </div>
              <h2 className="text-2xl font-serif font-bold text-slate-900 leading-snug">
                {isBn ? fabric.nameBn : fabric.nameEn}
              </h2>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn ? fabric.descriptionBn : fabric.descriptionEn}
            </p>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200">
              <button
                onClick={() => setActiveTab('specs')}
                className={`py-2 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'specs'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {isBn ? 'স্পেসিফিকেশন' : 'Specifications'}
              </button>
              <button
                onClick={() => setActiveTab('drape')}
                className={`py-2 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'drape'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {isBn ? 'ঝুল ও ফিট' : 'Drape & Feel'}
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`py-2 px-3 text-xs font-bold transition-all border-b-2 ${
                  activeTab === 'care'
                    ? 'border-amber-600 text-amber-700'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                {isBn ? 'যত্ন ও ধোয়া' : 'Care Guide'}
              </button>
            </div>

            {/* Tab Contents */}
            <div className="text-xs space-y-3 min-h-[140px]">
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{isBn ? 'ওজন (Weight):' : 'Fabric Weight:'}</span>
                    <span className="font-bold text-slate-800">{fabric.weightGsm} GSM</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{isBn ? 'থ্রেড কাউন্ট:' : 'Thread Count:'}</span>
                    <span className="font-bold text-slate-800">{fabric.threadCount}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{isBn ? 'উৎস (Origin):' : 'Authentic Origin:'}</span>
                    <span className="font-bold text-slate-800">{fabric.origin}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">{isBn ? 'উজ্জ্বলতা (Sheen):' : 'Surface Sheen:'}</span>
                    <span className="font-bold text-amber-700 uppercase">{fabric.sheen}</span>
                  </div>
                </div>
              )}

              {activeTab === 'drape' && (
                <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-100/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{isBn ? 'বায়ুচলাচল (Breathability):' : 'Breathability:'}</span>
                    <span className="font-bold text-amber-800">{fabric.breathability}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-700">{isBn ? 'উপযোগী পোশাক:' : 'Ideal Garments:'}</span>
                    <span className="font-bold text-slate-900 uppercase text-[10px]">
                      {fabric.suitableFor.join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {activeTab === 'care' && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-slate-700">
                  <div className="flex items-start gap-2">
                    <Droplets className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                    <p>{isBn ? fabric.careInstructionsBn : fabric.careInstructionsEn}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Price & Surcharge Summary */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {isBn ? 'মূল্য প্রতি গজ' : 'Price / Yard'}
                </span>
                <span className="text-xl font-serif font-bold text-slate-900">
                  ৳{fabric.pricePerYard}
                </span>
              </div>
              {fabric.surcharge > 0 && (
                <div className="text-right">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">
                    {isBn ? 'লাক্সারি কাস্টম চার্জ' : 'Custom Surcharge'}
                  </span>
                  <span className="text-sm font-bold text-amber-700">
                    +৳{fabric.surcharge}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2.5 pt-6 mt-4 border-t border-slate-100">
            {onApplyFabric && (
              <button
                onClick={() => {
                  onApplyFabric(fabric);
                  onClose();
                }}
                className="w-full py-3.5 px-4 bg-slate-900 hover:bg-amber-700 text-white rounded-xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <Scissors className="w-4 h-4" />
                <span>{isBn ? 'এই ফেব্রিক দিয়ে পোশাক তৈরি করুন' : 'Custom Tailor with this Fabric'}</span>
              </button>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handleOrderFreeSwatch}
                className={`py-2.5 px-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 border ${
                  swatchOrdered
                    ? 'bg-emerald-600 text-white border-emerald-600'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {swatchOrdered ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>{isBn ? 'সোয়াচ রিকোয়েস্ট পাঠিয়েছে' : 'Swatch Requested'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-600" />
                    <span>{isBn ? 'ফ্রি সোয়াচ পান' : 'Order Free Swatch'}</span>
                  </>
                )}
              </button>

              {onCompareWith && (
                <button
                  onClick={() => {
                    onCompareWith(fabric);
                    onClose();
                  }}
                  className="py-2.5 px-3 bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isBn ? 'তুলনা করুন' : 'Compare Fabric'}</span>
                </button>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
