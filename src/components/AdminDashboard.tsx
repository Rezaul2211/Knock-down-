import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { translations } from '../i18n';
import { Product } from '../types';
import { handleImageError } from '../lib/imageUtils';

export function AdminDashboard() {
  const { language, isAdminOpen, setIsAdminOpen, products, addProduct, updateProduct, deleteProduct } = useAppContext();
  const t = translations[language];

  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});

  if (!isAdminOpen) return null;

  const handleSave = () => {
    if (currentProduct.id) {
      updateProduct(currentProduct as Product);
    } else {
      addProduct({ ...currentProduct, id: crypto.randomUUID() } as Product);
    }
    setIsEditing(false);
    setCurrentProduct({});
  };

  const handleEdit = (p: Product) => {
    setCurrentProduct(p);
    setIsEditing(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setCurrentProduct({ ...currentProduct, [e.target.name]: value });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-[#1E293B]/50 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-2xl bg-[#FAF9F6] h-full shadow-2xl flex flex-col animate-in slide-in-from-right border-l border-[#6A4C6D]/10">
        
        <div className="px-8 py-6 border-b border-[#6A4C6D]/10 flex items-center justify-between bg-white">
          <h2 className="text-2xl font-serif italic text-[#1E293B]">{t.adminDashboard}</h2>
          <button onClick={() => setIsAdminOpen(false)} className="p-2 hover:bg-[#6A4C6D]/5 rounded-full text-[#1E293B] transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {isEditing ? (
            <div className="space-y-6 bg-white p-8 rounded-3xl border border-[#6A4C6D]/5 shadow-sm">
              <h3 className="text-lg font-serif italic text-[#1E293B] mb-6">{currentProduct.id ? t.editProduct : t.addProduct}</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 block mb-1">{t.titleEn}</label>
                  <input name="titleEn" value={currentProduct.titleEn || ''} onChange={handleChange} className="w-full bg-transparent border-b border-[#1E293B]/10 py-2 focus:border-[#E8A5B8] outline-none transition-colors text-sm text-[#1E293B]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 block mb-1">{t.titleBn}</label>
                  <input name="titleBn" value={currentProduct.titleBn || ''} onChange={handleChange} className="w-full bg-transparent border-b border-[#1E293B]/10 py-2 focus:border-[#E8A5B8] outline-none transition-colors text-sm text-[#1E293B]" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 block mb-1">{t.category}</label>
                  <select name="category" value={currentProduct.category || 'men'} onChange={handleChange} className="w-full bg-transparent border-b border-[#1E293B]/10 py-2 focus:border-[#E8A5B8] outline-none transition-colors text-sm text-[#1E293B]">
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold opacity-40 block mb-1">{t.price}</label>
                  <input type="number" name="price" value={currentProduct.price || ''} onChange={handleChange} className="w-full bg-transparent border-b border-[#1E293B]/10 py-2 focus:border-[#E8A5B8] outline-none transition-colors text-sm text-[#1E293B]" />
                </div>
                <div className="col-span-2">
                  <label className="text-[10px] uppercase font-bold opacity-40 block mb-1">{t.image}</label>
                  <input name="image" value={currentProduct.image || ''} onChange={handleChange} className="w-full bg-transparent border-b border-[#1E293B]/10 py-2 focus:border-[#E8A5B8] outline-none transition-colors text-sm text-[#1E293B]" placeholder="URL or Base64" />
                </div>
                <div className="col-span-2 flex items-center gap-2 mt-4">
                  <input type="checkbox" name="isCustomizable" checked={currentProduct.isCustomizable || false} onChange={handleChange} id="isCust" className="accent-[#E8A5B8]" />
                  <label htmlFor="isCust" className="text-[10px] uppercase font-bold tracking-widest text-[#1E293B]">Allows Custom Measurements</label>
                </div>
              </div>
              <div className="flex gap-4 pt-8">
                <button onClick={handleSave} className="flex-1 bg-[#6A4C6D] text-white py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-opacity-90 transition-all">{t.save}</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 bg-white border border-[#E8A5B8] text-[#E8A5B8] py-4 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#E8A5B8]/5 transition-all">{t.cancel}</button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-[#6A4C6D]/5 shadow-sm">
                <h3 className="font-serif italic text-lg text-[#1E293B]">Products Catalog</h3>
                <button onClick={() => { setCurrentProduct({ category: 'men', isCustomizable: true }); setIsEditing(true); }} className="flex items-center gap-2 px-6 py-3 bg-[#E8A5B8] text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all">
                  <Plus size={14} strokeWidth={2.5} /> {t.addProduct}
                </button>
              </div>
              
              <div className="space-y-4">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-white border border-[#6A4C6D]/5 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-4">
                      <img src={p.image} referrerPolicy="no-referrer" onError={handleImageError} className="w-16 h-16 object-cover rounded-xl grayscale hover:grayscale-0 transition-all" alt="" />
                      <div>
                        <p className="font-serif italic text-[#1E293B] text-lg leading-tight mb-1">{p.titleEn}</p>
                        <p className="text-[10px] uppercase font-bold opacity-40 tracking-widest">{p.category} - ৳{p.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(p)} className="p-3 text-[#1E293B]/50 hover:text-[#E8A5B8] bg-[#FAF9F6] rounded-xl transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteProduct(p.id)} className="p-3 text-[#1E293B]/50 hover:text-red-500 bg-[#FAF9F6] rounded-xl transition-colors"><Trash2 size={16} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
