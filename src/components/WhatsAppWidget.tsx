import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export function WhatsAppWidget() {
  const { language } = useAppContext();
  const isBn = language === 'bn';
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const phoneNumber = '8801954710343';
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    setIsOpen(false);
    setMessage('');
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 p-3 bg-[#25D366] text-white rounded-full shadow-lg shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="WhatsApp Support"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
      </button>

      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[280px] sm:w-[320px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-[#E6E1D8] animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="bg-[#25D366] p-3.5 text-white flex justify-between items-center shrink-0 shadow-sm">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 fill-current" />
              <span className="font-semibold text-sm tracking-wide">
                {isBn ? 'হোয়াটসঅ্যাপ মেসেজ' : 'WhatsApp Message'}
              </span>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="hover:bg-white/20 p-1 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-[#FAF8F5]">
            <p className="text-xs text-slate-600 mb-3 text-center">
              {isBn 
                ? 'আমাদের হোয়াটসঅ্যাপে সরাসরি মেসেজ পাঠান। আমরা দ্রুত উত্তর দিব।'
                : 'Send us a direct message on WhatsApp. We will reply shortly.'}
            </p>
            <form onSubmit={handleSend} className="space-y-3">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isBn ? 'আপনার মেসেজ লিখুন...' : 'Type your message...'}
                className="w-full h-24 bg-white border border-[#E6E1D8] rounded-xl p-3 text-sm focus:outline-none focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] transition-all resize-none"
                required
              />
              <button
                type="submit"
                disabled={!message.trim()}
                className="w-full p-2.5 bg-[#25D366] text-white font-semibold rounded-xl shadow-sm hover:bg-[#20bd5a] disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isBn ? 'সেন্ড করুন' : 'Send Message'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
