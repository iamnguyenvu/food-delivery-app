import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Banner } from "../types";

export interface UseBannersResult {
  banners: Banner[];
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
}

export function useBanners(): UseBannersResult {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchBanners = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from("banners")
        .select("*")
        .eq("is_active", true)
        .is("deleted_at", null)
        .order("display_order", { ascending: true });

      if (fetchError) {
        throw fetchError;
      }

      const filteredData = (data || []).filter((banner) => {
        const startDate = banner.start_date ? new Date(banner.start_date) : null;
        const endDate = banner.end_date ? new Date(banner.end_date) : null;
        const currentDate = new Date();

        const isAfterStart = !startDate || currentDate >= startDate;
        const isBeforeEnd = !endDate || currentDate <= endDate;

        return isAfterStart && isBeforeEnd;
      });

      const mappedBanners: Banner[] = filteredData.map((banner) => ({
        id: banner.id,
        title: banner.title,
        subtitle: banner.subtitle,
        image: banner.image,
        actionType: banner.action_type,
        actionValue: banner.action_value,
        restaurantId: banner.restaurant_id,
        backgroundColor: banner.background_color,
        textColor: banner.text_color,
        displayOrder: banner.display_order,
        isActive: banner.is_active,
        startDate: banner.start_date,
        endDate: banner.end_date,
        clickCount: banner.click_count,
        impressionCount: banner.impression_count,
        createdAt: banner.created_at,
        updatedAt: banner.updated_at,
        deletedAt: banner.deleted_at,
      }));

      setBanners(mappedBanners);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch banners"));
      setBanners([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  return {
    banners,
    isLoading,
    error,
    refresh: fetchBanners,
  };
}

export async function trackBannerClick(bannerId: string): Promise<void> {
  try {
    await supabase.rpc("increment_banner_clicks", { banner_id: bannerId });
  } catch (error) {
    console.error("Failed to track banner click:", error);
  }
}

export async function trackBannerImpression(bannerId: string): Promise<void> {
  try {
    await supabase.rpc("increment_banner_impressions", { banner_id: bannerId });
  } catch (error) {
    console.error("Failed to track banner impression:", error);
  }
}
