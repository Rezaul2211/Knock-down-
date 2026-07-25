import React, { useState } from 'react';
import { Search, Package, Sparkles } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';
import { TailoringJourneyProgressBar } from './TailoringJourneyProgressBar';

export function OrderTracking() {
  const { language, orders } = useAppContext();
  const t = translations[language];
  const isBn = language === 'bn';
  
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState<any>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e?: React.FormEvent, idToSearch?: string) => {
    if (e) e.preventDefault();
    const query = idToSearch || searchId;
    if (!query.trim()) return;

    // Look up in actual orders or generate a rich demo tailoring order
    let order = orders.find(o => o.id.toLowerCase() === query.toLowerCase());
    
    if (!order && query.toUpperCase().startsWith('ZOP')) {
      // Demo order fallback for testing order tracking
      order = {
        id: query.toUpperCase(),
        date: new Date().toISOString(),
        status: 'processing',
        total: 7500,
        customerDetails: {
          name: 'Anisur Rahman',
          phone: '01700000000',
          address: 'Gulshan-2, Dhaka',
          paymentMethod: 'bKash Online'
        },
        items: [
          {
            id: 'demo-1',
            quantity: 1,
            product: {
              id: 'm1',
              titleEn: 'Bespoke Royal Panjabi & Pajama Set',
              titleBn: 'বিস্পোক রয়েল পাঞ্জাবি ও পায়জামা সেট',
              price: 7500,
              category: 'men',
              subcategory: 'panjabi',
              image: '',
              descriptionEn: '',
              descriptionBn: '',
              isCustomizable: true
            }
          }
        ]
      } as any;
    }

    setResult(order || null);
    setSearched(true);
  };

  return (
    <section id="track-order" className="py-20 bg-[#FAF9F6] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-10 text-center">
        <span className="text-[10px] font-bold text-amber-700 uppercase tracking-[0.3em] block mb-2">
          {isBn ? 'অর্ডার স্ট্যাটাস' : 'Bespoke Order Journey'}
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mb-4">{t.trackOrder}</h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto mb-8">
          {isBn ? 'আপনার কাস্টম অর্ডারের আইডি টাইপ করে মেজারমেন্ট, সেলাই ও ফাইনাল ইন্সপেকশনের প্রতিটি লাইভ আপডেট চেক করুন।' : 'Track every artisanal stage of your custom garment from master pattern drafting to final steam inspection.'}
        </p>

        <form onSubmit={(e) => handleSearch(e)} className="flex max-w-md mx-auto relative mb-4">
          <input 
            type="text" 
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            placeholder={isBn ? 'উদাহরণ: ZOP-8821' : 'e.g. ZOP-8821'}
            className="w-full px-6 py-4 pr-16 bg-white border border-slate-200 rounded-full focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-all text-slate-900 shadow-sm font-sans text-sm font-semibold"
          />
          <button 
            type="submit"
            className="absolute right-2 top-2 bottom-2 aspect-square bg-slate-900 hover:bg-amber-600 text-white rounded-full flex items-center justify-center transition-colors shadow-md cursor-pointer"
          >
            <Search size={18} strokeWidth={2.5} />
          </button>
        </form>

        {/* Quick Demo Search Chips */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          <span className="text-[11px] text-slate-400 font-semibold">{isBn ? 'ডেমো ট্রাক করুন:' : 'Try Demo Search:'}</span>
          {['ZOP-8821', 'ZOP-5042', 'ZOP-1009'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setSearchId(demoId);
                handleSearch(undefined, demoId);
              }}
              className="px-3 py-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{demoId}</span>
            </button>
          ))}
        </div>

        {searched && (
          <div className="space-y-6 text-left animate-in slide-in-from-bottom-4 duration-300">
            {result ? (
              <div className="space-y-6">
                
                {/* Order Summary Header Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-amber-500/10 text-amber-700 rounded-2xl flex items-center justify-center border border-amber-500/20">
                        <Package size={22} strokeWidth={2} />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-slate-900 text-xl">Order #{result.id}</h3>
                        <p className="text-[11px] uppercase font-bold text-slate-400 tracking-wider mt-0.5">
                          Placed on {new Date(result.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs uppercase tracking-wider font-bold ${
                        result.status === 'completed' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
                        result.status === 'processing' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                        'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {result.status === 'processing' ? (isBn ? 'সেলাই প্রস্তুতকরণ প্রক্রিয়াধীন' : 'In Tailoring Progress') : result.status}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="pt-6">
                    <h4 className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider mb-4">Ordered Garments</h4>
                    <div className="space-y-3">
                      {result.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-xs sm:text-sm border-b border-slate-100 pb-3 last:border-0">
                          <span className="font-bold text-slate-800">
                            {language === 'en' ? item.product.titleEn : item.product.titleBn} (x{item.quantity})
                          </span>
                          <span className="font-serif font-bold text-slate-900">৳{item.product.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center pt-4 font-bold text-slate-900 text-sm">
                        <span className="text-[11px] uppercase font-extrabold text-slate-400 tracking-wider">{t.total}</span>
                        <span className="font-serif font-bold text-xl text-amber-700">৳{result.total}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VISUAL TAILORING JOURNEY STEP-BY-STEP PROGRESS BAR COMPONENT */}
                <TailoringJourneyProgressBar 
                  currentStage={result.status === 'completed' ? 'dispatched' : 'tailoring'}
                  orderId={result.id}
                  allowInteractiveStageChange={true}
                />

              </div>
            ) : (
              <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-10 text-center">
                <Search size={48} className="mx-auto text-slate-300 mb-4" strokeWidth={1.5} />
                <p className="font-serif font-bold text-slate-700 text-lg">{t.orderNotFound}</p>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? 'দয়া করে আপনার রসিদের আইডি সঠিকভাবে টাইপ করেছেন কিনা নিশ্চিত করুন।' : 'Please verify your order tracking code or try one of the demo chips above.'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

