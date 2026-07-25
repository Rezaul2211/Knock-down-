import React, { useState } from 'react';
import { 
  Ruler, Scissors, Sparkles, ShieldCheck, Package, Check, 
  Clock, Info, ChevronRight, UserCheck, AlertCircle, Award, 
  CheckCircle2, Flame, RefreshCw, FileText
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export type TailoringStageId = 'measurement' | 'cutting' | 'tailoring' | 'inspection' | 'dispatched';

export interface TailoringStep {
  id: TailoringStageId;
  stepNumber: number;
  titleEn: string;
  titleBn: string;
  subtitleEn: string;
  subtitleBn: string;
  estDaysEn: string;
  estDaysBn: string;
  icon: React.ElementType;
  artisanNoteEn: string;
  artisanNoteBn: string;
  checklistEn: string[];
  checklistBn: string[];
}

export const TAILORING_STEPS: TailoringStep[] = [
  {
    id: 'measurement',
    stepNumber: 1,
    titleEn: 'Measurement & Specs',
    titleBn: '১. মাপ ও স্পেসিফিকেশন',
    subtitleEn: 'Profile & Fabric Lock',
    subtitleBn: 'প্রোফাইল ও কাপড়ের সাইজ লক',
    estDaysEn: 'Day 1',
    estDaysBn: '১ম দিন',
    icon: Ruler,
    artisanNoteEn: 'Master tailor verifies neck, chest, waist & shoulder proportions against fabric elasticity.',
    artisanNoteBn: 'মাস্টার কারিগর কাপড়ের নমনীয়তা এবং আপনার বডি প্রোপোর্শন মিলিয়ে মেজারমেন্ট সাইজ ভেরিফাই করেছেন।',
    checklistEn: [
      'Body profile measurements confirmed',
      'Collar style & pocket preference mapped',
      'Fabric swatch grain & direction marked'
    ],
    checklistBn: [
      'শরীরের মাপের প্রোফাইল ভেরিফাইড',
      'কলার ও পকেটের কাস্টম স্টাইল লক',
      'ফেব্রিক প্যাটার্ন এবং দিক চিহ্নিত করা হয়েছে'
    ]
  },
  {
    id: 'cutting',
    stepNumber: 2,
    titleEn: 'Master Cutting',
    titleBn: '২. মাস্টার কাটিং ও প্যাটার্ন',
    subtitleEn: 'Pattern Drafting',
    subtitleBn: 'প্যাটার্ন ড্রাফটিং ও মাস্টার কাট',
    estDaysEn: 'Day 2-3',
    estDaysBn: '২-৩ দিন',
    icon: Scissors,
    artisanNoteEn: 'Individual canvas pattern drawn by hand and laser-cut along natural fabric weave lines.',
    artisanNoteBn: 'সুনির্দিষ্ট বডি শেপ অনুযায়ী ক্যানভাস প্যাটার্ন আঁকা ও লেজার কাটিং সম্পন্ন হচ্ছে।',
    checklistEn: [
      'Custom paper master pattern created',
      'Hand-chalking alignment on fabric',
      'Precision laser edge cutting'
    ],
    checklistBn: [
      'এক্লুসিভ পেপার মাস্টার প্যাটার্ন তৈরি',
      'কাপড়ে চক দিয়ে নিখুঁত মার্কিং',
      'লেজার প্রিসিশন কাটিং'
    ]
  },
  {
    id: 'tailoring',
    stepNumber: 3,
    titleEn: 'Handcrafted Tailoring',
    titleBn: '৩. হ্যান্ডক্রাফটেড সেলাই',
    subtitleEn: 'Artisanal Stitching',
    subtitleBn: 'সূক্ষ্ম সেলাই ও ইন্টারলাইনিং',
    estDaysEn: 'Day 4-6',
    estDaysBn: '৪-৬ দিন',
    icon: Sparkles,
    artisanNoteEn: 'Skilled artisans perform double-reinforced seam stitching, horsehair canvas padding, and sleeve setting.',
    artisanNoteBn: 'অভিজ্ঞ কারিগররা ডাবল-রিইনফোর্সড সেলাই, ইনার ক্যানভাস প্যাডিং এবং হাতা সংযোজন করছেন।',
    checklistEn: [
      'Inner canvas lining & lapel construction',
      'Double-stitch seam reinforcement',
      'Buttonhole hand embroidery & cuffing'
    ],
    checklistBn: [
      'ইনার লাইনিং ও কলার স্ট্রাকচার সেলাই',
      'ডাবল-স্টিচ জোড়া মজবুতকরণ',
      'বোতামের ঘর ও কাফ ফিনিশিং'
    ]
  },
  {
    id: 'inspection',
    stepNumber: 4,
    titleEn: 'Final Quality Check',
    titleBn: '৪. ফাইনাল ইন্সপেকশন',
    subtitleEn: 'Steam & 12-Point Audit',
    subtitleBn: 'স্টিম প্রেস ও গুণমান পরীক্ষা',
    estDaysEn: 'Day 7',
    estDaysBn: '৭ম দিন',
    icon: ShieldCheck,
    artisanNoteEn: 'High-pressure steam ironing, tolerance audit within ±0.15 inches, and zero-defect quality certificate.',
    artisanNoteBn: 'হাই-প্রেসার স্টিম আইরনিং, ±০.১৫ ইঞ্চি নিখুঁত মাপ পরীক্ষা এবং কোয়ালিটি সার্টিফিকেট প্রদান।',
    checklistEn: [
      '12-Point measurement tolerance audit',
      'Heavy steam press & shape molding',
      'Loose thread clearing & fabric polish'
    ],
    checklistBn: [
      '১২-পয়েন্ট মাপের নিখুঁত মান নিয়ন্ত্রণ পরীক্ষা',
      'হেভি স্টিম প্রেস ও শেপিং',
      'থ্রেড ক্লিয়ারিং ও ফাইনাল ফেব্রিক পলিশ'
    ]
  },
  {
    id: 'dispatched',
    stepNumber: 5,
    titleEn: 'Bespoke Packaging',
    titleBn: '৫. ডেলিভারি ও প্যাকেজিং',
    subtitleEn: 'Luxury Garment Bag',
    subtitleBn: 'লাক্সারি গার্মেন্টস ব্যাগ ডিসপ্যাচ',
    estDaysEn: 'Day 8',
    estDaysBn: '৮ম দিন',
    icon: Package,
    artisanNoteEn: 'Garment disinfected, hung in dust-proof wooden hanger box, sealed for express door delivery.',
    artisanNoteBn: 'গার্মেন্টস ডিসইনফেক্ট করে ডাস্ট-প্রুফ হ্যাঙ্গার ব্যাগে প্যাক করে কুরিয়ারে ডিসপ্যাচ করা হয়েছে।',
    checklistEn: [
      'Dust-proof luxury garment bag packing',
      'Tamper-proof security hologram seal',
      'Handed over to express delivery team'
    ],
    checklistBn: [
      'ডাস্ট-প্রুফ লাক্সারি গার্মেন্টস ব্যাগ প্যাকিং',
      'সিকিউরিটি হোলোগ্রাম সিল অ্যাটাচমেন্ট',
      'এক্সপ্রেস ডেলিভারি টিমের কাছে হস্তান্তর'
    ]
  }
];

interface TailoringJourneyProgressBarProps {
  currentStage?: TailoringStageId | number;
  orderId?: string;
  allowInteractiveStageChange?: boolean;
  className?: string;
}

export function TailoringJourneyProgressBar({
  currentStage = 'tailoring',
  orderId,
  allowInteractiveStageChange = true,
  className = ''
}: TailoringJourneyProgressBarProps) {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  // Determine active step index
  const getIndexFromStage = (stage: TailoringStageId | number) => {
    if (typeof stage === 'number') return Math.max(0, Math.min(4, stage - 1));
    const found = TAILORING_STEPS.findIndex(s => s.id === stage);
    return found !== -1 ? found : 2;
  };

  const [activeStepIndex, setActiveStepIndex] = useState<number>(
    getIndexFromStage(currentStage)
  );

  const [selectedDetailStep, setSelectedDetailStep] = useState<number>(
    getIndexFromStage(currentStage)
  );

  const currentStep = TAILORING_STEPS[activeStepIndex];
  const detailStep = TAILORING_STEPS[selectedDetailStep];

  // Progress percentage (0 to 100%)
  const progressPercent = Math.round(((activeStepIndex + 1) / TAILORING_STEPS.length) * 100);

  return (
    <div className={`bg-white rounded-3xl border border-amber-500/20 shadow-md p-5 sm:p-7 text-left font-sans ${className}`}>
      
      {/* Header Info Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-100 text-amber-900 rounded-lg">
              <Award className="w-4 h-4 text-amber-600" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-amber-700">
              {isBn ? 'কাস্টম টেলরিং অর্ডারের লাইভ ট্র্যাকিং' : 'Bespoke Order Journey & Crafts Progress'}
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-900 mt-1 flex items-center gap-2">
            <span>{isBn ? 'আপনার পোশাক তৈরির নিখুঁত ধাপসমূহ' : 'Tailoring Progress Timeline'}</span>
            {orderId && (
              <span className="text-xs font-sans font-normal text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                #{orderId}
              </span>
            )}
          </h3>
        </div>

        {/* Live Stage Badge & Progress Percentage */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-slate-400">
              {isBn ? 'সম্পন্ন হয়েছে' : 'Overall Completion'}
            </div>
            <div className="text-lg font-serif font-bold text-amber-800">
              {progressPercent}%
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <div className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-amber-400 opacity-20"></span>
              <span className="relative text-amber-900 font-extrabold text-xs">
                {activeStepIndex + 1}/{TAILORING_STEPS.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Progress Stepper Bar (Horizontal Desktop / Responsive) */}
      <div className="py-8 relative">
        
        {/* Background Connecting Line */}
        <div className="hidden md:block absolute top-12 left-8 right-8 h-1 bg-slate-100 rounded-full z-0" />

        {/* Animated Active Filled Line */}
        <div 
          className="hidden md:block absolute top-12 left-8 h-1 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 rounded-full z-0 transition-all duration-500 ease-out"
          style={{ width: `calc(${(activeStepIndex / (TAILORING_STEPS.length - 1)) * 100}% - 3rem)` }}
        />

        {/* Stepper Nodes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative z-10">
          {TAILORING_STEPS.map((step, idx) => {
            const IconComp = step.icon;
            const isCompleted = idx < activeStepIndex;
            const isActive = idx === activeStepIndex;
            const isSelected = idx === selectedDetailStep;

            return (
              <div 
                key={step.id} 
                onClick={() => {
                  setSelectedDetailStep(idx);
                  if (allowInteractiveStageChange) {
                    setActiveStepIndex(idx);
                  }
                }}
                className={`group cursor-pointer p-3 sm:p-2 rounded-2xl transition-all ${
                  isSelected ? 'bg-amber-50/80 ring-2 ring-amber-500/60' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center">
                  
                  {/* Circle Icon Badge */}
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all shrink-0 shadow-sm ${
                    isCompleted 
                      ? 'bg-emerald-600 text-white shadow-emerald-600/20' 
                      : isActive 
                        ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-500/20 scale-105 shadow-amber-500/30' 
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}>
                    {isCompleted ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : (
                      <IconComp className={`w-5 h-5 ${isActive ? 'animate-pulse' : ''}`} />
                    )}
                  </div>

                  {/* Step Title & Days */}
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-1 md:justify-center">
                      <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                        isCompleted 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isActive 
                            ? 'bg-amber-100 text-amber-900' 
                            : 'bg-slate-100 text-slate-500'
                      }`}>
                        {isBn ? step.estDaysBn : step.estDaysEn}
                      </span>
                    </div>

                    <h4 className={`text-xs sm:text-sm font-bold truncate ${
                      isActive ? 'text-amber-950' : 'text-slate-700'
                    }`}>
                      {isBn ? step.titleBn : step.titleEn}
                    </h4>

                    <p className="text-[11px] text-slate-400 truncate hidden md:block">
                      {isBn ? step.subtitleBn : step.subtitleEn}
                    </p>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Selected Step Detailed Artisan Report Box */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 space-y-4 relative overflow-hidden">
        
        {/* Subtle Decorative Background Graphic */}
        <div className="absolute top-0 right-0 p-8 text-slate-800/20 pointer-events-none">
          <Sparkles className="w-32 h-32" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              {React.createElement(detailStep.icon, { className: 'w-5 h-5' })}
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block">
                {isBn ? `ধাপ ${detailStep.stepNumber}: বিস্তারিত রিপোর্ট` : `Stage ${detailStep.stepNumber} Artisan Log`}
              </span>
              <h4 className="text-base font-serif font-bold text-white">
                {isBn ? detailStep.titleBn : detailStep.titleEn}
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              selectedDetailStep < activeStepIndex 
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                : selectedDetailStep === activeStepIndex 
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' 
                  : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}>
              {selectedDetailStep < activeStepIndex 
                ? (isBn ? 'সম্পন্ন (Completed)' : 'Completed') 
                : selectedDetailStep === activeStepIndex 
                  ? (isBn ? 'চলমান (In Progress)' : 'In Progress') 
                  : (isBn ? 'আসন্ন (Upcoming)' : 'Upcoming Stage')}
            </span>
          </div>
        </div>

        {/* Master Artisan Note */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60 text-xs text-slate-200 flex items-start gap-3">
          <UserCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">
              {isBn ? 'মাস্টার কারিগরের নোট:' : 'Master Tailor Notes:'}
            </span>
            <p className="text-slate-300 leading-relaxed">
              {isBn ? detailStep.artisanNoteBn : detailStep.artisanNoteEn}
            </p>
          </div>
        </div>

        {/* Quality Audit Checklist Items */}
        <div className="space-y-2 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            {isBn ? 'গুণমান ও কারিগরি চেকলিস্ট:' : 'Quality & Technical Checklist:'}
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {(isBn ? detailStep.checklistBn : detailStep.checklistEn).map((item, i) => (
              <div key={i} className="bg-slate-800/50 rounded-xl p-2.5 border border-slate-700/40 text-[11px] flex items-center gap-2 text-slate-300">
                <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${
                  selectedDetailStep <= activeStepIndex ? 'text-emerald-400' : 'text-slate-600'
                }`} />
                <span className="line-clamp-2">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Stage Switcher for Previewing */}
        {allowInteractiveStageChange && (
          <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>
              {isBn ? 'ডেমো সিমুলেশন: উপরের যেকোনো ধাপে ক্লিক করে বিস্তারিত রিপোর্ট দেখুন' : 'Interactive Demo: Click any stage above to inspect tailoring specifications'}
            </span>
            <button
              onClick={() => {
                const next = (activeStepIndex + 1) % TAILORING_STEPS.length;
                setActiveStepIndex(next);
                setSelectedDetailStep(next);
              }}
              className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1.5 cursor-pointer underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{isBn ? 'পরবর্তী ধাপে সিমুলেট করুন' : 'Simulate Next Stage'}</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
