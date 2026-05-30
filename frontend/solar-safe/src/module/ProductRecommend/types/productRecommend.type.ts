// ============================================================
// Product Recommendation — Type Definitions
// ============================================================

// ----- Category -----
// Tabs across the top: Hats, Sunglasses, Sunscreen, Umbrella, UV jacket
export type ProductCategory =
  | "hats"
  | "sunglasses"
  | "sunscreen"
  | "umbrella"
  | "uv-jacket";

export interface CategoryTab {
  value: ProductCategory;
  label: string; // display text, e.g. "UV jacket"
}

// ----- Protection Rating -----
// Gear (hats/umbrella/jacket) uses UPF; sunscreen uses SPF.
export type RatingStandard = "UPF" | "SPF";

export interface ProtectionRating {
  standard: RatingStandard; // "UPF" or "SPF"
  value: number; // e.g. 50
  plus?: boolean; // true => render as "50+" (e.g. "UPF 50+")
}

// ----- Product -----
// One product card: Image, Name, Score, Price, "Add" button
export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number; // Baht (฿)
  imageUrl: string;
  rating: ProtectionRating; // UPF or SPF badge
  protectionScore: number; // 0–100, drives the protection slider/score
  description?: string;
}

// ----- Price Range filter -----
// The "Price Range" checkboxes (multi-select)
export type PriceRangeId = "under-100" | "100-300" | "above-300";

export interface PriceRangeOption {
  id: PriceRangeId;
  label: string; // e.g. "100 - 300 Baht"
  min: number;
  max: number | null; // null = no upper bound ("Above 300 Baht")
}

// ----- Filter state -----
// Current selections in the Filter sidebar.
export interface ProductFilter {
  category: ProductCategory; // active category tab
  priceRanges: PriceRangeId[]; // checked price boxes
  minProtectionScore: number; // slider value, 0 (BASIC) – 100 (MAX)
}

// ----- Protection Loadout (Member 2's shared state) -----
// The "Add" button pushes a Product into this loadout.
export interface LoadoutItem {
  product: Product;
  quantity: number;
}

// ----- Daily Tip -----
export interface DailyTip {
  id: string;
  message: string;
}

// ----- API response shape -----
export interface ProductListResponse {
  products: Product[];
  total: number;
}