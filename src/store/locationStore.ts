import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, Location, SavedLocation } from "../types/location";

type State = {
    location: Location | null;
    address: Address | null;
    setAll: (payload: {location: Location, address: Address}) => void;
    clear: () => void;
}

// create store
export const useLocationStore = create<State>()(
    persist(
        set => ({
            location: null,
            address: null,
            // set both at the same time to avoid race conditions and ensure the 2 data pieces match 
            setAll: ({location, address}) => set({location, address}),
            // clear when user change location or delete location picked
            clear: () => set({location: null, address: null})
        }),
        {
            name: "fd_location_storage", // AsyncStorage key
            partialize: s => ({location: s.location, address: s.address})
        }
    )
)
// helper create a object to save manually id needed
export const toSaved = (location: Location, address: Address): SavedLocation => ({
    location: location,
    address: address,
    timestamp: new Date().toISOString()
})