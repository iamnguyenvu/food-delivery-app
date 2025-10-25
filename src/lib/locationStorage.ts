import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedLocation } from "../types/location";

const LOCATION_KEY = "@food_delivery_location";
const ADDRESSES_KEY = "@food_delivery_saved_addresses";
const MAX_LOCAL_ADDRESSES = 5;

export const LocationStorage = {
  // Current location
  async save(location: SavedLocation): Promise<void> {
    await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location));
  },

  async get(): Promise<SavedLocation | null> {
    try {
      const data = await AsyncStorage.getItem(LOCATION_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  async clear(): Promise<void> {
    await AsyncStorage.removeItem(LOCATION_KEY);
  },

  // Saved addresses list (for guest users, max 5)
  async getSavedAddresses(): Promise<SavedLocation[]> {
    try {
      const data = await AsyncStorage.getItem(ADDRESSES_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  async saveAddress(location: SavedLocation): Promise<void> {
    try {
      const existing = await this.getSavedAddresses();
      
      // Check if address already exists (same coordinates)
      const isDuplicate = existing.some(
        (addr) =>
          addr.location.latitude === location.location.latitude &&
          addr.location.longitude === location.location.longitude
      );

      if (isDuplicate) return;

      // Add new address at the beginning, keep max 5
      const updated = [location, ...existing].slice(0, MAX_LOCAL_ADDRESSES);
      
      await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error("Save address error:", e);
    }
  },

  async removeAddress(timestamp: string): Promise<void> {
    try {
      const existing = await this.getSavedAddresses();
      const filtered = existing.filter((addr) => addr.timestamp !== timestamp);
      await AsyncStorage.setItem(ADDRESSES_KEY, JSON.stringify(filtered));
    } catch (e) {
      console.error("Remove address error:", e);
    }
  },

  async clearSavedAddresses(): Promise<void> {
    await AsyncStorage.removeItem(ADDRESSES_KEY);
  },
};