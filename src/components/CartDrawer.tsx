import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';
import { CheckoutModal } from './CheckoutModal';
import { handleImageError } from '../lib/imageUtils';

export function CartDrawer() {
  const { language, isCartOpen, setIsCartOpen, cart, removeFromCart } = useAppContext();
  const t = translations[language];
  const isBn = language === 'bn';
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Lock background body scroll when drawer is open
  useEffect(() => {
    if (!isCartOpen) return;
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [isCartOpen]);

  const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-hidden">
        <div className="absolute inset-0 bg-[#1E293B]/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
        
        <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
          <div className="w-full h-full bg-[#FAF9F6] shadow-2xl flex flex-col animate-in slide-in-from-right border-l border-[#6A4C6D]/10">
            
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#6A4C6D]/10 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3 text-[#1E293B]">
                <ShoppingBag className="text-[#6A4C6D]" size={20} strokeWidth={1.5} />
                <h2 className="text-xl font-serif italic">{t.cart} ({cart.length})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-[#6A4C6D]/5 rounded-full text-[#1E293B] transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-[#1E293B]/40 space-y-4">
                  <ShoppingBag size={48} className="opacity-20" strokeWidth={1} />
                  <p className="font-serif italic text-base">Your shopping bag is empty.</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4 p-3.5 bg-white rounded-xl border border-[#6A4C6D]/10 shadow-xs hover:shadow-sm transition-shadow">
                    <img src={item.product.image} alt="Product" referrerPolicy="no-referrer" onError={handleImageError} className="w-20 h-24 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between py-0.5 pr-1">
                      <div>
                        <h4 className="font-serif italic text-base text-[#1E293B] line-clamp-1 font-semibold">
                          {language === 'en' ? item.product.titleEn : item.product.titleBn}
                        </h4>
                        <p className="text-xs text-[#6A4C6D] font-bold mt-1">৳{item.product.price}</p>
                        {item.measurements && (
                          <span className="inline-block mt-2 px-2 py-0.5 bg-[#EFECE6] text-[#6A4C6D] text-[9px] uppercase font-bold tracking-widest rounded">
                            Custom Tailored
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2 border-t border-[#1E293B]/5 pt-2">
                        <span className="text-[10px] font-bold opacity-60 uppercase tracking-widest">Qty: {item.quantity}</span>
                        <button onClick={() => removeFromCart(item.id)} className="text-[#B91C1C] hover:text-red-700 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#6A4C6D]/10 bg-white flex justify-between items-center">
                <div className="flex flex-col">
                  <span className="text-[9px] uppercase font-bold opacity-40 tracking-widest">{t.total}</span>
                  <span className="text-xl font-serif font-bold italic text-[#6A4C6D]">৳{total}</span>
                </div>
                <button 
                  onClick={() => setIsCheckoutOpen(true)}
                  className="px-8 py-3.5 bg-[#1E293B] text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md hover:bg-[#6A4C6D] transition-all"
                >
                  {t.checkout}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isCheckoutOpen && (
        <CheckoutModal total={total} onClose={() => setIsCheckoutOpen(false)} />
      )}
    </>
  );
}
