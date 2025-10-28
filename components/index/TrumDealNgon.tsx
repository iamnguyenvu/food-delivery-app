import Card from "@/components/common/Card";
import type { Deal } from "@/src/hooks";
import { useDeals } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

// Sample data for fallback when database is empty
const SAMPLE_DEALS: Deal[] = [
  {
    id: "sample-1",
    restaurant_id: "sample-r1",
    dish_id: "sample-d1",
    title: "Deal Bún Bò Huế",
    original_price: 50000,
    discounted_price: 25000,
    discount_percent: 50,
    valid_from: new Date().toISOString(),
    display_order: 1,
    is_featured: true,
    is_active: true,
    restaurant: { name: "Bún Bò Huế Nam Giao" },
    dish: { 
      name: "Bún Bò Huế",
      image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400"
    }
  },
  {
    id: "sample-2",
    restaurant_id: "sample-r2",
    dish_id: "sample-d2",
    title: "Deal Phở Bò",
    original_price: 45000,
    discounted_price: 27000,
    discount_percent: 40,
    valid_from: new Date().toISOString(),
    display_order: 2,
    is_featured: true,
    is_active: true,
    restaurant: { name: "Phở Hà Nội" },
    dish: { 
      name: "Phở Bò",
      image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400"
    }
  },
  {
    id: "sample-3",
    restaurant_id: "sample-r3",
    dish_id: "sample-d3",
    title: "Deal Cơm Tấm",
    original_price: 40000,
    discounted_price: 28000,
    discount_percent: 30,
    valid_from: new Date().toISOString(),
    display_order: 3,
    is_featured: true,
    is_active: true,
    restaurant: { name: "Cơm Tấm Sài Gòn" },
    dish: { 
      name: "Cơm Tấm Sườn",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
    }
  }
];

type TrumDealNgonProps = {
  onViewMore?: () => void;
  onSelectDeal?: (id: string) => void;
};

export default function TrumDealNgon({
  onViewMore,
  onSelectDeal,
}: TrumDealNgonProps) {
  const { deals: dealsFromDB, isLoading, error } = useDeals({ limit: 3, featured: true });
  
  // Use database deals if available, otherwise use sample data
  const deals = !isLoading && dealsFromDB.length === 0 ? SAMPLE_DEALS : dealsFromDB;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const renderLargeCard = (deal: typeof deals[0]) => {
    if (!deal) return null;
    
    return (
      <Pressable
        key={deal.id}
        onPress={() => onSelectDeal?.(deal.id)}
        className="h-full active:opacity-80"
      >
        <View className="bg-white rounded-md overflow-hidden h-full">
          {/* Image with Discount Badge */}
          <View className="relative">
            <Image
              source={{ uri: deal.dish?.image || "https://via.placeholder.com/400" }}
              className="w-full h-32"
              resizeMode="cover"
            />
            {/* Discount Badge */}
            <View className="absolute top-1 right-1 bg-red-500 px-2 py-1 rounded-md">
              <Text className="text-white text-xs font-bold">
                -{deal.discount_percent}%
              </Text>
            </View>
          </View>

          {/* Content */}
          <View className="p-2 flex-1 justify-between pt-1">
            {/* Restaurant Name */}
            <Text className="text-gray-600 text-xs" numberOfLines={1}>
              {deal.restaurant?.name || ""}
            </Text>

            {/* Dish Name */}
            <Text
              className="text-gray-900 font-semibold text-lg"
              numberOfLines={2}
            >
              {deal.dish?.name || deal.title}
            </Text>

            {/* Price Row */}
            <View className="flex-row items-center">
              <Text className="text-primary-400 font-semibold text-sm mr-2">
                {formatPrice(deal.discounted_price)}
              </Text>
              <Text className="text-gray-400 text-xs line-through">
                {formatPrice(deal.original_price)}
              </Text>
            </View>
          </View>
        </View>
      </Pressable>
    );
  };

  const renderSmallCard = (deal: typeof deals[0]) => {
    if (!deal) return null;
    
    return (
      <Pressable
        key={deal.id}
        onPress={() => onSelectDeal?.(deal.id)}
        className="active:opacity-80"
      >
        <View className="bg-white rounded-md overflow-hidden flex-row h-full">
          {/* Image with Discount Badge - Left Side */}
          <View className="relative w-28">
            <Image
              source={{ uri: deal.dish?.image || "https://via.placeholder.com/400" }}
              className="w-full h-full"
              resizeMode="cover"
            />
            {/* Discount Badge */}
            <View className="absolute top-1 right-1 bg-red-500 px-1.5 py-0.5 rounded">
              <Text className="text-white text-[10px] font-bold">
                -{deal.discount_percent}%
              </Text>
            </View>
          </View>

          {/* Content - Right Side */}
          <View className="flex-1 p-2 justify-between pt-0">
          <View className="flex-1 justify-center">
            {/* Restaurant Name */}
            <Text className="text-gray-600 text-[12px]" numberOfLines={1}>
              {deal.restaurant?.name || ""}
            </Text>

            {/* Dish Name */}
            <Text
              className="text-gray-900 font-semibold text-base mb-1"
              numberOfLines={2}
            >
              {deal.dish?.name || deal.title}
            </Text>
          </View>

          {/* Price Row */}
          <View className="flex-row items-center">
            <Text className="text-primary-400 font-bold text-sm mr-1.5">
              {formatPrice(deal.discounted_price)}
            </Text>
            <Text className="text-gray-400 text-[10px] line-through">
              {formatPrice(deal.original_price)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
};

  if (isLoading) {
    return (
      <Card className="mx-2 mt-2">
        <View className="p-8 items-center justify-center">
          <Text className="text-gray-400">Đang tải deals...</Text>
        </View>
      </Card>
    );
  }

  return (
    <Card className="mx-2 mt-3">
      <LinearGradient
        colors={["#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#FFFFFF"]}
        locations={[0, 0.15, 0.3, 0.5, 0.8]}
        className="rounded-t-md p-2 pb-0"
        style={{ borderRadius: 12 }}
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-white text-base font-black my-2">
            TRÙM DEAL NGON
          </Text>
          <Pressable
            onPress={onViewMore}
            className="flex-row items-center active:opacity-70"
          >
            <Text className="text-white text-sm font-medium mr-1">
              Xem thêm
            </Text>
            <Ionicons name="chevron-forward" size={16} color="white" />
          </Pressable>
        </View>

        <View className="rounded-md" style={{ height: 220 }}>
          <View className="flex-row h-full gap-1">
            <Card className="flex-[3] mr-2" style={{ height: "89%" }}>
              {deals[0] && renderLargeCard(deals[0])}
            </Card>

            <View className="flex-[7]" style={{ gap: 10 }}>
              <Card style={{ height: "42.5%", marginRight: 0 }}>
                {deals[1] && renderSmallCard(deals[1])}
              </Card>
              <Card style={{ height: "42.5%", marginRight: 0 }}>
                {deals[2] && renderSmallCard(deals[2])}
              </Card>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
}
