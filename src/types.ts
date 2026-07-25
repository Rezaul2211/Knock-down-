export type Language = 'en' | 'bn';

export type FabricCategory = 'cotton' | 'silk' | 'wool' | 'linen' | 'velvet' | 'blend';
export type PatternType = 'solid' | 'striped' | 'checkered' | 'jacquard' | 'embroidery' | 'herringbone';

export interface FabricSwatch {
  id: string;
  code: string;
  nameEn: string;
  nameBn: string;
  category: FabricCategory;
  weavePattern: string;
  patternType: PatternType;
  primaryColor: string; // CSS color string or hex e.g. #0F172A
  secondaryColor?: string;
  highResImage: string;
  textureImage: string; // Seamless texture pattern image
  weightGsm: number;
  threadCount: string;
  origin: string;
  sheen: 'matte' | 'subtle-glamour' | 'high-gloss' | 'satin-shine';
  breathability: string;
  suitableFor: string[]; // e.g., ['panjabi', 'suits', 'shirts', 'gowns']
  pricePerYard: number;
  surcharge: number; // Extra fee for applying this luxury fabric
  descriptionEn: string;
  descriptionBn: string;
  careInstructionsEn: string;
  careInstructionsBn: string;
  tags: string[];
  inStock: boolean;
}

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
  defaultFabricId?: string;
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
  fabricSwatchId?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  measurements?: MeasurementProfile;
  selectedFabric?: FabricSwatch;
  customPrice?: number;
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
