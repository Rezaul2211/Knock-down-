import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem, Order, Language } from '../types';
import classicNavySuitImg from '../assets/images/classic_navy_suit_1784914135565.jpg';
import whitePanjabiImg from '../assets/images/premium_white_panjabi_1784917554287.jpg';
import designerGownImg from '../assets/images/designer_gown_1784917569904.jpg';
import kidsFrockImg from '../assets/images/kids_frock_1784917586560.jpg';
import kidsPanjabiImg from '../assets/images/kids_panjabi_1784917602406.jpg';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  products: Product[];
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  cart: CartItem[];
  addToCart: (item: CartItem, openCartImmediately?: boolean) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  isAdminOpen: boolean;
  setIsAdminOpen: (isOpen: boolean) => void;
  refreshProducts: () => Promise<void>;
}

const defaultProducts: Product[] = [
  // MEN
  {
    id: 'm1', titleEn: 'Premium White Panjabi', titleBn: 'প্রিমিয়াম সাদা পাঞ্জাবি', category: 'men', subcategory: 'panjabi', price: 3500,
    image: whitePanjabiImg, descriptionEn: 'Elegant white panjabi with intricate embroidery.', descriptionBn: 'সূক্ষ্ম সূচিকর্ম সহ মার্জিত সাদা পাঞ্জাবি।', isCustomizable: true,
    material: 'Cotton', color: 'White'
  },
  {
    id: 'm2', titleEn: 'Classic Navy Suit', titleBn: 'ক্লাসিক নেভি সুট', category: 'men', subcategory: 'suits', price: 12000,
    image: classicNavySuitImg, descriptionEn: 'Tailored fit navy blue formal suit.', descriptionBn: 'টেইলরড ফিট নেভি ব্লু ফর্মাল সুট।', isCustomizable: true,
    material: 'Wool Blend', color: 'Navy'
  },
  {
    id: 'm3', titleEn: 'Cotton Pajama', titleBn: 'সুতির পায়জামা', category: 'men', subcategory: 'pajama', price: 1200,
    image: 'https://images.unsplash.com/photo-1507676184212-d0330a151f15?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Comfortable pure cotton pajama for everyday wear.', descriptionBn: 'প্রতিদিনের পরিধানের জন্য আরামদায়ক খাঁটি সুতির পায়জামা।', isCustomizable: true,
    material: 'Cotton', color: 'White'
  },
  {
    id: 'm4', titleEn: 'Designer Waistcoat', titleBn: 'ডিজাইনার ওয়েস্টকোট', category: 'men', subcategory: 'waistcoat', price: 4500,
    image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Stylish waistcoat to layer over panjabi.', descriptionBn: 'পাঞ্জাবির ওপরে পরার জন্য স্টাইলিশ ওয়েস্টকোট।', isCustomizable: true,
    material: 'Silk Blend', color: 'Black'
  },
  {
    id: 'm5', titleEn: 'Casual Kurta', titleBn: 'ক্যাজুয়াল কুর্তা', category: 'men', subcategory: 'kurta', price: 2500,
    image: 'https://images.unsplash.com/photo-1601614728551-ce0f9e160eaf?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Everyday casual kurta in natural earth tones.', descriptionBn: 'আর্থ টোনে প্রতিদিনের ক্যাজুয়াল কুর্তা।', isCustomizable: true,
    material: 'Linen', color: 'Beige'
  },

  // WOMEN
  {
    id: 'w1', titleEn: 'Luxury Black Abaya', titleBn: 'লাক্সারি কালো আবায়া', category: 'women', subcategory: 'abaya', price: 4500,
    image: 'https://images.unsplash.com/photo-1598961942613-ba897716405b?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Flowing black abaya with crystal detailing.', descriptionBn: 'ক্রিস্টাল ডিটেইলিং সহ প্রবাহিত কালো আবায়া।', isCustomizable: true,
    material: 'Georgette', color: 'Black'
  },
  {
    id: 'w2', titleEn: 'Embroidered Salwar Kameez', titleBn: 'এমব্রয়ডারি সালোয়ার কামিজ', category: 'women', subcategory: 'salwar kameez', price: 5500,
    image: 'https://images.unsplash.com/photo-1583391733958-6932a3fdb36b?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Beautiful three-piece set with heavy embroidery.', descriptionBn: 'ভারী সূচিকর্ম সহ সুন্দর থ্রি-পিস সেট।', isCustomizable: true,
    material: 'Silk', color: 'Red'
  },
  {
    id: 'w3', titleEn: 'Designer Evening Gown', titleBn: 'ডিজাইনার ইভনিং গাউন', category: 'women', subcategory: 'gown', price: 15000,
    image: designerGownImg, descriptionEn: 'Elegant evening gown for special occasions.', descriptionBn: 'বিশেষ অনুষ্ঠানের জন্য মার্জিত ইভনিং গাউন।', isCustomizable: true,
    material: 'Satin', color: 'Green'
  },
  {
    id: 'w4', titleEn: 'Printed Cotton Kurti', titleBn: 'প্রিন্টেড কটন কুর্তি', category: 'women', subcategory: 'kurti', price: 2200,
    image: 'https://images.unsplash.com/photo-1616422285623-13ff0162193c?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Comfortable printed kurti for daily wear.', descriptionBn: 'দৈনন্দিন পরিধানের জন্য আরামদায়ক প্রিন্ট করা কুর্তি।', isCustomizable: true,
    material: 'Cotton', color: 'Blue'
  },
  {
    id: 'w5', titleEn: 'Classic Modest Borka', titleBn: 'ক্লাসিক বোরকা', category: 'women', subcategory: 'borka', price: 3800,
    image: 'https://images.unsplash.com/photo-1605335804565-d0ff78ee9d1b?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Simple and elegant borka for everyday use.', descriptionBn: 'প্রতিদিনের ব্যবহারের জন্য সহজ এবং মার্জিত বোরকা।', isCustomizable: true,
    material: 'Chiffon', color: 'Black'
  },

  // KIDS
  {
    id: 'k1', titleEn: 'Kids Festival Panjabi', titleBn: 'বাচ্চাদের উৎসবের পাঞ্জাবি', category: 'kids', subcategory: 'panjabi', price: 1800,
    image: kidsPanjabiImg, descriptionEn: 'Cute and comfortable panjabi for boys.', descriptionBn: 'ছেলেদের জন্য কিউট এবং আরামদায়ক পাঞ্জাবি।', isCustomizable: true,
    material: 'Cotton', color: 'Yellow'
  },
  {
    id: 'k2', titleEn: 'Fairy Tale Frock', titleBn: 'রূপকথার ফ্রক', category: 'kids', subcategory: 'frock', price: 2500,
    image: kidsFrockImg, descriptionEn: 'Beautiful party frock for little girls.', descriptionBn: 'ছোট মেয়েদের জন্য সুন্দর পার্টি ফ্রক।', isCustomizable: true,
    material: 'Net', color: 'Pink'
  },
  {
    id: 'k3', titleEn: 'Baby Kurta Pajama Set', titleBn: 'বেবি কুর্তা পায়জামা সেট', category: 'kids', subcategory: 'kurta set', price: 2200,
    image: 'https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Soft cotton kurta set for toddlers.', descriptionBn: 'বাচ্চাদের জন্য নরম সুতির কুর্তা সেট।', isCustomizable: true,
    material: 'Cotton', color: 'White'
  },
  {
    id: 'k4', titleEn: 'School Uniform Set', titleBn: 'স্কুল ইউনিফর্ম সেট', category: 'kids', subcategory: 'uniform', price: 1500,
    image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Durable custom tailored school uniform.', descriptionBn: 'টেকসই কাস্টম টেইলরড স্কুল ইউনিফর্ম।', isCustomizable: true,
    material: 'Cotton Poly', color: 'Navy'
  },
  {
    id: 'k5', titleEn: 'Girls Salwar Set', titleBn: 'মেয়েদের সালোয়ার সেট', category: 'kids', subcategory: 'salwar', price: 2800,
    image: 'https://images.unsplash.com/photo-1625824559869-2f5a54db52ad?auto=format&fit=crop&w=800&q=80', descriptionEn: 'Colorful salwar set for young girls.', descriptionBn: 'অল্পবয়সী মেয়েদের জন্য রঙিন সালোয়ার সেট।', isCustomizable: true,
    material: 'Cotton', color: 'Maroon'
  }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');
  const [products, setProducts] = useState<Product[]>(defaultProducts);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    const storedLang = localStorage.getItem('zopono_lang') as Language;
    if (storedLang) setLanguage(storedLang);

    const storedProducts = localStorage.getItem('zopono_products_v6');
    if (storedProducts) {
      const parsed: Product[] = JSON.parse(storedProducts);
      if (parsed && parsed.length > 0) {
        // Ensure default material, color and latest images are hydrated
        const hydrated = parsed.map(p => {
          const match = defaultProducts.find(dp => dp.id === p.id);
          return {
            ...p,
            image: match?.image || p.image,
            material: p.material || match?.material || 'Cotton',
            color: p.color || match?.color || 'Classic'
          };
        });
        setProducts(hydrated);
      }
    } else {
      localStorage.setItem('zopono_products_v6', JSON.stringify(defaultProducts));
    }

    const storedCart = localStorage.getItem('zopono_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedOrders = localStorage.getItem('zopono_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  useEffect(() => {
    localStorage.setItem('zopono_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('zopono_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('zopono_products_v6', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('zopono_orders', JSON.stringify(orders));
  }, [orders]);

  const addProduct = (product: Product) => setProducts(prev => [...prev, product]);
  const updateProduct = (product: Product) => setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(p => p.id !== id));
  
  const addToCart = (item: CartItem, openCartImmediately: boolean = false) => {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === item.product.id && JSON.stringify(i.measurements) === JSON.stringify(item.measurements));
      if (existing) {
        return prev.map(i => i === existing ? { ...i, quantity: i.quantity + item.quantity } : i);
      }
      return [...prev, item];
    });
    if (openCartImmediately) {
      setIsCartOpen(true);
    }
  };
  const removeFromCart = (id: string) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => setCart([]);

  const addOrder = (order: Order) => setOrders(prev => [order, ...prev]);

  const refreshProducts = async () => {
    // Simulate network delay and re-hydrate products
    await new Promise(resolve => setTimeout(resolve, 800));
    const stored = localStorage.getItem('zopono_products_v6');
    if (stored) {
      const parsed: Product[] = JSON.parse(stored);
      if (parsed && parsed.length > 0) {
        const hydrated = parsed.map(p => {
          const match = defaultProducts.find(dp => dp.id === p.id);
          return {
            ...p,
            image: match?.image || p.image,
            material: p.material || match?.material || 'Cotton',
            color: p.color || match?.color || 'Classic'
          };
        });
        setProducts(hydrated);
        return;
      }
    }
    setProducts(defaultProducts);
  };

  return (
    <AppContext.Provider value={{
      language, setLanguage,
      products, addProduct, updateProduct, deleteProduct, refreshProducts,
      cart, addToCart, removeFromCart, clearCart,
      orders, addOrder,
      isCartOpen, setIsCartOpen,
      isAdminOpen, setIsAdminOpen
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
