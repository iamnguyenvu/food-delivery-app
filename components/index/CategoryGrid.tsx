import Card from "@/components/common/Card";
import { useCategories } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = 90;

// Map category names to appropriate icons
function getCategoryIcon(categoryName: string, defaultIcon?: string): string {
  const name = categoryName.toLowerCase();
  
  // Specific mappings
  if (name.includes("mart") || name.includes("giảm 111k")) return "cart";
  if (name.includes("ăn khuya") || name.includes("freeship")) return "restaurant";
  if (name.includes("đặt trước") || name.includes("bữa sáng")) return "cafe";
  if (name.includes("ưu đãi đối tác") || name.includes("đối tác")) return "people";
  if (name.includes("trà sữa") || name.includes("milk tea")) return "wine";
  if (name.includes("cơm") || name.includes("rice")) return "fast-food";
  if (name.includes("dashboard") || name.includes("thống kê")) return "stats-chart";
  if (name.includes("giao hàng") || name.includes("delivery")) return "bicycle";
  if (name.includes("khuyến mãi") || name.includes("giảm giá")) return "pricetag";
  if (name.includes("món mới") || name.includes("new")) return "star";
  if (name.includes("đồ uống") || name.includes("drink")) return "beer";
  if (name.includes("món nướng") || name.includes("bbq")) return "flame";
  if (name.includes("đồ ăn vặt") || name.includes("snack")) return "pizza";
  if (name.includes("tráng miệng") || name.includes("dessert")) return "ice-cream";
  
  return defaultIcon || "help-outline";
}

type CategoryGridProps = {
  onSelectCategory?: (id: string) => void;
};

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const { categories, isLoading } = useCategories();
  const scrollViewRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Calculate how many items visible per screen
  const itemsPerScreen = Math.floor((SCREEN_WIDTH - 32) / ITEM_WIDTH);
  const totalPages = Math.ceil(categories.length / (itemsPerScreen * 2)); // 2 rows

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const pageWidth = itemsPerScreen * ITEM_WIDTH;
    const currentPage = Math.round(offsetX / pageWidth);
    setActiveIndex(currentPage);
  };

  // Split categories into 2 rows
  const row1 = categories.filter((_, index) => index % 2 === 0);
  const row2 = categories.filter((_, index) => index % 2 === 1);

  if (isLoading) {
    return (
      <Card className="mx-2 p-1 py-3 mt-1">
        <View className="items-center justify-center" style={{ height: 180 }}>
          <Text className="text-gray-400">Đang tải...</Text>
        </View>
      </Card>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <Card className="mx-2 p-1 py-3 mt-1">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-2">
        {/* <Text className="text-base font-bold text-gray-800">
        </Text>
        <Pressable className="flex-row items-center">
          <Text className="text-xs text-primary-400 font-medium mr-1">
            Xem tất cả
          </Text>
          <Ionicons name="chevron-forward" size={14} color="#26C6DA" />
        </Pressable> */}
      </View>

      {/* Grid 2 rows with horizontal scroll */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingRight: 8 }}
      >
        <View>
          {/* Row 1 */}
          <View className="flex-row mb-8">
            {row1.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onPress={onSelectCategory}
              />
            ))}
          </View>

          {/* Row 2 */}
          <View className="flex-row">
            {row2.map((category) => (
              <CategoryItem
                key={category.id}
                category={category}
                onPress={onSelectCategory}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Pagination Dots - Similar to BannerCarousel */}
      {totalPages > 1 && (
        <View className="mt-3 flex-row justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <View
              key={i}
              className={
                i === activeIndex
                  ? "w-2 h-2 rounded-full bg-primary-400"
                  : "w-2 h-2 rounded-full bg-gray-300"
              }
            />
          ))}
        </View>
      )}
    </Card>
  );
}

type CategoryItemProps = {
  category: {
    id: string;
    name: string;
    icon?: string;
    image?: string;
    is_special?: boolean;
    bg_color?: string;
  };
  onPress?: (id: string) => void;
};

function CategoryItem({ category, onPress }: CategoryItemProps) {
  const shineAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (category.is_special) {
      // Continuous shine animation for special items
      Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnim, {
            toValue: 100,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.delay(1000),
        ])
      ).start();
    }
  }, [category.is_special, shineAnim]);

  return (
    <Pressable
      onPress={() => onPress?.(category.id)}
      className="items-center mr-2 active:opacity-70"
      style={{ width: ITEM_WIDTH }}
    >
      {/* Icon Container with Special Effect */}
      <View
        className="items-center justify-center rounded-2xl overflow-hidden"
        style={{
          width: 58,
          height: 58,
          backgroundColor: category.bg_color || "#26C6DA",
        }}
      >
        {category.is_special && (
          <Animated.View
            style={{
              position: "absolute",
              top: -50,
              left: -50,
              right: -50,
              bottom: -50,
              transform: [{ translateX: shineAnim }],
            }}
          >
            <LinearGradient
              colors={[
                "transparent",
                "rgba(255,255,255,0.3)",
                "rgba(255,255,255,0.8)",
                "rgba(255,255,255,0.3)",
                "transparent",
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                width: 100,
                height: 200,
                transform: [{ rotate: "45deg" }],
              }}
            />
          </Animated.View>
        )}

        {category.image ? (
          <Image
            source={{ uri: category.image }}
            className="w-7 h-7"
            resizeMode="contain"
          />
        ) : (
          <Ionicons
            name={(getCategoryIcon(category.name, category.icon) as any) || "help-outline"}
            size={28}
            color="white"
          />
        )}
      </View>

      {/* Category Name */}
      <Text
        className="text-xs text-gray-700 text-center font-medium"
        numberOfLines={2}
        style={{ width: ITEM_WIDTH - 8 }}
      >
        {category.name}
      </Text>
    </Pressable>
  );
}
