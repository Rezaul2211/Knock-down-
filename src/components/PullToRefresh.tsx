import React, { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, RefreshCw, Check, Sparkles } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

interface PullToRefreshProps {
  children: ReactNode;
  onRefresh: () => Promise<void> | void;
  pullThreshold?: number; // Distance in px required to trigger refresh (default: 70)
  maxPullDistance?: number; // Max pull distance allowed (default: 120)
}

export function PullToRefresh({
  children,
  onRefresh,
  pullThreshold = 70,
  maxPullDistance = 110,
}: PullToRefreshProps) {
  const { language } = useAppContext();
  const isBn = language === 'bn';

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  const startYRef = useRef(0);
  const currentYRef = useRef(0);
  const isPullingRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Helper to check if page is scrolled to top
  const isAtTop = () => {
    return window.scrollY <= 2;
  };

  const handleTouchStart = (e: React.TouchEvent | TouchEvent) => {
    if (!isAtTop() || isRefreshing) return;
    const touch = 'touches' in e ? e.touches[0] : null;
    if (!touch) return;

    startYRef.current = touch.clientY;
    currentYRef.current = touch.clientY;
    isPullingRef.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent | TouchEvent) => {
    if (!isPullingRef.current || isRefreshing) return;
    const touch = 'touches' in e ? e.touches[0] : null;
    if (!touch) return;

    currentYRef.current = touch.clientY;
    const deltaY = currentYRef.current - startYRef.current;

    if (deltaY > 0 && isAtTop()) {
      // Resistance calculation (logarithmic dampening)
      const dampening = 0.45;
      const calculatedPull = Math.min(maxPullDistance, deltaY * dampening);
      
      setPullDistance(calculatedPull);

      // Prevent default browser rubber-banding/reload if pulling
      if (deltaY > 10 && e.cancelable) {
        e.preventDefault();
      }
    } else {
      setPullDistance(0);
    }
  };

  const handleTouchEnd = async () => {
    if (!isPullingRef.current || isRefreshing) return;
    isPullingRef.current = false;

    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true);
      setPullDistance(pullThreshold); // Hold at threshold while loading

      try {
        await onRefresh();
        setRefreshSuccess(true);
        setTimeout(() => {
          setRefreshSuccess(false);
          setIsRefreshing(false);
          setPullDistance(0);
        }, 700);
      } catch (err) {
        console.error('Refresh failed', err);
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      // Snap back if threshold not reached
      setPullDistance(0);
    }
  };

  // Add non-passive touchmove event listener to container to prevent default scrolling when dragging down
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onTouchMoveNative = (e: TouchEvent) => {
      if (isPullingRef.current && isAtTop()) {
        const touch = e.touches[0];
        const deltaY = touch.clientY - startYRef.current;
        if (deltaY > 10 && e.cancelable) {
          e.preventDefault();
        }
      }
    };

    el.addEventListener('touchmove', onTouchMoveNative, { passive: false });
    return () => {
      el.removeEventListener('touchmove', onTouchMoveNative);
    };
  }, []);

  const progress = Math.min(1, pullDistance / pullThreshold);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative min-h-screen overflow-x-hidden touch-pan-y"
    >
      {/* Pull Indicator Visual Header Bar */}
      <div
        className="fixed top-18 sm:top-24 left-0 right-0 z-40 pointer-events-none flex justify-center transition-all"
        style={{
          transform: `translateY(${Math.max(0, pullDistance - 10)}px)`,
          opacity: pullDistance > 8 ? 1 : 0,
        }}
      >
        <div className="bg-[#2B2823] text-white px-4 py-2 rounded-full shadow-xl border border-[#E5C158]/40 flex items-center gap-2.5 backdrop-blur-md">
          {refreshSuccess ? (
            <>
              <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center">
                <Check className="w-3.5 h-3.5 stroke-3" />
              </div>
              <span className="text-xs font-serif font-bold text-emerald-300">
                {isBn ? 'ক্যাটালগ রিফ্রেশ হয়েছে!' : 'Catalog Refreshed!'}
              </span>
            </>
          ) : isRefreshing ? (
            <>
              <RefreshCw className="w-4 h-4 text-[#E5C158] animate-spin" />
              <span className="text-xs font-serif font-bold text-[#E5C158]">
                {isBn ? 'নতুন ক্যাটালগ লোড হচ্ছে...' : 'Refreshing Catalogue...'}
              </span>
            </>
          ) : (
            <>
              <motion.div
                animate={{ rotate: progress >= 1 ? 180 : progress * 180 }}
                transition={{ duration: 0.15 }}
                className="w-5 h-5 rounded-full bg-[#B8860B]/20 flex items-center justify-center text-[#E5C158]"
              >
                <ArrowDown className="w-3.5 h-3.5" />
              </motion.div>
              <span className="text-xs font-serif font-medium text-[#DCD5C8]">
                {progress >= 1
                  ? isBn
                    ? 'ছেড়ে দিন রিফ্রেশ করতে'
                    : 'Release to refresh'
                  : isBn
                  ? 'নিচে টানুন রিফ্রেশ করতে'
                  : 'Pull down to refresh'}
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Content Viewport Shift */}
      <div
        style={{
          transform: `translateY(${pullDistance}px)`,
          transition: isPullingRef.current ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
        }}
      >
        {children}
      </div>
    </div>
  );
}
