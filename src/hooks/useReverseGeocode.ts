import * as ExpoLocation from "expo-location";
import { useEffect, useState } from "react";
import type { Address } from "../types/location";

export function formatAddress(
  item?: ExpoLocation.LocationGeocodedAddress
): Address {
  if (!item) return { formatted: "Việt Nam", street: "Địa chỉ chưa xác định" };

  // Build address string from most specific to general
  // Format: street number + street, ward, district, city
  const parts: string[] = [];
  
  // Street address (most specific)
  let streetPart = "";
  if (item.streetNumber && item.street) {
    streetPart = `${item.streetNumber} ${item.street}`;
    parts.push(streetPart);
  } else if (item.name || item.street) {
    streetPart = item.name || item.street!;
    parts.push(streetPart);
  }
  
  // Ward/Subregion (avoid duplicate with district)
  if (item.subregion && item.subregion !== item.district) {
    parts.push(item.subregion);
  }
  
  // District
  if (item.district) {
    parts.push(item.district);
  }
  
  // City/Province
  if (item.city || item.region) {
    parts.push(item.city || item.region!);
  }
  
  // Always add country if available
  if (item.country) {
    parts.push(item.country);
  }

  const formatted = parts.filter(Boolean).join(", ");

  // If still empty, provide fallback
  return {
    formatted: formatted || item.country || "Việt Nam",
    street: streetPart || item.name || item.street || "Địa chỉ chưa xác định",
    district: (item.district || item.subregion) ?? undefined,
    city: (item.city || item.region) ?? undefined,
    country: item.country ?? "Vietnam",
  };
}

export function useReverseGeocode(lat?: number, lng?: number) {
  const [address, setAdress] = useState<Address>({ formatted: "" });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (lat == null || lng == null) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // Convert coordinates to address
        const res = await ExpoLocation.reverseGeocodeAsync({
          latitude: lat,
          longitude: lng,
        });

        if (!alive) return;

        const formatted = formatAddress(res[0]);
        
        // Geocoding successful - always has a text address now
        setAdress(formatted);
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));

        // On error, use Vietnam as fallback (never show coordinates)
        setAdress({ 
          formatted: "Việt Nam",
          street: "Địa chỉ chưa xác định",
          country: "Vietnam"
        });
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [lat, lng]);

  return { address, loading, err };
}
