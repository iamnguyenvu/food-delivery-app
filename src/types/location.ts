export interface Location {
    latitude: number;
    longitude: number;
}

export interface Address {
    formatted: string;
    country?: string;
    city?: string;
    district?: string;
    street?: string;
}

export interface SavedLocation {
    location: Location;
    address: Address;
    timestamp: string;
}