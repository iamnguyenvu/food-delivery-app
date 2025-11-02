import { useQuery } from "@tanstack/react-query";
import { supabase } from "../lib/supabase";
import { FlashSale } from "../types";

interface UseFlashSalesOptions {
  limit?: number;
}

export function useFlashSales({ limit = 10 }: UseFlashSalesOptions = {}) {
  const { data, isLoading, error } = useQuery<FlashSale[]>({
    queryKey: ["flashSales", limit],
    queryFn: async () => {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from("flash_sales")
        .select(`
          *,
          dish:dishes(name, image),
          restaurant:restaurants(name)
        `)
        .eq("is_active", true)
        .is("deleted_at", null)
        .lte("valid_from", now)
        .gt("valid_until", now)
        .order("display_order", { ascending: true })
        .order("valid_until", { ascending: true })
        .limit(limit);

      if (error) {
        console.error("Error fetching flash sales:", error);
        throw error;
      }

      // Filter sold out items
      const available = (data || []).filter(
        (item: any) => item.sold_quantity < item.total_quantity
      );

      return available;
    },
    staleTime: 30000, // 30 seconds
    retry: 1,
  });

  return {
    flashSales: data || [],
    isLoading,
    error,
  };
}

export async function trackFlashSaleView(flashSaleId: string) {
  try {
    await supabase.rpc("increment_flash_sale_view", {
      flash_sale_id: flashSaleId,
    });
  } catch (error) {
    console.error("Error tracking flash sale view:", error);
  }
}

export async function trackFlashSaleClick(flashSaleId: string) {
  try {
    await supabase.rpc("increment_flash_sale_click", {
      flash_sale_id: flashSaleId,
    });
  } catch (error) {
    console.error("Error tracking flash sale click:", error);
  }
}
