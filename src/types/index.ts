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
