export type Language = 'en' | 'bn';

export interface Product {
  id: string;
  titleEn: string;
  titleBn: string;
  category: 'men' | 'women' | 'kids';
  subcategory: string;
  price: number;
  image: string;
  descriptionEn: string;
  descriptionBn: string;
  isCustomizable: boolean;
  material?: string;
  color?: string;
}

export interface MeasurementProfile {
  id: string;
  name: string;
  measurements: {
    length: string;
    chest: string;
    waist: string;
    shoulder: string;
    sleeve: string;
    neck: string;
    hip: string;
    armhole: string;
  };
  customizations: {
    collarStyle: string;
    pocketStyle: string;
    fitPreference: string;
    sleeveFinish: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  measurements?: MeasurementProfile;
}

export interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'completed';
  items: CartItem[];
  total: number;
  customerDetails: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
  };
}
