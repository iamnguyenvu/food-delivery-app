import * as ExpoLocation from "expo-location";
import { useEffect, useState } from "react";
import type { Address } from "../types/location";

export function formatAddress(
  item?: ExpoLocation.LocationGeocodedAddress
): Address {
  if (!item) return { formatted: "" };

  // Build address string from most specific to general
  // Format: street number + street, ward, district, city
  const parts: string[] = [];
  
  // Street address (most specific)
  if (item.streetNumber && item.street) {
    parts.push(`${item.streetNumber} ${item.street}`);
  } else if (item.name || item.street) {
    parts.push(item.name || item.street!);
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

  const formatted = parts.filter(Boolean).join(", ");

  return {
    formatted: formatted || "",
    street: item.name || item.street || undefined,
    district: (item.district || item.subregion) ?? undefined,
    city: (item.city || item.region) ?? undefined,
    country: item.country ?? undefined,
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
        
        // If geocoding returned empty, fallback to coordinates
        if (!formatted.formatted) {
          setAdress({ 
            formatted: `${lat.toFixed(6)}, ${lng.toFixed(6)}` 
          });
        } else {
          setAdress(formatted);
        }
      } catch (e: any) {
        if (!alive) return;
        setErr(String(e?.message || e));

        // On error, show coordinates as fallback
        setAdress({ 
          formatted: `${lat.toFixed(6)}, ${lng.toFixed(6)}` 
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
