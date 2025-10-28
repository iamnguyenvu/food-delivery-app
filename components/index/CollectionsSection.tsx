import Card from "@/components/common/Card";
import {
    Collection,
    trackCollectionClick,
    useCollections,
} from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

interface CollectionItemProps {
  collection: Collection;
  onPress: (collection: Collection) => void;
}

// Collection Item Card
function CollectionItem({ collection, onPress }: CollectionItemProps) {
  const bgColor = collection.bg_color || "#F97316";
  const textColor = collection.text_color || "#FFFFFF";

  return (
    <Pressable
      onPress={() => onPress(collection)}
      className="w-[130px] mr-[9px] active:opacity-80"
    >
      <View className="items-center">
        {/* Image or Icon Container */}
        <View
          className="w-full aspect-square rounded-md mb-2 items-center justify-center overflow-hidden"
          style={{ backgroundColor: bgColor }}
        >
          {collection.image ? (
            <Image
              source={{ uri: collection.image }}
              className="w-full h-full rounded-md"
              resizeMode="cover"
            />
          ) : (
            <Ionicons
              name={(collection.icon as any) || "gift"}
              size={36}
              color={textColor}
            />
          )}
        </View>

        {/* Title */}
        <Text
          className="text-sm font-semibold text-gray-800 leading-tight"
          numberOfLines={2}
        >
          {collection.name}
        </Text>
      </View>
    </Pressable>
  );
}

// Sample data for fallback
const SAMPLE_COLLECTIONS: Collection[] = [
  {
    id: "sample-1",
    name: "Thứ 3 Ăn Ngon, Giảm 30.000Đ",
    slug: "thu-3-an-ngon-30k",
    description: "Giảm giá đặc biệt mỗi thứ 3",
    icon: "restaurant",
    bg_color: "#EF4444",
    text_color: "#FFFFFF",
    display_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-2",
    name: "Đồng Phí Ship, Chỉ 12.000Đ",
    slug: "dong-phi-ship-12k",
    description: "Phí ship ưu đãi",
    icon: "bicycle",
    bg_color: "#3B82F6",
    text_color: "#FFFFFF",
    display_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-3",
    name: "Ăn Ngon Mùa Halloween, Giảm 31.000Đ",
    slug: "halloween-31k",
    description: "Ưu đãi mùa lễ",
    icon: "sparkles",
    bg_color: "#8B5CF6",
    text_color: "#FFFFFF",
    display_order: 3,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-4",
    name: "Giảm 30.000Đ",
    slug: "giam-30k",
    description: "Giảm ngay 30.000Đ cho đơn từ 99.000Đ",
    icon: "pricetag",
    bg_color: "#10B981",
    text_color: "#FFFFFF",
    display_order: 4,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-5",
    name: "Chỉ 12.000Đ",
    slug: "chi-12k",
    description: "Món ngon giá chỉ 12.000Đ",
    icon: "cash",
    bg_color: "#F59E0B",
    text_color: "#FFFFFF",
    display_order: 5,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-6",
    name: "Freeship 0Đ",
    slug: "freeship-0d",
    description: "Miễn phí giao hàng toàn bộ",
    icon: "gift",
    bg_color: "#EC4899",
    text_color: "#FFFFFF",
    display_order: 6,
    is_featured: true,
    is_active: true,
  },
];

// Main Component
interface CollectionsSectionProps {
  maxItems?: number;
}

export default function CollectionsSection({
  maxItems = 6,
}: CollectionsSectionProps) {
  const { data: collections, isLoading, error } = useCollections({
    limit: maxItems,
    featured: true,
  });

  const handleViewAll = () => {
    // Implement later: Navigate to collections list screen
    router.push("/(screens)/collections" as any);
    console.log("View all collections");
  };

  const handleCollectionPress = (collection: Collection) => {
    // Track click
    trackCollectionClick(collection.id);

    // Implement later: Navigate to collection detail screen
    console.log("Collection pressed:", collection.slug);
    router.push(`/(screens)/collection/${collection.slug}` as any);
  };

  // Show loading state
  if (isLoading) {
    return null; // Silent loading, don't show anything
  }

  // If error or no data, use sample data
  const displayCollections =
    !error && collections && collections.length > 0
      ? collections
      : SAMPLE_COLLECTIONS;

  if (!displayCollections || displayCollections.length === 0) {
    return null;
  }

  return (
    <Card 
      className="mx-2 my-3"
      header={{
        title: "Bộ sưu tập",
        onViewAllPress: handleViewAll,
        titleSize: "text-base",
      }}
    >
      {/* Horizontal scroll list */}
      <View className="px-2 pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ alignItems: "flex-start", paddingRight: 12 }}
        >
          {displayCollections.map((collection) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              onPress={handleCollectionPress}
            />
          ))}

          {/* View All card at the end */}
          <Pressable
            onPress={handleViewAll}
            className="w-28 mr-3"
            style={{ maxWidth: 112 }}
          >
            <View className="items-center">
              <View className="w-full aspect-square rounded-md mb-2 items-center justify-center overflow-hidden bg-gray-100">
                <View className="items-center justify-center">
                  <Ionicons name="grid" size={28} color="#26C6DA" />
                </View>
              </View>
              <Text className="text-sm font-semibold text-gray-800 text-center" numberOfLines={2}>
                Xem tất cả
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </Card>
  );
}

