import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { 
  X, Ruler, ArrowLeft, ArrowRight, Check, Sparkles, HelpCircle, 
  RotateCcw, Info, UserCheck, ShieldCheck, ChevronLeft, ChevronRight, Zap, Save, RefreshCw, Eye,
  Layers, Activity, Sliders, Waves
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { MeasurementProfile } from '../types';

interface VirtualSizeGuideModalProps {
  onClose: () => void;
  onApplyProfile?: (profile: MeasurementProfile) => void;
  initialCategory?: string;
}

type Unit = 'in' | 'cm';

interface StepGuide {
  id: string;
  nameEn: string;
  nameBn: string;
  key: string;
  defaultIn: number;
  minIn: number;
  maxIn: number;
  tipEn: string;
  tipBn: string;
  focusArea: 'chest' | 'shoulder' | 'sleeve' | 'length' | 'waist' | 'hip' | 'neck';
}

const steps: StepGuide[] = [
  {
    id: '1',
    nameEn: 'Chest / Bust (বুকের মাপ)',
    nameBn: '১. বুকের মাপ (Chest)',
    key: 'chest',
    defaultIn: 40,
    minIn: 30,
    maxIn: 60,
    tipEn: 'Wrap measuring tape around fullest part of chest under arms. Keep tape horizontal and relaxed.',
    tipBn: 'বগল থেকে ফিতা দিয়ে বুকের সবচেয়ে চওড়া অংশে সমান্তরালভাবে মাপুন। ফিতা বেশি শক্ত করবেন না।',
    focusArea: 'chest'
  },
  {
    id: '2',
    nameEn: 'Shoulder Width (কাঁধের চওড়া)',
    nameBn: '২. কাঁধের চওড়া (Shoulder)',
    key: 'shoulder',
    defaultIn: 18,
    minIn: 12,
    maxIn: 26,
    tipEn: 'Measure from left shoulder bone point across the upper back to the right shoulder bone point.',
    tipBn: 'পিঠের দিক থেকে এক কাঁধের হাড়ের শেষ থেকে অপর কাঁধের হাড় পর্যন্ত সোজা মেপে নিন।',
    focusArea: 'shoulder'
  },
  {
    id: '3',
    nameEn: 'Sleeve Length (হাতার দৈর্ঘ্য)',
    nameBn: '৩. হাতার দৈর্ঘ্য (Sleeve)',
    key: 'sleeve',
    defaultIn: 25,
    minIn: 15,
    maxIn: 34,
    tipEn: 'Measure from top shoulder seam point, slightly bending elbow down to wrist bone.',
    tipBn: 'কাঁধের সিনের জোড়া থেকে শুরু করে হাতের কবজির হাড় পর্যন্ত বাইরের পাশ দিয়ে মাপুন।',
    focusArea: 'sleeve'
  },
  {
    id: '4',
    nameEn: 'Garment Length (পোশাকের দৈর্ঘ্য)',
    nameBn: '৪. পোশাকের দৈর্ঘ্য (Length)',
    key: 'length',
    defaultIn: 42,
    minIn: 24,
    maxIn: 58,
    tipEn: 'Measure from highest shoulder neck intersection straight down to your desired bottom hem.',
    tipBn: 'গলার পাশে কাঁধের সর্বোচ্চ স্থান থেকে পছন্দের নিচের সীমানা পর্যন্ত সোজা মেপে নিন।',
    focusArea: 'length'
  },
  {
    id: '5',
    nameEn: 'Waistline (কোমরের মাপ)',
    nameBn: '৫. কোমরের মাপ (Waist)',
    key: 'waist',
    defaultIn: 36,
    minIn: 24,
    maxIn: 56,
    tipEn: 'Measure around natural waistline slightly above belly button for Panjabi/Shirt fit.',
    tipBn: 'নাভির সামান্য উপরে স্বাভাবিক কোমরের অংশে ফিতা ঘুরিয়ে মাপুন।',
    focusArea: 'waist'
  },
  {
    id: '6',
    nameEn: 'Hip & Seat (হিপের মাপ)',
    nameBn: '৬. হিপ ও সিট (Hip)',
    key: 'hip',
    defaultIn: 40,
    minIn: 30,
    maxIn: 62,
    tipEn: 'Measure horizontally around the fullest part of hips and buttocks while standing straight.',
    tipBn: 'সোজা হয়ে দাঁড়িয়ে হিপ ও নিতম্বের সবচেয়ে চওড়া অংশ সমান্তরালভাবে মেপে নিন।',
    focusArea: 'hip'
  },
  {
    id: '7',
    nameEn: 'Neck / Collar (গলার বেড়)',
    nameBn: '৭. কলার / গলার বেড় (Neck)',
    key: 'neck',
    defaultIn: 15.5,
    minIn: 11,
    maxIn: 22,
    tipEn: 'Measure around base of neck where collar sits. Keep index finger under tape for breathing room.',
    tipBn: 'গলার গোড়ায় ফিতা প্যাঁচান। শ্বাসপ্রশ্বাসের সুবিধার্থে ফিতার নিচে এক আঙুল জায়গা রাখুন।',
    focusArea: 'neck'
  }
];

export function VirtualSizeGuideModal({ onClose, onApplyProfile, initialCategory }: VirtualSizeGuideModalProps) {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [unit, setUnit] = useState<Unit>('in');
  const [bodyShape, setBodyShape] = useState<'slim' | 'athletic' | 'regular' | 'broad'>('regular');
  const [fitPreference, setFitPreference] = useState<'snug' | 'tailored' | 'classic' | 'relaxed'>('tailored');
  const [profileName, setProfileName] = useState('My Custom Fit');
  const [isSaved, setIsSaved] = useState(false);

  // Measurement values state in inches
  const [valuesInches, setValuesInches] = useState<Record<string, number>>({
    chest: 40,
    shoulder: 18,
    sleeve: 25,
    length: 42,
    waist: 36,
    hip: 40,
    neck: 15.5
  });

  // Animated geometry state rendered in SVG (updated continuously by GSAP)
  const [drapeGeometry, setDrapeGeometry] = useState({
    chestSpan: 42,
    shoulderSpan: 38,
    sleeveLen: 135,
    garmentLen: 178,
    waistSpan: 38,
    hipSpan: 42,
    neckRadius: 14,
    waveFlutter: 0,
    easeAllowance: 1.5,
    tensionRatio: 65 // percentage fit tension
  });

  const animatedValuesRef = useRef({
    chest: 40,
    shoulder: 18,
    sleeve: 25,
    length: 42,
    waist: 36,
    hip: 40,
    neck: 15.5,
    waveFlutter: 0
  });

  const svgContainerRef = useRef<HTMLDivElement>(null);
  const activeTapeRef = useRef<SVGGElement>(null);

  // Lock background scroll
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // GSAP Smooth Drape Physics Morphing Engine
  useEffect(() => {
    // Determine fit ease allowance in inches
    let easeIn = 1.5;
    if (fitPreference === 'snug') easeIn = 0.5;
    else if (fitPreference === 'classic') easeIn = 2.5;
    else if (fitPreference === 'relaxed') easeIn = 3.5;

    // Body shape multipliers
    let multChest = 1.0;
    let multWaist = 1.0;
    let multShoulder = 1.0;
    let multHip = 1.0;

    if (bodyShape === 'slim') {
      multChest = 0.96;
      multWaist = 0.90;
      multHip = 0.92;
    } else if (bodyShape === 'athletic') {
      multChest = 1.06;
      multShoulder = 1.05;
      multWaist = 0.95;
    } else if (bodyShape === 'broad') {
      multChest = 1.04;
      multWaist = 1.12;
      multHip = 1.08;
    }

    // Trigger fabric sway/settle wave bounce using GSAP
    gsap.killTweensOf(animatedValuesRef.current);

    gsap.fromTo(
      animatedValuesRef.current,
      { waveFlutter: -3.5 },
      {
        waveFlutter: 0,
        duration: 0.9,
        ease: 'elastic.out(1.2, 0.4)'
      }
    );

    // Tween the measurement coordinates with GSAP smooth power2 easing
    gsap.to(animatedValuesRef.current, {
      chest: valuesInches.chest,
      shoulder: valuesInches.shoulder,
      sleeve: valuesInches.sleeve,
      length: valuesInches.length,
      waist: valuesInches.waist,
      hip: valuesInches.hip,
      neck: valuesInches.neck,
      duration: 0.65,
      ease: 'power2.out',
      onUpdate: () => {
        const cur = animatedValuesRef.current;

        // Map inches to SVG canvas pixel dimensions (Canvas center X = 100)
        const computedShoulder = Math.max(26, Math.min(52, (cur.shoulder * 2.05) * multShoulder));
        const computedChest = Math.max(30, Math.min(56, ((cur.chest + easeIn) * 0.96) * multChest));
        const computedWaist = Math.max(26, Math.min(54, ((cur.waist + easeIn) * 0.94) * multWaist));
        const computedHip = Math.max(28, Math.min(58, ((cur.hip + easeIn) * 0.96) * multHip));
        const computedGarmentLen = Math.max(120, Math.min(220, 65 + (cur.length * 2.6)));
        const computedSleeveLen = Math.max(100, Math.min(185, 65 + (cur.sleeve * 3.6)));
        const computedNeckRadius = Math.max(10, Math.min(22, cur.neck * 0.92));

        // Calculate fit tension percentage (0% = super loose cascading flow, 100% = tight skin contour)
        const totalBodyVol = cur.chest + cur.waist;
        const totalGarmentVol = (cur.chest + easeIn) + (cur.waist + easeIn);
        const tension = Math.max(15, Math.min(95, 100 - ((totalGarmentVol - totalBodyVol) * 12)));

        setDrapeGeometry({
          chestSpan: computedChest,
          shoulderSpan: computedShoulder,
          sleeveLen: computedSleeveLen,
          garmentLen: computedGarmentLen,
          waistSpan: computedWaist,
          hipSpan: computedHip,
          neckRadius: computedNeckRadius,
          waveFlutter: cur.waveFlutter,
          easeAllowance: easeIn,
          tensionRatio: Math.round(tension)
        });
      }
    });

    // Animate active tape line pulse effect using GSAP
    if (activeTapeRef.current) {
      gsap.fromTo(
        activeTapeRef.current,
        { scale: 0.95, opacity: 0.5 },
        { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.7)' }
      );
    }
  }, [valuesInches, fitPreference, bodyShape, currentStepIndex]);

  const currentStep = steps[currentStepIndex];

  // Utility conversions
  const displayVal = (valIn: number) => {
    if (unit === 'cm') {
      return (valIn * 2.54).toFixed(1);
    }
    return valIn.toFixed(1);
  };

  const handleUpdateVal = (key: string, deltaIn: number) => {
    setValuesInches(prev => {
      const stepObj = steps.find(s => s.key === key);
      const current = prev[key] || 30;
      const updated = Math.max(stepObj ? stepObj.minIn : 10, Math.min(stepObj ? stepObj.maxIn : 70, current + deltaIn));
      return { ...prev, [key]: parseFloat(updated.toFixed(2)) };
    });
  };

  const handleSliderChange = (key: string, rawVal: number) => {
    const valIn = unit === 'cm' ? rawVal / 2.54 : rawVal;
    setValuesInches(prev => ({ ...prev, [key]: parseFloat(valIn.toFixed(1)) }));
  };

  // Smart size recommendation calculation
  const getSmartSizeMatch = () => {
    const c = valuesInches.chest;
    let size = 'M';
    let matchScore = 96;

    if (c <= 36.5) { size = 'S (36)'; matchScore = 98; }
    else if (c <= 38.5) { size = 'M (38)'; matchScore = 96; }
    else if (c <= 40.5) { size = 'L (40)'; matchScore = 95; }
    else if (c <= 42.5) { size = 'XL (42)'; matchScore = 97; }
    else { size = 'XXL (44)'; matchScore = 94; }

    return { size, matchScore };
  };

  const smartSize = getSmartSizeMatch();

  // Generate measurement profile and trigger callback
  const handleSaveProfile = () => {
    const profile: MeasurementProfile = {
      id: crypto.randomUUID(),
      name: profileName,
      measurements: {
        length: (valuesInches.length || 42).toString(),
        chest: (valuesInches.chest || 40).toString(),
        waist: (valuesInches.waist || 36).toString(),
        shoulder: (valuesInches.shoulder || 18).toString(),
        sleeve: (valuesInches.sleeve || 25).toString(),
        neck: (valuesInches.neck || 15.5).toString(),
        hip: (valuesInches.hip || 40).toString(),
        armhole: '18'
      },
      customizations: {
        collarStyle: 'classic',
        pocketStyle: 'single',
        fitPreference,
        sleeveFinish: 'standard'
      }
    };

    try {
      const existing = JSON.parse(localStorage.getItem('luxury_tailor_profiles') || '[]');
      localStorage.setItem('luxury_tailor_profiles', JSON.stringify([profile, ...existing]));
    } catch (e) {
      console.error(e);
    }

    setIsSaved(true);
    if (onApplyProfile) {
      onApplyProfile(profile);
    }
  };

  // Dynamic GSAP Vector Garment Silhouette with Live Cloth Drape & Wave Motion
  const renderInteractiveDiagram = () => {
    const activeKey = currentStep.key;
    const { 
      chestSpan, shoulderSpan, sleeveLen, garmentLen, 
      waistSpan, hipSpan, neckRadius, waveFlutter, easeAllowance, tensionRatio 
    } = drapeGeometry;

    // Center origin X = 100
    const leftShoulderX = 100 - (shoulderSpan / 2);
    const rightShoulderX = 100 + (shoulderSpan / 2);

    const leftArmholeX = 100 - (chestSpan / 2);
    const rightArmholeX = 100 + (chestSpan / 2);

    const leftWaistX = 100 - (waistSpan / 2);
    const rightWaistX = 100 + (waistSpan / 2);

    const leftHemX = 100 - (hipSpan / 2) - 4;
    const rightHemX = 100 + (hipSpan / 2) + 4;

    const sleeveTipLeftX = Math.max(18, leftShoulderX - (sleeveLen * 0.16));
    const sleeveTipRightX = Math.min(182, rightShoulderX + (sleeveLen * 0.16));
    const sleeveTipY = Math.min(185, 65 + (sleeveLen * 0.65));

    // Drape fold curve control points incorporating GSAP waveFlutter
    const waveOffset = waveFlutter * 1.5;

    const mainGarmentPath = `
      M ${100 - neckRadius},48
      Q 100,${42 - (neckRadius * 0.2)} ${100 + neckRadius},48
      L ${rightShoulderX},62
      Q ${rightArmholeX + 4},80 ${rightArmholeX},100
      Q ${rightWaistX + waveOffset},138 ${rightHemX + waveOffset},${garmentLen}
      Q 100,${garmentLen + 6 + (waveOffset * 0.5)} ${leftHemX + waveOffset},${garmentLen}
      Q ${leftWaistX + waveOffset},138 ${leftArmholeX},100
      Q ${leftArmholeX - 4},80 ${leftShoulderX},62
      Z
    `;

    // Left Sleeve Path
    const leftSleevePath = `
      M ${leftShoulderX},62
      Q ${leftShoulderX - 12},85 ${sleeveTipLeftX},${sleeveTipY}
      L ${sleeveTipLeftX + 10},${sleeveTipY + 3}
      Q ${leftArmholeX - 2},95 ${leftArmholeX},100
      Z
    `;

    // Right Sleeve Path
    const rightSleevePath = `
      M ${rightShoulderX},62
      Q ${rightShoulderX + 12},85 ${sleeveTipRightX},${sleeveTipY}
      L ${sleeveTipRightX - 10},${sleeveTipY + 3}
      Q ${rightArmholeX + 2},95 ${rightArmholeX},100
      Z
    `;

    return (
      <div 
        ref={svgContainerRef} 
        className="relative w-full h-72 sm:h-80 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 rounded-2xl p-4 flex flex-col items-center justify-between border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Subtle royal geometric grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b18_1px,transparent_1px),linear-gradient(to_bottom,#1e293b18_1px,transparent_1px)] bg-[size:16px_16px]" />

        {/* Header Physics Badge Bar */}
        <div className="w-full flex items-center justify-between z-20 px-2">
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-bold text-amber-300">
            <Waves className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>GSAP Drape Engine</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-semibold text-slate-300">
            <span className="text-slate-400">Ease Allowance:</span>
            <span className="font-bold text-emerald-400">+{easeAllowance}″ ({fitPreference})</span>
          </div>
        </div>

        {/* Dynamic Glowing GSAP Interactive Mannequin SVG */}
        <svg viewBox="0 0 200 240" className="h-full w-auto relative z-10 filter drop-shadow-xl overflow-visible">
          
          <defs>
            {/* Royal Gold Silk Gradient for Cloth Overlay */}
            <linearGradient id="clothGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.5" />
            </linearGradient>

            <linearGradient id="tapeGlowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#f59e0b" stopOpacity="1" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.8" />
            </linearGradient>

            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Underlying Mannequin Frame */}
          <g stroke="#334155" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.65">
            {/* Head */}
            <circle cx="100" cy="26" r="14" fill="#0f172a" />
            {/* Neck */}
            <path d="M93,39 L93,48 M107,39 L107,48" stroke="#475569" />
            {/* Anatomical chest guide lines */}
            <line x1="100" y1="48" x2="100" y2="215" stroke="#1e293b" strokeDasharray="2 2" />
          </g>

          {/* 2. GSAP DRAPED FABRIC GARMENT OVERLAY */}
          <g className="transition-all duration-300">
            {/* Main Garment Body Fill */}
            <path 
              d={mainGarmentPath} 
              fill="url(#clothGoldGrad)" 
              stroke="#f59e0b" 
              strokeWidth="2" 
              strokeLinejoin="round"
            />

            {/* Left & Right Draped Sleeves */}
            <path d={leftSleevePath} fill="url(#clothGoldGrad)" stroke="#d97706" strokeWidth="1.5" />
            <path d={rightSleevePath} fill="url(#clothGoldGrad)" stroke="#d97706" strokeWidth="1.5" />

            {/* Collar & Royal Placket Detail */}
            <path d={`M ${100 - neckRadius},48 Q 100,${55} ${100 + neckRadius},48`} fill="none" stroke="#fbbf24" strokeWidth="2.5" />
            <line x1="100" y1="52" x2="100" y2="115" stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 3" />
            <circle cx="100" cy="65" r="2" fill="#fef08a" />
            <circle cx="100" cy="80" r="2" fill="#fef08a" />
            <circle cx="100" cy="95" r="2" fill="#fef08a" />

            {/* Chest Pocket Outline */}
            <rect x="112" y="80" width="14" height="18" rx="2" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.8" />

            {/* Interactive Cloth Drape Fold Crease Curves (Flow based on fit ease & GSAP waveFlutter) */}
            <g stroke="#fef08a" strokeWidth="1" fill="none" opacity="0.45" strokeLinecap="round">
              {/* Left Side Cascade Fold */}
              <path d={`M ${leftArmholeX + 4},102 Q ${100 - (waistSpan * 0.3) + waveOffset},135 ${leftHemX + 8 + waveOffset},${garmentLen - 4}`} />
              {/* Right Side Cascade Fold */}
              <path d={`M ${rightArmholeX - 4},102 Q ${100 + (waistSpan * 0.3) + waveOffset},135 ${rightHemX - 8 + waveOffset},${garmentLen - 4}`} />
              {/* Center Hem Drape Flow Line */}
              <path d={`M 100,115 Q ${100 + waveOffset},160 100,${garmentLen - 2}`} strokeDasharray="3 3" />
            </g>

            {/* Side Slits at Hem */}
            <line x1={leftHemX} y1={garmentLen - 25} x2={leftHemX} y2={garmentLen} stroke="#fbbf24" strokeWidth="2" />
            <line x1={rightHemX} y1={garmentLen - 25} x2={rightHemX} y2={garmentLen} stroke="#fbbf24" strokeWidth="2" />
          </g>

          {/* 3. DYNAMIC MEASUREMENT TAPE HIGHLIGHT OVERLAY (GSAP animated target) */}
          <g ref={activeTapeRef} className="z-30">
            {activeKey === 'chest' && (
              <g filter="url(#glowFilter)">
                <ellipse cx="100" cy="100" rx={chestSpan / 2 + 4} ry="10" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="6 3" />
                <line x1={leftArmholeX - 4} y1="100" x2={rightArmholeX + 4} y2="100" stroke="url(#tapeGlowGrad)" strokeWidth="3" />
                <circle cx={leftArmholeX - 4} cy="100" r="5" fill="#f59e0b" />
                <circle cx={rightArmholeX + 4} cy="100" r="5" fill="#f59e0b" />
                <rect x="68" y="86" width="64" height="15" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="100" y="97" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  CHEST {displayVal(valuesInches.chest)}{unit}
                </text>
              </g>
            )}

            {activeKey === 'shoulder' && (
              <g filter="url(#glowFilter)">
                <line x1={leftShoulderX} y1="62" x2={rightShoulderX} y2="62" stroke="url(#tapeGlowGrad)" strokeWidth="4" />
                <circle cx={leftShoulderX} cy="62" r="5" fill="#f59e0b" />
                <circle cx={rightShoulderX} cy="62" r="5" fill="#f59e0b" />
                <rect x="58" y="46" width="84" height="15" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="100" y="57" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  SHOULDER {displayVal(valuesInches.shoulder)}{unit}
                </text>
              </g>
            )}

            {activeKey === 'sleeve' && (
              <g filter="url(#glowFilter)">
                <path d={`M ${rightShoulderX},62 Q ${rightShoulderX + 12},85 ${sleeveTipRightX},${sleeveTipY}`} fill="none" stroke="url(#tapeGlowGrad)" strokeWidth="4" />
                <circle cx={rightShoulderX} cy="62" r="5" fill="#f59e0b" />
                <circle cx={sleeveTipRightX} cy={sleeveTipY} r="5" fill="#f59e0b" />
                <rect x="125" y="115" width="72" height="15" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="161" y="126" textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontWeight="bold">
                  SLEEVE {displayVal(valuesInches.sleeve)}{unit}
                </text>
              </g>
            )}

            {activeKey === 'length' && (
              <g filter="url(#glowFilter)">
                <line x1="86" y1="48" x2="86" y2={garmentLen} stroke="url(#tapeGlowGrad)" strokeWidth="3.5" strokeDasharray="5 2" />
                <circle cx="86" cy="48" r="5" fill="#f59e0b" />
                <circle cx="86" cy={garmentLen} r="5" fill="#f59e0b" />
                <rect x="42" y="125" width="78" height="15" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="81" y="136" textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontWeight="bold">
                  LENGTH {displayVal(valuesInches.length)}{unit}
                </text>
              </g>
            )}

            {activeKey === 'waist' && (
              <g filter="url(#glowFilter)">
                <ellipse cx="100" cy="138" rx={waistSpan / 2 + 4} ry="8" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="5 3" />
                <line x1={leftWaistX - 4} y1="138" x2={rightWaistX + 4} y2="138" stroke="url(#tapeGlowGrad)" strokeWidth="2.5" />
                <circle cx={leftWaistX - 4} cy="138" r="5" fill="#f59e0b" />
                <circle cx={rightWaistX + 4} cy="138" r="5" fill="#f59e0b" />
                <rect x="66" y="125" width="68" height="15" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="100" y="136" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  WAIST {displayVal(valuesInches.waist)}{unit}
                </text>
              </g>
            )}

            {activeKey === 'hip' && (
              <g filter="url(#glowFilter)">
                <ellipse cx="100" cy="172" rx={hipSpan / 2 + 4} ry="9" fill="none" stroke="#fbbf24" strokeWidth="3.5" strokeDasharray="5 3" />
                <line x1={leftHemX + 2} y1="172" x2={rightHemX - 2} y2="172" stroke="url(#tapeGlowGrad)" strokeWidth="2.5" />
                <circle cx={leftHemX + 2} cy="172" r="5" fill="#f59e0b" />
                <circle cx={rightHemX - 2} cy="172" r="5" fill="#f59e0b" />
                <rect x="68" y="160" width="64" height="15" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="100" y="171" textAnchor="middle" fill="#fbbf24" fontSize="9" fontWeight="bold">
                  HIP {displayVal(valuesInches.hip)}{unit}
                </text>
              </g>
            )}

            {activeKey === 'neck' && (
              <g filter="url(#glowFilter)">
                <ellipse cx="100" cy="48" rx={neckRadius + 3} ry="6" fill="none" stroke="#fbbf24" strokeWidth="3" />
                <circle cx="100" cy="48" r="4" fill="#f59e0b" />
                <rect x="66" y="32" width="68" height="14" rx="7" fill="#0f172a" stroke="#f59e0b" strokeWidth="1" />
                <text x="100" y="42" textAnchor="middle" fill="#fbbf24" fontSize="8.5" fontWeight="bold">
                  NECK {displayVal(valuesInches.neck)}{unit}
                </text>
              </g>
            )}
          </g>
        </svg>

        {/* Footer Drape Physics & Tension Indicator Bar */}
        <div className="w-full bg-slate-900/90 border border-slate-800 rounded-xl p-2 z-20 flex items-center justify-between gap-3 text-[10px]">
          <div className="flex items-center gap-1.5 text-slate-300">
            <Activity className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-semibold">{isBn ? 'ফেব্রিক ড্র্যাপ ফিটিং টেনশন:' : 'Drape Tension Physics:'}</span>
          </div>

          <div className="flex-1 flex items-center gap-2 max-w-[160px]">
            <span className="text-slate-400 text-[9px] shrink-0">Flow</span>
            <div className="flex-1 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
              <div 
                className="bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-500 h-full transition-all duration-300 rounded-full"
                style={{ width: `${tensionRatio}%` }}
              />
            </div>
            <span className="text-slate-400 text-[9px] shrink-0">Snug</span>
          </div>

          <span className="font-bold text-amber-300 shrink-0 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
            {tensionRatio < 40 ? (isBn ? 'লুজ ক্লাসিক ড্র্যাপ' : 'Loose Cascading') : tensionRatio < 75 ? (isBn ? 'পারফেক্ট টেলর্ড ফিট' : 'Tailored Balance') : (isBn ? 'স্ন্যাগ বডি কাউন্টার' : 'Contoured Body')}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 overflow-hidden bg-slate-950/75 backdrop-blur-xs font-sans">
      
      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-slate-200 text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-8 py-4 flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-xl font-serif font-bold text-white flex items-center gap-2">
                <span>{isBn ? 'ভার্চুয়াল সাইজ ও মেজারমেন্ট গাইড' : 'Virtual Size & Measurement Studio'}</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 font-sans border border-amber-500/30 px-2 py-0.5 rounded-full uppercase">
                  3D Tailor
                </span>
              </h2>
              <p className="text-[11px] text-slate-300">
                {isBn ? 'নিখুঁত টেলর্ড ফিটিংয়ের জন্য ডায়গ্রাম দেখে নিজের মাপ নির্ধারণ করুন' : 'Interactive self-measurement wizard with real-time silhouette guidance'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#FAF9F6]">
          
          {/* Step Progress Navigation Bar */}
          <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-slate-900">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>{isBn ? `ধাপ ${currentStepIndex + 1} / ${steps.length}` : `Step ${currentStepIndex + 1} of ${steps.length}`}</span>
              </span>
              <span>{Math.round(((currentStepIndex + 1) / steps.length) * 100)}% {isBn ? 'সম্পন্ন' : 'Completed'}</span>
            </div>

            {/* Progress Track */}
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-amber-600 h-full transition-all duration-300 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Step Selection Buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`py-1.5 px-3 rounded-xl text-[11px] font-bold shrink-0 transition-all ${
                    currentStepIndex === idx
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {s.id}. {s.key.toUpperCase()} ({displayVal(valuesInches[s.key])}{unit})
                </button>
              ))}
            </div>
          </div>

          {/* Main Interactive Grid: Left Visual Diagram, Right Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Left: Dynamic Visual Diagram Card */}
            <div className="space-y-3">
              {renderInteractiveDiagram()}

              {/* Tip Callout Box */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl text-xs text-amber-950 space-y-1.5 shadow-2xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{isBn ? 'মাপ নেওয়ার টিপস:' : 'Measurement Pro-Tip:'}</span>
                </div>
                <p className="text-slate-700 leading-relaxed text-[11px]">
                  {isBn ? currentStep.tipBn : currentStep.tipEn}
                </p>
              </div>
            </div>

            {/* Right: Active Input & Stepper Controls */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-5">
              
              {/* Unit Switcher */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  {isBn ? 'পরিমাপ একক:' : 'Measurement Unit:'}
                </label>

                <div className="flex bg-slate-100 p-1 rounded-xl text-xs font-bold border border-slate-200">
                  <button
                    onClick={() => setUnit('in')}
                    className={`px-3 py-1 rounded-lg transition-all ${unit === 'in' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    Inches (in)
                  </button>
                  <button
                    onClick={() => setUnit('cm')}
                    className={`px-3 py-1 rounded-lg transition-all ${unit === 'cm' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    CM (cm)
                  </button>
                </div>
              </div>

              {/* Step Title */}
              <div>
                <h3 className="text-lg font-serif font-bold text-slate-900">
                  {isBn ? currentStep.nameBn : currentStep.nameEn}
                </h3>
                <span className="text-xs text-slate-500 font-medium">
                  {isBn ? 'আপনার সঠিক পরিমাপ কাস্টমাইজ করুন' : 'Adjust exact measurement for your body'}
                </span>
              </div>

              {/* Stepper Control Box */}
              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-slate-200/80 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase text-slate-400">Target Size</span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-amber-700">
                    {displayVal(valuesInches[currentStep.key])} <span className="text-sm font-sans font-semibold text-slate-500">{unit}</span>
                  </div>
                </div>

                {/* Fine Stepper Buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateVal(currentStep.key, -1.0)}
                    className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs text-xs"
                  >
                    - 1.0 {unit}
                  </button>
                  <button
                    onClick={() => handleUpdateVal(currentStep.key, -0.25)}
                    className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs text-xs"
                  >
                    - 0.25 {unit}
                  </button>
                  <button
                    onClick={() => handleUpdateVal(currentStep.key, +0.25)}
                    className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs text-xs"
                  >
                    + 0.25 {unit}
                  </button>
                  <button
                    onClick={() => handleUpdateVal(currentStep.key, +1.0)}
                    className="flex-1 py-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-100 active:scale-95 transition-all shadow-2xs text-xs"
                  >
                    + 1.0 {unit}
                  </button>
                </div>

                {/* Range Slider */}
                <input
                  type="range"
                  min={unit === 'cm' ? currentStep.minIn * 2.54 : currentStep.minIn}
                  max={unit === 'cm' ? currentStep.maxIn * 2.54 : currentStep.maxIn}
                  step="0.5"
                  value={unit === 'cm' ? valuesInches[currentStep.key] * 2.54 : valuesInches[currentStep.key]}
                  onChange={(e) => handleSliderChange(currentStep.key, parseFloat(e.target.value))}
                  className="w-full accent-amber-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
              </div>

              {/* Wizard Step Prev/Next Buttons */}
              <div className="flex items-center justify-between pt-2">
                <button
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex(prev => prev - 1)}
                  className="py-2.5 px-4 bg-slate-100 text-slate-700 rounded-xl font-bold text-xs hover:bg-slate-200 disabled:opacity-40 transition-all flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>{isBn ? 'আগেরটি' : 'Previous'}</span>
                </button>

                <button
                  disabled={currentStepIndex === steps.length - 1}
                  onClick={() => setCurrentStepIndex(prev => prev + 1)}
                  className="py-2.5 px-5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-amber-600 disabled:opacity-40 transition-all flex items-center gap-1 shadow-md"
                >
                  <span>{isBn ? 'পরবর্তীটি' : 'Next Step'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>

          {/* Smart Size Match & Fitting Preferences */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <h4 className="text-sm font-serif font-bold text-slate-900">
                  {isBn ? 'স্মার্ট সাইজ এনালাইজার ও ফিটিং পছন্দ' : 'Smart Size Match & Fit Preferences'}
                </h4>
              </div>

              {/* Recommended Size Badge */}
              <div className="bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  {isBn ? 'প্রস্তাবিত সাইজ:' : 'Recommended Size:'} <strong>{smartSize.size}</strong> ({smartSize.matchScore}% Match)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              
              {/* 1. Body Posture Profile */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isBn ? 'বডি বিল্ড / শেপ:' : 'Body Shape Profile:'}
                </label>
                <select
                  value={bodyShape}
                  onChange={(e) => setBodyShape(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 outline-none focus:border-amber-600"
                >
                  <option value="slim">{isBn ? 'স্লিম / চিকন (Slim)' : 'Slim / Lean Build'}</option>
                  <option value="athletic">{isBn ? 'অ্যাথলেটিক / মাসকুলার (Athletic)' : 'Athletic / Broad Chest'}</option>
                  <option value="regular">{isBn ? 'স্বাভাবিক / রেগুলার (Regular)' : 'Standard Regular Build'}</option>
                  <option value="broad">{isBn ? 'ব্রড / হেভি (Portly/Broad)' : 'Portly / Broad Waist'}</option>
                </select>
              </div>

              {/* 2. Fit Preference */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isBn ? 'ফিটিং ধরন:' : 'Tailoring Ease / Fit:'}
                </label>
                <select
                  value={fitPreference}
                  onChange={(e) => setFitPreference(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-semibold text-slate-800 outline-none focus:border-amber-600"
                >
                  <option value="snug">{isBn ? 'স্ন্যাগ / বডি ফিট (+0.5" Ease)' : 'Snug Body Fit (+0.5")'}</option>
                  <option value="tailored">{isBn ? 'স্মার্ট টেলর্ড ফিট (+1.5" Ease)' : 'Smart Tailored Fit (+1.5")'}</option>
                  <option value="classic">{isBn ? 'ক্লাসিক রেগুলার (+2.5" Ease)' : 'Classic Regular Fit (+2.5")'}</option>
                  <option value="relaxed">{isBn ? 'কমফোর্ট লুজ (+3.5" Ease)' : 'Comfort Relaxed Fit (+3.5")'}</option>
                </select>
              </div>

              {/* 3. Profile Identifier Label */}
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                  {isBn ? 'প্রোফাইল নেম:' : 'Profile Label Name:'}
                </label>
                <input
                  type="text"
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  placeholder="e.g. Eid Panjabi Fit"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none focus:border-amber-600"
                />
              </div>

            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{isBn ? '১০০% ফিট গ্যারান্টি সহ মাস্টার অল্টারেশন সুবিধা' : '100% Fit Guarantee & Free Master Alterations'}</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {isSaved && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl flex items-center gap-1 border border-emerald-200">
                <Check className="w-4 h-4" />
                <span>{isBn ? 'সেভ হয়েছে!' : 'Saved!'}</span>
              </span>
            )}

            <button
              onClick={handleSaveProfile}
              className="w-full sm:w-auto py-3.5 px-6 bg-slate-900 hover:bg-amber-600 text-white rounded-2xl font-bold uppercase tracking-wider text-xs transition-all flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isBn ? 'প্রোফাইল সেভ ও অ্যাপ্লাই করুন' : 'Save & Apply Measurements'}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
