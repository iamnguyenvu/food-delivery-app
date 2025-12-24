import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Dish } from "@/src/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (dish, quantity = 1, notes = "", options, price) => {
    const state = get();
    const currentRestaurantId = state.getRestaurantId();

    // Check if adding from different restaurant
    if (currentRestaurantId && currentRestaurantId !== dish.restaurantId) {
      const { Alert } = require("react-native");

      Alert.alert(
        "Thay đổi nhà hàng?",
        "Giỏ hàng đang có món từ nhà hàng khác. Bạn có muốn xóa giỏ hàng và thêm món mới?",
        [
          {
            text: "Hủy",
            style: "cancel",
          },
          {
            text: "Xóa & Thêm món mới",
            style: "destructive",
            onPress: () => {
              // Clear cart and add new item
              set({ items: [] });

              // Now add the new item
              const normalizedOptions = {
                size: options?.size,
                toppings: options?.toppings ?? [],
              };

              const key = `${dish.id}|${normalizedOptions.size ?? ""}|${normalizedOptions.toppings
                .slice()
                .sort()
                .join(",")}|${notes}`;
              const pricePerPortion = price ?? dish.price;

              const newItem: CartItem = {
                id: key,
                dish,
                quantity,
                notes,
                options: normalizedOptions,
                price: pricePerPortion,
              };

              set({ items: [newItem] });
            },
          },
        ]
      );
      return; // Don't add if user hasn't confirmed
    }

    // Normal flow: Same restaurant or empty cart
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
}),
{
  name: "cart-storage", // AsyncStorage key
  storage: createJSONStorage(() => AsyncStorage),
  version: 1,
}
)
);
