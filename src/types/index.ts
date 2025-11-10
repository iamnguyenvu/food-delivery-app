export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  description: string;
  image: string;
  rating: number;
  deliveryTime: string; // e.g., "20-30 min"
  deliveryFee: number;
  categories: string[];
  isOpen: boolean;
  isFavorite?: boolean;
  // Extended fields for detail page
  address?: string;
  phone?: string;
  reviewCount?: number;
  commentCount?: number;
  coverImage?: string;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating?: number;
  isFavorite?: boolean;
  isAvailable: boolean;
  // Extended fields
  originalPrice?: number;
  discountPercent?: number;
  isPopular?: boolean;
  isBestSeller?: boolean;
  spiceLevel?: 'mild' | 'medium' | 'hot' | 'very_hot';
  ingredients?: string[];
  allergens?: string[];
}

export interface CartItem {
  dish: Dish;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  userId: string;
  restaurantId: string;
  items: CartItem[];
  total: number;
  deliveryFee: number;
  status: OrderStatus;
  deliveryAddress: Address;
  createdAt: string;
  estimatedDelivery?: string;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  PREPARING = "preparing",
  OUT_FOR_DELIVERY = "out_for_delivery",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Work"
  street: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, any>;
}

export enum NotificationType {
  ORDER_UPDATE = "order_update",
  PROMOTION = "promotion",
  SYSTEM = "system",
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  actionType: "restaurant" | "dish" | "category" | "url" | "coupon" | "none";
  actionValue?: string;
  restaurantId?: string;
  backgroundColor?: string;
  textColor?: string;
  displayOrder: number;
  isActive: boolean;
  startDate?: string;
  endDate?: string;
  clickCount: number;
  impressionCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface FlashSale {
  id: string;
  dish_id: string;
  restaurant_id: string;
  title: string;
  description?: string;
  image?: string;
  original_price: number;
  flash_sale_price: number;
  discount_percent: number;
  total_quantity: number;
  sold_quantity: number;
  max_per_user: number;
  valid_from: string;
  valid_until: string;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  click_count: number;
  dish?: {
    name: string;
    image: string;
  };
  restaurant?: {
    name: string;
  };
}

export interface SearchHistory {
  id: string;
  user_id: string;
  search_query: string;
  search_type: 'general' | 'restaurant' | 'dish' | 'category';
  result_count: number;
  created_at: string;
  updated_at: string;
}

export interface SearchSuggestion {
  id: string;
  title: string;
  subtitle?: string;
  image_url?: string;
  suggestion_type: 'dish' | 'restaurant' | 'category' | 'cuisine';
  target_id?: string;
  popularity_score: number;
  is_trending: boolean;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
