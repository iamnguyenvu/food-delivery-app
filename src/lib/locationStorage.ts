import AsyncStorage from "@react-native-async-storage/async-storage";
import type { SavedLocation } from "../types/location";


const LOCATION_KEY = "@food_delivery_location";

export const LocationStorage = {
    async save(location: SavedLocation): Promise<void> {
        await AsyncStorage.setItem(LOCATION_KEY, JSON.stringify(location))
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
    }
}