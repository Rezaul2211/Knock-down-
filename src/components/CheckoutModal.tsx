import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, CheckCircle, Printer, MessageCircle, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';
import { Order } from '../types';
import { TailoringJourneyProgressBar } from './TailoringJourneyProgressBar';

interface CheckoutModalProps {
  total: number;
  onClose: () => void;
}

export function CheckoutModal({ total, onClose }: CheckoutModalProps) {
  const { language, cart, clearCart, addOrder, setIsCartOpen } = useAppContext();
  const t = translations[language];
  const isBn = language === 'bn';

  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', paymentMethod: 'cod'
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Lock background page body scroll when modal is open
  useEffect(() => {
    const originalStyle = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder: Order = {
      id: `ZOP-${Math.floor(Math.random() * 1000000)}`,
      date: new Date().toISOString(),
      status: 'processing',
      items: cart,
      total,
      customerDetails: formData
    };
    addOrder(newOrder);
    setCurrentOrder(newOrder);
    clearCart();
    setIsSuccess(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!currentOrder) return;
    const text = `New Order: ${currentOrder.id}%0AAmount: ৳${currentOrder.total}%0AName: ${currentOrder.customerDetails.name}%0APhone: ${currentOrder.customerDetails.phone}`;
    window.open(`https://wa.me/1234567890?text=${text}`, '_blank');
  };

  if (isSuccess && currentOrder) {
    return (
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-[#1E293B]/60 backdrop-blur-xs print:bg-white print:p-0">
        <div className="bg-[#FAF9F6] w-full max-w-2xl max-h-[92vh] sm:rounded-3xl shadow-2xl p-5 sm:p-8 text-center animate-in zoom-in-95 print:shadow-none print:w-full print:max-w-none print:p-4 border border-[#6A4C6D]/10 overflow-y-auto space-y-6">
          <div className="print:hidden flex justify-center">
            <div className="w-14 h-14 bg-[#25D366]/10 rounded-full flex items-center justify-center text-[#25D366]">
              <CheckCircle size={32} />
            </div>
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1E293B] print:text-left">
              {isBn ? 'অর্ডার সফলভাবে গ্রহন করা হয়েছে!' : 'Order Confirmed!'}
            </h2>
            <p className="text-xs text-[#1E293B]/60 print:text-left">
              {isBn ? 'ট্র্যাকিং আইডি:' : 'Tracking Order ID:'} <span className="font-extrabold text-[#1E293B] text-sm">{currentOrder.id}</span>
            </p>
          </div>

          {/* Visual Step-by-step Tailoring Progress Journey Bar */}
          <div className="text-left print:hidden">
            <TailoringJourneyProgressBar
              currentStage="measurement"
              orderId={currentOrder.id}
              allowInteractiveStageChange={true}
            />
          </div>

          <div className="text-left bg-white rounded-2xl p-5 border border-[#6A4C6D]/10 shadow-xs">
            <h3 className="text-[10px] uppercase font-bold text-[#6A4C6D] mb-3 tracking-widest">Tailor Slip Summary</h3>
            <p className="text-xs text-[#1E293B] mb-1"><span className="font-semibold">Customer:</span> {currentOrder.customerDetails.name}</p>
            <p className="text-xs text-[#1E293B] mb-4"><span className="font-semibold">Phone:</span> {currentOrder.customerDetails.phone}</p>
            
            <div className="space-y-3 border-t border-[#1E293B]/10 pt-3">
              {currentOrder.items.map((item, idx) => (
                <div key={idx} className="text-xs">
                  <p className="font-serif italic text-[#1E293B] font-semibold">{isBn ? item.product.titleBn : item.product.titleEn} (x{item.quantity})</p>
                  {item.measurements && (
                    <div className="grid grid-cols-2 gap-1.5 mt-2 text-[10px] text-[#1E293B]/70 bg-[#FAF9F6] p-2.5 rounded-lg border border-[#1E293B]/5">
                      {Object.entries(item.measurements.measurements).map(([k, v]) => (
                        <span key={k} className="capitalize">{k}: {v}"</span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2.5 print:hidden">
            <button
              onClick={handleWhatsApp}
              className="flex-1 py-3.5 bg-[#25D366] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors shadow-md cursor-pointer"
            >
              <MessageCircle size={18} /> {isBn ? 'হোয়াটসঅ্যাপে স্লিপ পাঠান' : 'Send Slip via WhatsApp'}
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 py-3.5 bg-white border border-[#6A4C6D]/20 text-[#1E293B] rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <Printer size={16} /> {isBn ? 'টেইলার স্লিপ প্রিন্ট করুন' : 'Download Tailor Slip'}
            </button>
          </div>

          <div className="pt-2">
            <button
              onClick={() => { onClose(); setIsCartOpen(false); }}
              className="px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {isBn ? 'শপিং চালিয়ে যান' : 'Continue Shopping'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-2 sm:p-4 bg-[#1E293B]/60 backdrop-blur-xs overflow-hidden">
      <div className="relative w-full max-w-md max-h-[88vh] bg-white rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col z-10 overflow-hidden border border-[#6A4C6D]/15 text-left transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Sticky Header with Prominent Back Button */}
        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-5 py-3.5 border-b border-[#6A4C6D]/10 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF9F6] border border-[#6A4C6D]/15 text-xs font-bold text-[#1E293B] hover:bg-[#1E293B] hover:text-white transition-all"
          >
            <ArrowLeft className="w-4 h-4 text-[#6A4C6D]" />
            <span>{isBn ? 'পিছনে যান' : 'Back'}</span>
          </button>

          <h2 className="text-lg font-serif italic text-[#1E293B] font-bold">
            {t.checkoutTitle}
          </h2>

          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full text-[#1E293B] transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 sm:p-7 overflow-y-auto flex-1 bg-white">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#6A4C6D] block">{t.name}</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={isBn ? 'আপনার নাম লিখুন' : 'Full Name'}
                className="w-full bg-[#FAF9F6] border border-[#6A4C6D]/20 rounded-xl px-3 py-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#6A4C6D]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#6A4C6D] block">{t.phone}</label>
              <input
                required
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="017xxxxxxxx"
                className="w-full bg-[#FAF9F6] border border-[#6A4C6D]/20 rounded-xl px-3 py-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#6A4C6D]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#6A4C6D] block">{t.address}</label>
              <textarea
                required
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                placeholder={isBn ? 'সম্পূর্ণ ডেলিভারি ঠিকানা' : 'Full Delivery Address'}
                className="w-full bg-[#FAF9F6] border border-[#6A4C6D]/20 rounded-xl px-3 py-2 text-xs text-[#1E293B] focus:outline-none focus:border-[#6A4C6D]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-bold text-[#6A4C6D] block">{t.paymentMethod}</label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full bg-[#FAF9F6] border border-[#6A4C6D]/20 rounded-xl px-3 py-2.5 text-xs text-[#1E293B] focus:outline-none focus:border-[#6A4C6D]"
              >
                <option value="cod">{t.cod}</option>
                <option value="bkash">{t.bkash}</option>
                <option value="nagad">{t.nagad}</option>
              </select>
            </div>

            <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 p-2.5 rounded-xl text-xs border border-emerald-200">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{isBn ? 'ক্যাশ অন ডেলিভারি সহজ ও সুরক্ষিত' : 'Secure Cash on Delivery Nationwide'}</span>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#6A4C6D]/10 bg-[#FAF9F6] flex items-center justify-between shrink-0">
          <div>
            <span className="text-[9px] uppercase font-bold text-[#1E293B]/50 block">Total Payable</span>
            <span className="text-xl font-serif font-bold italic text-[#6A4C6D]">৳{total}</span>
          </div>

          <button
            type="submit"
            form="checkout-form"
            className="px-8 py-3 bg-[#1E293B] text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-[#6A4C6D] transition-all shadow-md"
          >
            {t.placeOrder}
          </button>
        </div>

      </div>
    </div>
  );
}
