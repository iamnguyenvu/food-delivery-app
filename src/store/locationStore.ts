import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, Location, SavedLocation } from "../types/location";

type State = {
    location: Location | null;
    address: Address | null;
    savedAddresses: SavedLocation[];
    setAll: (payload: {location: Location, address: Address}) => void;
    saveAddress: (saved: SavedLocation) => void;
    removeSavedAddress: (index: number) => void;
    clear: () => void;
}

export const useLocationStore = create<State>()(
    persist(
        set => ({
            location: null,
            address: null,
            savedAddresses: [],
            // set both at the same time to avoid race conditions and ensure the 2 data pieces match 
            setAll: ({location, address}) => set({location, address}),
            // save address to list
            saveAddress: (saved) => set((state) => ({
                savedAddresses: [...state.savedAddresses, saved]
            })),
            // remove saved address by index
            removeSavedAddress: (index) => set((state) => ({
                savedAddresses: state.savedAddresses.filter((_, i) => i !== index)
            })),
            // clear when user change location or delete location picked
            clear: () => set({location: null, address: null})
        }),
        {
            name: "fd_location_storage", // AsyncStorage key
            partialize: s => ({location: s.location, address: s.address, savedAddresses: s.savedAddresses})
        }
    )
)
// helper create a object to save manually id needed
export const toSaved = (location: Location, address: Address): SavedLocation => ({
    location: location,
    address: address,
    timestamp: new Date().toISOString()
})