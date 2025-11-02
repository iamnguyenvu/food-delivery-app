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
  return (
    <Pressable
      onPress={() => onPress(collection)}
      className="w-[130px] mr-[9px] active:opacity-80"
    >
      <View className="items-center">
        {/* Image Container */}
        <View className="w-full aspect-square rounded-md mb-2 overflow-hidden bg-gray-100">
          <Image
            source={{ uri: collection.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
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
    slug: "thu-3-an-ngon-giam-30k",
    description: "Giảm giá đặc biệt mỗi thứ 3",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    display_order: 1,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-2",
    name: "Đồng Phí Ship, Chỉ 12.000Đ",
    slug: "dong-phi-ship-12k",
    description: "Phí ship ưu đãi",
    image: "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=400",
    display_order: 2,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-3",
    name: "Ăn Ngon Mùa Halloween, Giảm 31.000Đ",
    slug: "halloween-giam-31k",
    description: "Ưu đãi mùa lễ",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400",
    display_order: 3,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-4",
    name: "Giảm 50% Đồ Ăn Vặt",
    slug: "giam-50-do-an-vat",
    description: "Ưu đãi đồ ăn vặt",
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400",
    display_order: 4,
    is_featured: true,
    is_active: true,
  },
  {
    id: "sample-5",
    name: "Combo Tiết Kiệm Chỉ 99K",
    slug: "combo-tiet-kiem-99k",
    description: "Combo siêu hời",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
    display_order: 5,
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
            className="w-[130px] mr-3"
          >
            <View className="items-center">
              <View className="w-full aspect-square rounded-md mb-2 items-center justify-center overflow-hidden">
                <View className="items-center justify-center">
                  <Ionicons name="chevron-forward-circle-outline" size={40} color="#26C6DA" />
              <Text className="text-sm font-semibold text-gray-800 text-center" numberOfLines={2}>
                Xem tất cả
              </Text>
                </View>
              </View>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </Card>
  );
}

