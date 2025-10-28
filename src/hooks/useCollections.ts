import { supabase } from "@/src/lib/supabase";
import { useQuery } from "@tanstack/react-query";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  bg_color?: string;
  text_color?: string;
  display_order?: number;
  is_featured?: boolean;
  is_active?: boolean;
  click_count?: number;
  view_count?: number;
  valid_from?: string;
  valid_until?: string;
  created_at?: string;
  updated_at?: string;
}

interface UseCollectionsOptions {
  limit?: number;
  featured?: boolean;
}

export function useCollections(options: UseCollectionsOptions = {}) {
  const { limit = 10, featured = false } = options;

  return useQuery({
    queryKey: ["collections", { limit, featured }],
    queryFn: async () => {
      try {
        let query = supabase
          .from("collections")
          .select("*")
          .eq("is_active", true)
          .is("deleted_at", null)
          .order("display_order", { ascending: true })
          .order("created_at", { ascending: false });

        if (featured) {
          query = query.eq("is_featured", true);
        }

        if (limit) {
          query = query.limit(limit);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching collections:", error);
          // Return empty array instead of throwing
          return [];
        }

        return (data || []) as Collection[];
      } catch (error) {
        console.error("Error in useCollections:", error);
        // Return empty array on any error
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1, // Reduce retry attempts
    retryDelay: 1000,
  });
}

// Track collection click
export async function trackCollectionClick(collectionId: string) {
  try {
    const { error } = await supabase.rpc("increment_collection_click", {
      collection_id: collectionId,
    });

    if (error) {
      console.error("Error tracking collection click:", error);
      // Silently fail, don't throw
    }
  } catch (error) {
    console.error("Error tracking collection click:", error);
    // Silently fail, don't throw
  }
}

// Track collection view
export async function trackCollectionView(collectionId: string) {
  try {
    const { error } = await supabase.rpc("increment_collection_view", {
      collection_id: collectionId,
    });

    if (error) {
      console.error("Error tracking collection view:", error);
      // Silently fail, don't throw
    }
  } catch (error) {
    console.error("Error tracking collection view:", error);
    // Silently fail, don't throw
  }
}

export type { UseCollectionsOptions };
