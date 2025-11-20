import { supabase } from "@/src/lib/supabase";
import type { Address, Location } from "@/src/types/location";
import { useEffect, useState } from "react";

export type SavedAddress = {
  id: string;
  label: "home" | "work" | "other";
  location: Location;
  address: Address;
  isDefault: boolean;
};

export function useAddresses(userId?: string) {
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loading, setLoading] = useState(false);

  // Load addresses from database
  const loadAddresses = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("is_default", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formatted: SavedAddress[] =
        data?.map((item) => ({
          id: item.id,
          label: item.label as "home" | "work" | "other",
          location: {
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
          },
          address: {
            formatted: item.full_address,
            street: item.street || undefined,
            district: item.district || undefined,
            city: item.city || undefined,
          },
          isDefault: item.is_default,
        })) || [];

      setAddresses(formatted);
    } catch (e) {
      console.error("Load addresses error:", e);
    } finally {
      setLoading(false);
    }
  };

  // Save new address
  const saveAddress = async (
    location: Location,
    address: Address,
    label: "home" | "work" | "other" = "other",
    isDefault: boolean = false
  ) => {
    if (!userId) return null;

    try {
      const { data, error } = await supabase
        .from("addresses")
        .insert({
          user_id: userId,
          label,
          full_address: address.formatted,
          street: address.street || null,
          ward: address.district || null,
          district: address.district || null,
          city: address.city || "Chưa xác định", // Required field, provide default
          latitude: location.latitude.toString(),
          longitude: location.longitude.toString(),
          is_default: isDefault,
        })
        .select()
        .single();

      if (error) throw error;

      // Reload addresses
      await loadAddresses();
      return data;
    } catch (e) {
      console.error("Save address error:", e);
      return null;
    }
  };

  // Delete address
  const deleteAddress = async (addressId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from("addresses")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", addressId)
        .eq("user_id", userId);

      if (error) throw error;

      // Reload addresses
      await loadAddresses();
      return true;
    } catch (e) {
      console.error("Delete address error:", e);
      return false;
    }
  };

  useEffect(() => {
    if (userId) {
      loadAddresses();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return {
    addresses,
    loading,
    saveAddress,
    deleteAddress,
    reload: loadAddresses,
  };
}
