import Card from "@/components/common/Card";
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

type Category = {
  id: string;
  name: string;
  icon?: keyof typeof Ionicons.glyphMap;
  image?: string;
  isSpecial?: boolean; // For metallic shine effect
  bgColor?: string;
};

const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Deal 0đ",
    icon: "flash",
    isSpecial: true,
    bgColor: "#FFD700",
  },
  { id: "2", name: "Ăn khuya", icon: "moon", bgColor: "#8B5CF6" },
  { id: "3", name: "Freeship", icon: "bicycle", bgColor: "#10B981" },
  { id: "4", name: "Món mới", icon: "sparkles", bgColor: "#F59E0B" },
  { id: "5", name: "Bán chạy", icon: "trending-up", bgColor: "#EF4444" },
  { id: "6", name: "Đồ uống", icon: "cafe", bgColor: "#8B4513" },
  { id: "7", name: "Ăn vặt", icon: "fast-food", bgColor: "#EC4899" },
  { id: "8", name: "Món Việt", icon: "restaurant", bgColor: "#06B6D4" },
  { id: "9", name: "Món Á", icon: "fish", bgColor: "#F97316" },
  { id: "10", name: "Món Âu", icon: "pizza", bgColor: "#6366F1" },
  { id: "11", name: "Tráng miệng", icon: "ice-cream", bgColor: "#EC4899" },
  { id: "12", name: "Lẩu nướng", icon: "flame", bgColor: "#DC2626" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const ITEM_WIDTH = 90;
const ITEM_HEIGHT = 100;
const ITEMS_PER_SCREEN = Math.floor((SCREEN_WIDTH - 32) / ITEM_WIDTH);

type CategoryGridProps = {
  onSelectCategory?: (id: string) => void;
};

export default function CategoryGrid({ onSelectCategory }: CategoryGridProps) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const totalWidth = CATEGORIES.length * ITEM_WIDTH;
  const scrollableWidth = totalWidth - (SCREEN_WIDTH - 32);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const progress = Math.min(offsetX / scrollableWidth, 1);
    setScrollProgress(progress);
  };

  // Split categories into 2 rows
  const row1 = CATEGORIES.filter((_, index) => index % 2 === 0);
  const row2 = CATEGORIES.filter((_, index) => index % 2 === 1);

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

      {/* Progress Bar - Centered and shorter */}
      {CATEGORIES.length > ITEMS_PER_SCREEN && (
        <View className="mt-3 items-center">
          <View className="h-1 bg-gray-200 rounded-full overflow-hidden w-32">
            <View
              className="h-full bg-primary-400 rounded-full"
              style={{ width: `${Math.max(scrollProgress * 100, 15)}%` }}
            />
          </View>
        </View>
      )}
    </Card>
  );
}

type CategoryItemProps = {
  category: Category;
  onPress?: (id: string) => void;
};

function CategoryItem({ category, onPress }: CategoryItemProps) {
  const shineAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (category.isSpecial) {
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
  }, [category.isSpecial]);

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
          backgroundColor: category.bgColor || "#26C6DA",
        }}
      >
        {category.isSpecial && (
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
            name={category.icon || "help-outline"}
            size={24}
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
