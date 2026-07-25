import React, { useState } from 'react';
import { Search, Package } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';

export function OrderTracking() {
  const { language, orders } = useAppContext();
  const t = translations[language];
  
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const order = orders.find(o => o.id.toLowerCase() === searchId.toLowerCase());
    setResult(order || null);
    setSearched(true);
  };

  return (
    <section id="track-order" className="py-24 bg-[#EFECE6] relative overflow-hidden">
      <div className="absolute inset-0 bg-white/40 -z-10" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <span className="text-[10px] font-bold text-[#E8A5B8] uppercase tracking-[0.3em] block mb-2">Order Status</span>
        <h2 className="text-4xl font-serif italic text-[#1E293B] mb-8">{t.trackOrder}</h2>

        <form onSubmit={handleSearch} className="flex max-w-md mx-auto relative mb-12">
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder="e.g. ZOP-123456"
            className="w-full px-6 py-4 pr-16 bg-white border border-[#6A4C6D]/10 rounded-full focus:outline-none focus:border-[#E8A5B8] focus:ring-1 focus:ring-[#E8A5B8] transition-all text-[#1E293B] shadow-sm font-serif italic"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 aspect-square bg-[#1E293B] hover:bg-[#6A4C6D] text-white rounded-full flex items-center justify-center transition-colors shadow-md"
          >
            <Search size={18} strokeWidth={2} />
          </button>
        </form>

        {searched && (
          <div className="bg-white rounded-3xl shadow-sm border border-[#6A4C6D]/5 p-10 text-left animate-in slide-in-from-bottom-4">
            {result ? (
              <div>
                <div className="flex items-center justify-between mb-8 pb-8 border-b border-[#1E293B]/10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#6A4C6D]/5 text-[#6A4C6D] rounded-full flex items-center justify-center">
                      <Package size={20} strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="font-serif italic text-[#1E293B] text-xl">Order #{result.id}</h3>
                      <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest mt-1">Placed on {new Date(result.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div>
                  <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] uppercase tracking-widest font-bold ${
                    result.status === 'completed' ? 'bg-[#25D366]/10 text-[#25D366]' :
                    result.status === 'processing' ? 'bg-[#6A4C6D]/10 text-[#6A4C6D]' :
                    'bg-[#E8A5B8]/10 text-[#E8A5B8]'
                  }`}>
                    {t[result.status as keyof typeof t] || result.status}
                  </span>
                  </div>
                </div>

                <div>
                  <h4 className="text-[10px] uppercase font-bold opacity-40 tracking-widest mb-6">Order Details</h4>
                  <div className="space-y-4">
                    {result.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center text-sm border-b border-[#1E293B]/5 pb-4 last:border-0">
                        <span className="font-serif italic text-[#1E293B] text-lg">{language === 'en' ? item.product.titleEn : item.product.titleBn} (x{item.quantity})</span>
                        <span className="font-bold text-[#6A4C6D]">৳{item.product.price * item.quantity}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-6 font-bold text-[#1E293B]">
                      <span className="text-[10px] uppercase font-bold opacity-40 tracking-widest">{t.total}</span>
                      <span className="font-serif italic text-2xl text-[#6A4C6D]">৳{result.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search size={48} className="mx-auto opacity-20 text-[#1E293B] mb-4" strokeWidth={1} />
                <p className="font-serif italic text-[#1E293B]/60 text-lg">{t.orderNotFound}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
