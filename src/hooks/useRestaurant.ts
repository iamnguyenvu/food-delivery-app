import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/src/lib/supabase';
import type { Restaurant, Dish } from '@/src/types';

// ==================== Restaurant Detail Hook ====================

export function useRestaurantDetail(restaurantId: string) {
  return useQuery({
    queryKey: ['restaurant-detail', restaurantId],
    queryFn: async (): Promise<Restaurant | null> => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', restaurantId)
        .single();

      if (error) {
        console.error('Error fetching restaurant detail:', error);
        return null;
      }

      return data;
    },
    enabled: !!restaurantId,
  });
}

// ==================== Restaurant Dishes Hooks ====================

export function useRestaurantDishes(restaurantId: string, category?: string) {
  return useQuery({
    queryKey: ['restaurant-dishes', restaurantId, category],
    queryFn: async (): Promise<Dish[]> => {
      let query = supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .order('display_order')
        .order('created_at', { ascending: false });

      if (category && category !== 'all') {
        query = query.eq('category', category);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching restaurant dishes:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!restaurantId,
  });
}

export function usePopularDishes(restaurantId: string, limit = 5) {
  return useQuery({
    queryKey: ['popular-dishes', restaurantId, limit],
    queryFn: async (): Promise<Dish[]> => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .eq('is_popular', true)
        .order('rating', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching popular dishes:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!restaurantId,
  });
}

export function useBestSellerDishes(restaurantId: string, limit = 5) {
  return useQuery({
    queryKey: ['bestseller-dishes', restaurantId, limit],
    queryFn: async (): Promise<Dish[]> => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .eq('is_best_seller', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching bestseller dishes:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!restaurantId,
  });
}

export function useDiscountedDishes(restaurantId: string, limit = 5) {
  return useQuery({
    queryKey: ['discounted-dishes', restaurantId, limit],
    queryFn: async (): Promise<Dish[]> => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true)
        .not('discount_percent', 'is', null)
        .gt('discount_percent', 0)
        .order('discount_percent', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching discounted dishes:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!restaurantId,
  });
}

// ==================== Restaurant Categories ====================

export function useRestaurantCategories(restaurantId: string) {
  return useQuery({
    queryKey: ['restaurant-categories', restaurantId],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('dishes')
        .select('category')
        .eq('restaurant_id', restaurantId)
        .eq('is_available', true);

      if (error) {
        console.error('Error fetching restaurant categories:', error);
        return [];
      }

      // Get unique categories
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories.filter(Boolean);
    },
    enabled: !!restaurantId,
  });
}

// Sample data fallback (for development/demo)
const SAMPLE_RESTAURANT: Restaurant = {
  id: "sample-restaurant-1",
  name: "Trà Sữa Tuibao",
  description: "Trà sữa ngon, giá rẻ, phục vụ tận tình",
  image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
  coverImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200",
  rating: 4.8,
  deliveryTime: "15-25 phút",
  deliveryFee: 15000,
  categories: ["Trà sữa", "Nước uống"],
  isOpen: true,
  isFavorite: false,
  address: "674 Lê Đức Thọ",
  phone: "0912345678",
  reviewCount: 1250,
  commentCount: 340,
};

const SAMPLE_DISHES: Dish[] = [
  {
    id: "dish-1",
    restaurantId: "sample-restaurant-1",
    name: "Trà sữa trân châu đen",
    description: "Trà sữa thơm ngon với trân châu đen dai giòn",
    price: 25000,
    originalPrice: 30000,
    discountPercent: 17,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    category: "Trà sữa",
    rating: 4.9,
    isAvailable: true,
    isPopular: true,
    isBestSeller: true,
  },
  {
    id: "dish-2", 
    restaurantId: "sample-restaurant-1",
    name: "Trà sữa matcha",
    description: "Trà sữa vị matcha Nhật Bản thơm mát",
    price: 28000,
    image: "https://images.unsplash.com/photo-1594631661960-4c7ef0b27e05?w=400",
    category: "Trà sữa",
    rating: 4.7,
    isAvailable: true,
    isPopular: true,
  },
  {
    id: "dish-3",
    restaurantId: "sample-restaurant-1", 
    name: "Cà phê sữa đá",
    description: "Cà phê phin truyền thống pha sữa đá mát lạnh",
    price: 20000,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    category: "Cà phê",
    rating: 4.6,
    isAvailable: true,
    isBestSeller: true,
  },
  {
    id: "dish-4",
    restaurantId: "sample-restaurant-1",
    name: "Sinh tố bơ",
    description: "Sinh tố bơ béo ngậy, bổ dưỡng",
    price: 22000,
    originalPrice: 25000,
    discountPercent: 12,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400",
    category: "Sinh tố",
    rating: 4.5,
    isAvailable: true,
  },
  {
    id: "dish-5",
    restaurantId: "sample-restaurant-1",
    name: "Nước ép cam tươi",
    description: "Cam tươi vắt 100% không chất bảo quản", 
    price: 18000,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400",
    category: "Nước ép",
    rating: 4.4,
    isAvailable: true,
  },
];

// Export sample data for fallback
export { SAMPLE_RESTAURANT, SAMPLE_DISHES };