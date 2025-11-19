import type { Dish } from "@/src/types";
import { create } from "zustand";

export interface CartItem {
  id: string;
  dish: Dish;
  quantity: number;
  notes: string;
  options: {
    size?: string;
    toppings: string[];
  };
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (
    dish: Dish,
    quantity?: number,
    notes?: string,
    options?: { size?: string; toppings?: string[] },
    price?: number
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  getTotalDiscount: () => number;
  getRestaurantId: () => string | null;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (dish, quantity = 1, notes = "", options, price) => {
    const normalizedOptions = {
      size: options?.size,
      toppings: options?.toppings ?? [],
    };

    const key = `${dish.id}|${normalizedOptions.size ?? ""}|${normalizedOptions.toppings
      .slice()
      .sort()
      .join(",")}|${notes}`;
    const pricePerPortion = price ?? dish.price;

    set((state) => {
      const existingIndex = state.items.findIndex((item) => item.id === key);

      if (existingIndex !== -1) {
        const updatedItems = [...state.items];
        const existing = updatedItems[existingIndex];

        updatedItems[existingIndex] = {
          ...existing,
          quantity: existing.quantity + quantity,
          notes,
        };

        return { items: updatedItems };
      }

      const newItem: CartItem = {
        id: key,
        dish,
        quantity,
        notes,
        options: normalizedOptions,
        price: pricePerPortion,
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },

  updateQuantity: (id, quantity) => {
    if (quantity <= 0) {
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      }));
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.id === id ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalPrice: () =>
    get().items.reduce((sum, item) => sum + item.price * item.quantity, 0),

  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  getTotalDiscount: () =>
    get().items.reduce((total, item) => {
      if (!item.dish.originalPrice) return total;
      const discountPerUnit = item.dish.originalPrice - item.dish.price;
      return total + Math.max(discountPerUnit, 0) * item.quantity;
    }, 0),

  getRestaurantId: () => {
    const firstItem = get().items[0];
    return firstItem ? firstItem.dish.restaurantId : null;
  },
}));
