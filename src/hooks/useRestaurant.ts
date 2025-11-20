import { supabase } from '@/src/lib/supabase';
import type { Dish, Restaurant } from '@/src/types';
import { useQuery } from '@tanstack/react-query';

// ==================== Data Transformation Helpers ====================

// Transform database dish to app format
function transformDishFromDB(dbDish: any): Dish {
  return {
    ...dbDish,
    restaurantId: dbDish.restaurant_id,
    // Use ingredients_json if available, fallback to ingredients array, then to empty array
    ingredients: dbDish.ingredients_json || dbDish.ingredients || [],
    // Use allergens_json if available, fallback to allergens array, then to empty array  
    allergens: dbDish.allergens_json || dbDish.allergens || [],
    // Handle discount_percent vs discount_percentage
    discountPercent: dbDish.discount_percent || dbDish.discount_percentage || undefined,
    // Map boolean flags
    isAvailable: dbDish.is_available ?? true,
    isPopular: dbDish.is_popular ?? false,
    isBestSeller: dbDish.is_best_seller ?? false,
    // Handle price fields
    originalPrice: dbDish.original_price,
  };
}

// Transform database restaurant to app format
function transformRestaurantFromDB(dbRestaurant: any): Restaurant {
  return {
    ...dbRestaurant,
    // Use review_count if available, fallback to total_reviews
    reviewCount: dbRestaurant.review_count || dbRestaurant.total_reviews || 0,
    commentCount: dbRestaurant.comment_count || 0,
    // Handle image fields
    image: dbRestaurant.logo || dbRestaurant.image,
    coverImage: dbRestaurant.cover_image,
    // Handle time fields
    deliveryTime: dbRestaurant.delivery_time_min && dbRestaurant.delivery_time_max
      ? `${dbRestaurant.delivery_time_min}-${dbRestaurant.delivery_time_max} min`
      : '20-30 min',
    deliveryFee: dbRestaurant.delivery_fee || 0,
    // Handle boolean flags
    isOpen: dbRestaurant.is_open ?? true,
    isFavorite: false, // This would come from user preferences
    // Handle categories (array vs jsonb)
    categories: Array.isArray(dbRestaurant.categories) 
      ? dbRestaurant.categories 
      : (dbRestaurant.categories || []),
  };
}

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
        // Return sample data as fallback
        return SAMPLE_RESTAURANT;
      }

      return data ? transformRestaurantFromDB(data) : null;
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

      return data ? data.map(transformDishFromDB) : [];
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
        return SAMPLE_DISHES.filter(d => d.isPopular);
      }

      return data ? data.map(transformDishFromDB) : [];
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
        return SAMPLE_DISHES.filter(d => d.isBestSeller);
      }

      return data ? data.map(transformDishFromDB) : [];
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
        return SAMPLE_DISHES.filter(d => d.discountPercent && d.discountPercent > 0);
      }

      return data ? data.map(transformDishFromDB) : [];
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

// Sample data fallback (matches database schema with proper UUIDs)
const SAMPLE_RESTAURANT: Restaurant = {
  id: "550e8400-e29b-41d4-a716-446655440000",
  name: "Trà Sữa Gong Cha",
  description: "Chuỗi trà sữa nổi tiếng với nhiều hương vị độc đáo",
  image: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400",
  coverImage: "https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=800",
  rating: 4.8,
  deliveryTime: "20-30 min",
  deliveryFee: 15000,
  categories: ["Trà sữa", "Nước uống", "Tráng miệng"],
  isOpen: true,
  isFavorite: false,
  address: "123 Nguyễn Văn Cừ, Quận 5, TP.HCM",
  phone: "+84901234567",
  reviewCount: 1234,
  commentCount: 456,
};

const SAMPLE_DISHES: Dish[] = [
  {
    id: "550e8400-e29b-41d4-a716-446655440001",
    restaurantId: "550e8400-e29b-41d4-a716-446655440000",
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
    ingredients: ["Trà đen", "Sữa tươi", "Trân châu", "Đường đen"],
    allergens: ["Lactose", "Gluten"],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440002", 
    restaurantId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Trà sữa matcha",
    description: "Trà sữa vị matcha Nhật Bản thơm mát",
    price: 28000,
    image: "https://images.unsplash.com/photo-1594631661960-4c7ef0b27e05?w=400",
    category: "Trà sữa",
    rating: 4.7,
    isAvailable: true,
    isPopular: true,
    isBestSeller: false,
    ingredients: ["Matcha", "Sữa tươi", "Trân châu"],
    allergens: ["Lactose"],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440003",
    restaurantId: "550e8400-e29b-41d4-a716-446655440000", 
    name: "Cà phê sữa đá",
    description: "Cà phê phin truyền thống pha sữa đá mát lạnh",
    price: 20000,
    image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400",
    category: "Cà phê",
    rating: 4.6,
    isAvailable: true,
    isPopular: false,
    isBestSeller: true,
    ingredients: ["Cà phê phin", "Sữa đặc", "Đá"],
    allergens: ["Lactose", "Caffeine"],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440004",
    restaurantId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Sinh tố bơ",
    description: "Sinh tố bơ béo ngậy, bổ dưỡng",
    price: 22000,
    originalPrice: 25000,
    discountPercent: 12,
    image: "https://images.unsplash.com/photo-1553909489-cd47e0ef937f?w=400",
    category: "Sinh tố",
    rating: 4.5,
    isAvailable: true,
    isPopular: false,
    isBestSeller: false,
    ingredients: ["Bơ", "Sữa tươi", "Đường", "Đá"],
    allergens: ["Lactose"],
  },
  {
    id: "550e8400-e29b-41d4-a716-446655440005",
    restaurantId: "550e8400-e29b-41d4-a716-446655440000",
    name: "Nước ép cam tươi",
    description: "Cam tươi vắt 100% không chất bảo quản", 
    price: 18000,
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400",
    category: "Nước ép",
    rating: 4.4,
    isAvailable: true,
    isPopular: false,
    isBestSeller: false,
    ingredients: ["Cam tươi"],
    allergens: ["Citrus"],
  },
];

