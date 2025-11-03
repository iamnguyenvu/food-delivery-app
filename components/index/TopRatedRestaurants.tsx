import Card from "@/components/common/Card";
import { Ionicons } from "@expo/vector-icons";
import { useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

interface TopRatedRestaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  categories: string[];
  deliveryTime: string;
  distance?: string;
  isPartner?: boolean;
}

interface TopRatedRestaurantsProps {
  onViewMore?: () => void;
  onSelectRestaurant?: (id: string) => void;
}

// Top Rated Restaurant Item Card
function TopRatedRestaurantCard({
  restaurant,
  onPress,
}: {
  restaurant: TopRatedRestaurant;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className="w-[120px] active:opacity-80"
    >
      <View className="bg-white rounded-md overflow-hidden">
        {/* Image Container */}
        <View className="w-full h-[120px] relative">
          <Image
            source={{ uri: restaurant.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Rating Badge */}
          <View className="absolute top-1 right-1 bg-amber-500 rounded px-1 py-0.5 flex-row items-center gap-1">
            <Ionicons name="star" size={10} color="white" />
            <Text className="text-white text-[10px] font-bold">
              {restaurant.rating.toFixed(1)}
            </Text>
          </View>
          {/* Partner Badge */}
          {restaurant.isPartner && (
            <View className="absolute top-1 left-0 bg-primary-400 px-1 py-0.5">
              <Text className="text-white text-[8px] font-bold">ĐỐI TÁC</Text>
            </View>
          )}
        </View>

        {/* Info Container */}
        <View className="p-1 pb-2">
          {/* Restaurant Name */}
          <Text
            className="text-sm font-bold text-gray-800 leading-tight mb-1"
            numberOfLines={1}
          >
            {restaurant.name}
          </Text>

          {/* Categories */}
          <Text
            className="text-xs text-gray-500 mb-2"
            numberOfLines={1}
          >
            {restaurant.categories.join(", ")}
          </Text>

          {/* Delivery Info */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-0.5">
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text className="text-[10px] text-gray-500">
                {restaurant.deliveryTime}
              </Text>
            </View>
            {restaurant.distance && (
              <View className="flex-row items-center gap-0.5">
                <Ionicons name="location-outline" size={12} color="#9CA3AF" />
                <Text className="text-[10px] text-gray-500">
                  {restaurant.distance}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// Sample data for demonstration
const SAMPLE_RESTAURANTS: TopRatedRestaurant[] = [
  {
    id: "1",
    name: "Phở Lý Quốc Sư",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    rating: 5.0,
    categories: ["Phở", "Món Việt"],
    deliveryTime: "15-25 phút",
    distance: "1.2 km",
    isPartner: true,
  },
  {
    id: "2",
    name: "Bún Chả Hà Nội",
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400",
    rating: 5.0,
    categories: ["Bún", "Nướng"],
    deliveryTime: "20-30 phút",
    distance: "2.1 km",
    isPartner: false,
  },
  {
    id: "3",
    name: "Cơm Niêu Singapore",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    rating: 5.0,
    categories: ["Cơm", "Á"],
    deliveryTime: "25-35 phút",
    distance: "3.5 km",
    isPartner: true,
  },
  {
    id: "4",
    name: "Bánh Mì 37",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
    rating: 5.0,
    categories: ["Bánh Mì", "Việt"],
    deliveryTime: "10-20 phút",
    distance: "0.8 km",
    isPartner: false,
  },
  {
    id: "5",
    name: "Lẩu Thái Tomyum",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    rating: 5.0,
    categories: ["Lẩu", "Thái"],
    deliveryTime: "30-40 phút",
    distance: "4.2 km",
    isPartner: true,
  },
];

export default function TopRatedRestaurants({
  onViewMore,
  onSelectRestaurant,
}: TopRatedRestaurantsProps) {
  const scrollContentStyle = useMemo(() => ({ paddingRight: 12, gap: 10 }), []);
  
  // In a real app, this would fetch from API
  const restaurants = SAMPLE_RESTAURANTS;

  if (restaurants.length === 0) {
    return null;
  }

  return (
    <Card
      className="mx-2 mb-3"
      header={{
        title: "Top quán Rating 5⭐ Có gì Hot?",
        onViewAllPress: onViewMore,
        titleSize: "text-base",
      }}
    >
      {/* Horizontal scroll list */}
      <View className="pl-2 pb-0" >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={scrollContentStyle}
        >
          {restaurants.map((restaurant) => (
            <TopRatedRestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onPress={() => onSelectRestaurant?.(restaurant.id)}
            />
          ))}
        </ScrollView>
      </View>
    </Card>
  );
}
