import Card from "@/components/common/Card";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useMemo } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

interface RecentlyViewedItem {
  id: string;
  name: string;
  image: string;
  viewedAt: string;
  discount?: string;
  restaurantName?: string;
}

interface RecentlyViewedProps {
  onViewMore?: () => void;
  onSelectItem?: (id: string) => void;
}

// Calculate time ago
function getTimeAgo(dateString: string): string {
  const now = new Date();
  const viewed = new Date(dateString);
  const diffMs = now.getTime() - viewed.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `Đã xem ${diffDays} ngày trước`;
  } else if (diffHours > 0) {
    return `Đã xem ${diffHours} giờ trước`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `Đã xem ${diffMinutes} phút trước`;
  }
}

// Recently Viewed Item Card (Horizontal card with image on left)
function RecentlyViewedItemCard({
  item,
  onPress,
}: {
  item: RecentlyViewedItem;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} className="w-[280px] mr-3 active:opacity-80">
      <View
        className="flex-row bg-white rounded-md overflow-hidden"
        style={{ height: 100 }}
      >
        {/* Left: Image */}
        <View className="w-[100px] h-full">
          <Image
            source={{ uri: item.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Right: Info (3 rows) */}
        <View className="flex-1 px-3 py-2 justify-between">
          {/* Row 1: Title */}
          <Text
            className="text-sm font-semibold text-gray-800 leading-tight"
            numberOfLines={2}
          >
            {item.name}
          </Text>

          {/* Row 2: Time viewed */}
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={14} color="#9CA3AF" />
            <Text className="text-xs text-gray-500 ml-1">
              {getTimeAgo(item.viewedAt)}
            </Text>
          </View>

          {/* Row 3: Discount/Promotion (with thin border) */}
          {item.discount && (
            <View className="border border-primary-400 rounded px-2 py-1 self-start">
              <Text className="text-xs text-primary-400 font-medium">
                {item.discount}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

// Sample data for demonstration (moved outside component to avoid re-render issues)
const SAMPLE_ITEMS: RecentlyViewedItem[] = [
  {
    id: "1",
    name: "Bún Bò Huế Cô Ba",
    image: "https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400",
    viewedAt: "2025-11-02T10:00:00.000Z", // Fixed date instead of dynamic
    discount: "Giảm 30.000đ",
    restaurantName: "Cô Ba Restaurant",
  },
  {
    id: "2",
    name: "Phở Bò Tái Lăn",
    image: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400",
    viewedAt: "2025-11-03T08:00:00.000Z",
    discount: "Freeship 15K",
    restaurantName: "Phở Hà Nội",
  },
  {
    id: "3",
    name: "Cơm Tấm Sườn Bì Chả",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    viewedAt: "2025-11-01T12:00:00.000Z",
    discount: "Giảm 20%",
    restaurantName: "Cơm Tấm Sài Gòn",
  },
  {
    id: "4",
    name: "Bánh Mì Thịt Nướng",
    image: "https://images.unsplash.com/photo-1565299507177-b0ac66763828?w=400",
    viewedAt: "2025-11-03T05:00:00.000Z",
    discount: "Mua 1 tặng 1",
    restaurantName: "Bánh Mì Hòa Mã",
  },
];

export default function RecentlyViewed({ onSelectItem }: RecentlyViewedProps) {
  const handleViewAll = useCallback(() => {
    router.push("/(screens)/recentlyviewed" as any);
  }, []);

  const scrollContentStyle = useMemo(() => ({ paddingRight: 12 }), []);

  // In a real app, this would fetch from local storage or API
  const items = SAMPLE_ITEMS;

  if (items.length === 0) {
    return null;
  }

  return (
    <Card
      className="mx-2 mb-3"
      header={{
        title: "Xem gần đây",
        onViewAllPress: handleViewAll,
        titleSize: "text-base",
      }}
    >
      {/* Horizontal scroll list */}
      <View className="px-2 pb-4" style={{ height: 120 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={scrollContentStyle}
        >
          {items.map((item) => (
            <RecentlyViewedItemCard
              key={item.id}
              item={item}
              onPress={() => onSelectItem?.(item.id)}
            />
          ))}

          {/* View All card at the end */}
          <Pressable
            onPress={handleViewAll}
            className="w-[280px] mr-3 justify-center"
          >
            <View className="items-center justify-center h-full">
              <Ionicons
                name="chevron-forward-circle-outline"
                size={40}
                color="#26C6DA"
              />
              <Text className="text-sm font-semibold text-gray-800 text-center mt-2">
                Xem tất cả
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </Card>
  );
}
