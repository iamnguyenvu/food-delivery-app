import Card from "@/components/common/Card";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Image, Pressable, Text, View } from "react-native";

type DealItem = {
  id: string;
  restaurantName: string;
  dishName: string;
  image: string;
  discountPercent: number;
  originalPrice: number;
  discountedPrice: number;
};

const SAMPLE_DEALS: DealItem[] = [
  {
    id: "1",
    restaurantName: "Bún Bò Huế Nam Giao",
    dishName: "Bún Bò Huế Nam Giaooooooooooo",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    discountPercent: 50,
    originalPrice: 50000,
    discountedPrice: 25000,
  },
  {
    id: "2",
    restaurantName: "Phở Hà Nội",
    dishName: "Phở Bò",
    image: "https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=400",
    discountPercent: 40,
    originalPrice: 45000,
    discountedPrice: 27000,
  },
  {
    id: "3",
    restaurantName: "Cơm Tấm Sài Gòn",
    dishName: "Cơm Tấm",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    discountPercent: 30,
    originalPrice: 40000,
    discountedPrice: 28000,
  },
];

type TrumDealNgonProps = {
  deals?: DealItem[];
  onViewMore?: () => void;
  onSelectDeal?: (id: string) => void;
};

export default function TrumDealNgon({
  deals = SAMPLE_DEALS,
  onViewMore,
  onSelectDeal,
}: TrumDealNgonProps) {
  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}đ`;
  };

  const renderLargeCard = (deal: DealItem) => (
    <Pressable
      key={deal.id}
      onPress={() => onSelectDeal?.(deal.id)}
      className="h-full active:opacity-80"
    >
      <View className="bg-white rounded-md overflow-hidden h-full">
        {/* Image with Discount Badge */}
        <View className="relative">
          <Image
            source={{ uri: deal.image }}
            className="w-full h-32"
            resizeMode="cover"
          />
          {/* Discount Badge */}
          <View className="absolute top-1 right-1 bg-red-500 px-2 py-1 rounded-md">
            <Text className="text-white text-xs font-bold">
              -{deal.discountPercent}%
            </Text>
          </View>
        </View>

        {/* Content */}
        <View className="p-2 flex-1 justify-between pt-1">
          {/* Restaurant Name */}
          <Text className="text-gray-600 text-xs" numberOfLines={1}>
            {deal.restaurantName}
          </Text>

          {/* Dish Name */}
          <Text
            className="text-gray-900 font-semibold text-lg"
            numberOfLines={2}
          >
            {deal.dishName}
          </Text>

          {/* Price Row */}
          <View className="flex-row items-center">
            <Text className="text-primary-400 font-semibold text-sm mr-2">
              {formatPrice(deal.discountedPrice)}
            </Text>
            <Text className="text-gray-400 text-xs line-through">
              {formatPrice(deal.originalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  const renderSmallCard = (deal: DealItem) => (
    <Pressable
      key={deal.id}
      onPress={() => onSelectDeal?.(deal.id)}
      className="active:opacity-80"
    >
      <View className="bg-white rounded-md overflow-hidden flex-row h-full">
        {/* Image with Discount Badge - Left Side */}
        <View className="relative w-28">
          <Image
            source={{ uri: deal.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Discount Badge */}
          <View className="absolute top-1 right-1 bg-red-500 px-1.5 py-0.5 rounded">
            <Text className="text-white text-[10px] font-bold">
              -{deal.discountPercent}%
            </Text>
          </View>
        </View>

        {/* Content - Right Side */}
        <View className="flex-1 p-2 justify-between pt-0">
          <View className="flex-1 justify-center">
            {/* Restaurant Name */}
            <Text className="text-gray-600 text-[12px]" numberOfLines={1}>
              {deal.restaurantName}
            </Text>

            {/* Dish Name */}
            <Text
              className="text-gray-900 font-semibold text-base mb-1"
              numberOfLines={2}
            >
              {deal.dishName}
            </Text>
          </View>

          {/* Price Row */}
          <View className="flex-row items-center">
            <Text className="text-primary-400 font-bold text-sm mr-1.5">
              {formatPrice(deal.discountedPrice)}
            </Text>
            <Text className="text-gray-400 text-[10px] line-through">
              {formatPrice(deal.originalPrice)}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );

  return (
    <Card className="mx-2 mt-2">
      {/* Header with Gradient */}
      <LinearGradient
        colors={["#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#FFFFFF"]}
        locations={[0, 0.15, 0.3, 0.5, 0.8]}
        className="rounded-t-md p-2"
        style={{ borderRadius: 12 }}
      >
        <View className="flex-row items-center justify-between">
          {/* Title */}
          <Text className="text-white text-base font-black my-2">
            TRÙM DEAL NGON
          </Text>

          {/* View More Link */}
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

        {/* Content Body - 2 Column Layout */}
        <View className=" rounded-md" style={{ height: 220 }}>
          <View className="flex-row h-full gap-1">
            {/* Left Column - 3/10 width - Single Large Card */}
            <Card className="flex-[3] mr-2" style={{ height: "89%" }}>
              {deals[0] && renderLargeCard(deals[0])}
            </Card>

            {/* Right Column - 7/10 width - 2 Stacked Cards */}
            <View className="flex-[7]" style={{ gap: 10 }}>
              <Card style={{ height: "42.5%" }}>
                {deals[1] && renderSmallCard(deals[1])}
              </Card>
              <Card style={{ height: "42.5%" }}>
                {deals[2] && renderSmallCard(deals[2])}
              </Card>
            </View>
          </View>
        </View>
      </LinearGradient>
    </Card>
  );
}