// ==================== Individual Dish Hook ====================

export function useDish(dishId: string) {
  return useQuery({
    queryKey: ['dish', dishId],
    queryFn: async (): Promise<Dish | null> => {
      const { data, error } = await supabase
        .from('dishes')
        .select('*')
        .eq('id', dishId)
        .single();

      if (error) {
        console.error('Error fetching dish:', error);
        // Return sample dish as fallback
        return SAMPLE_DISHES.find(d => d.id === dishId) || SAMPLE_DISHES[0];
      }

      return data ? transformDishFromDB(data) : null;
    },
    enabled: !!dishId,
  });
}

// ==================== Restaurant from Dish Hook ====================

export function useRestaurantFromDish(dishId: string) {
  return useQuery({
    queryKey: ['restaurant-from-dish', dishId],
    queryFn: async (): Promise<{ dish: Dish; restaurant: Restaurant } | null> => {
      // First get the dish
      const { data: dishData, error: dishError } = await supabase
        .from('dishes')
        .select('*, restaurant:restaurants(*)')
        .eq('id', dishId)
        .single();

      if (dishError) {
        console.error('Error fetching dish with restaurant:', dishError);
        // Return sample data as fallback
        const sampleDish = SAMPLE_DISHES.find(d => d.id === dishId) || SAMPLE_DISHES[0];
        return {
          dish: sampleDish,
          restaurant: SAMPLE_RESTAURANT,
        };
      }

      return {
        dish: transformDishFromDB(dishData),
        restaurant: transformRestaurantFromDB(dishData.restaurant),
      };
    },
    enabled: !!dishId,
  });
}

// ==================== Navigation Helper Functions ====================

export function getDishToRestaurantMapping(): Record<string, string> {
  // In real app, this would be fetched from API or derived from data
  // For now, using sample data mapping
  return {
    // Recently viewed dish IDs to restaurant IDs
    '1': 'sample-restaurant-1',
    '2': 'sample-restaurant-1', 
    '3': 'sample-restaurant-1',
    '4': 'sample-restaurant-1',
    // Actual dish IDs to restaurant IDs
    'dish-1': 'sample-restaurant-1',
    'dish-2': 'sample-restaurant-1',
    'dish-3': 'sample-restaurant-1',
    'dish-4': 'sample-restaurant-1',
    'dish-5': 'sample-restaurant-1',
  };
}

// ==================== Top Restaurants Hook ====================

export function useTopRestaurants(limit = 10) {
  return useQuery({
    queryKey: ['top-restaurants', limit],
    queryFn: async (): Promise<Restaurant[]> => {
      const { data, error } = await supabase
        .from('restaurants')
        .select('*')
        .eq('is_active', true)
        .order('rating', { ascending: false })
        .order('review_count', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching top restaurants:', error);
        return [];
      }

      return data ? data.map(transformRestaurantFromDB) : [];
    },
  });
}

// ==================== Mapping Functions ====================

export function getFlashSaleToDishMapping(): Record<string, string> {
  // Map flash sale IDs to dish IDs
  return {
    'sample-fs-1': '550e8400-e29b-41d4-a716-446655440001',
    'sample-fs-2': '550e8400-e29b-41d4-a716-446655440002', 
    'sample-fs-3': '550e8400-e29b-41d4-a716-446655440003',
  };
}

export function getDealToDishMapping(): Record<string, string> {
  // Map deal IDs to dish IDs  
  return {
    'sample-1': '550e8400-e29b-41d4-a716-446655440001',
    'sample-2': '550e8400-e29b-41d4-a716-446655440002',
    'sample-3': '550e8400-e29b-41d4-a716-446655440003',
  };
}

// Export sample data for fallback
export { SAMPLE_DISHES, SAMPLE_RESTAURANT };
