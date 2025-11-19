import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  bg_color: string;
  is_special: boolean;
  display_order: number;
  is_active: boolean;
};

export type Deal = {
  id: string;
  restaurant_id: string;
  dish_id: string;
  title: string;
  description?: string;
  original_price: number;
  discounted_price: number;
  discount_percent: number;
  valid_from: string;
  valid_until?: string;
  display_order: number;
  is_featured: boolean;
  is_active: boolean;
  // Joined data
  restaurant?: {
    name: string;
    logo?: string;
  };
  dish?: {
    name: string;
    image?: string;
  };
};

/**
 * Hook to fetch categories from Supabase
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("categories")
        .select("*")
        .eq("is_active", true)
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (fetchError) throw fetchError;

      setCategories(data || []);
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch categories"));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    categories,
    isLoading,
    error,
    refetch: fetchCategories,
  };
}

/**
 * Hook to fetch deals from Supabase
 */
export function useDeals(options?: { limit?: number; featured?: boolean }) {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const { limit = 3, featured = true } = options || {};

  useEffect(() => {
    fetchDeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, featured]);

  async function fetchDeals() {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from("deals")
        .select(
          `
          *,
          restaurant:restaurants(name, logo),
          dish:dishes(name, image)
        `
        )
        .eq("is_active", true)
        .is("deleted_at", null)
        .or(`valid_until.is.null,valid_until.gt.${new Date().toISOString()}`)
        .order("display_order", { ascending: true });

      if (featured) {
        query = query.eq("is_featured", true);
      }

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      setDeals(data || []);
    } catch (err) {
      console.error("Error fetching deals:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch deals"));
    } finally {
      setIsLoading(false);
    }
  }

  return {
    deals,
    isLoading,
    error,
    refetch: fetchDeals,
  };
}
