import type { CartItem, Dish } from '@/src/types';
import { create } from 'zustand';

interface CartStore {
  items: CartItem[];
  addItem: (dish: Dish, quantity?: number) => void;
  removeItem: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (dish, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.dish.id === dish.id);

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.dish.id === dish.id
              ? { ...item, quantity: item.quantity + quantity }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { dish, quantity }],
      };
    });
  },

  removeItem: (dishId) => {
    set((state) => ({
      items: state.items.filter((item) => item.dish.id !== dishId),
    }));
  },

  updateQuantity: (dishId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(dishId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.dish.id === dishId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => {
    set({ items: [] });
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => {
      return total + item.dish.price * item.quantity;
    }, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },
}));
