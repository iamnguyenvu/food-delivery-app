import { useDeals } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DealsListScreen() {
  const { deals, isLoading, error } = useDeals({ limit: 50, featured: true });

  const handleBack = () => {
    router.back();
  };

  const handleDealPress = (dealId: string, restaurantId: string) => {
    // Navigate to restaurant detail
    router.push(`/(screens)/restaurant-detail/${restaurantId}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Đang tải...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 justify-center items-center px-4">
          <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
          <Text className="text-gray-500 mt-4 text-center">
            Không thể tải danh sách deal
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <Pressable
          onPress={handleBack}
          className="p-2 -ml-2 active:opacity-70"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </Pressable>
        <View className="flex-1 ml-2">
          <Text className="text-xl font-bold text-gray-800">
            Trùm Deal Ngon 🔥
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">
            {deals.length} deal đang hot
          </Text>
        </View>
      </View>

      {/* Deals Grid */}
      <ScrollView className="flex-1 px-4 py-4">
        <View className="flex-row flex-wrap justify-between">
          {deals.map((deal) => (
            <Pressable
              key={deal.id}
              onPress={() => handleDealPress(deal.id, deal.restaurant_id)}
              className="w-[48%] mb-4 active:opacity-80"
            >
              <View className="bg-white rounded-lg overflow-hidden shadow-sm">
                {/* Image with Discount Badge */}
                <View className="relative">
                  <Image
                    source={{
                      uri:
                        deal.dish?.image ||
                        "https://via.placeholder.com/200",
                    }}
                    className="w-full h-40"
                    resizeMode="cover"
                  />
                  {/* Discount Badge */}
                  <View className="absolute top-2 right-2 bg-red-500 px-2 py-1 rounded-md">
                    <Text className="text-white text-xs font-bold">
                      -{deal.discount_percent}%
                    </Text>
                  </View>

                  {/* Restaurant Name Badge */}
                  <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-2 py-1.5">
                    <Text className="text-white text-xs font-medium" numberOfLines={1}>
                      {deal.restaurant?.name || ""}
                    </Text>
                  </View>
                </View>

                {/* Content */}
                <View className="p-3">
                  {/* Dish Name */}
                  <Text
                    className="text-gray-900 font-semibold text-sm mb-2"
                    numberOfLines={2}
                  >
                    {deal.dish?.name || deal.title}
                  </Text>

                  {/* Price Row */}
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-primary-400 font-bold text-base">
                        ₫{deal.discounted_price.toLocaleString()}
                      </Text>
                      <Text className="text-gray-400 text-xs line-through">
                        ₫{deal.original_price.toLocaleString()}
                      </Text>
                    </View>

                    {/* Quick Add Button */}
                    <Pressable className="w-8 h-8 bg-primary-400 rounded-full items-center justify-center active:opacity-70">
                      <Ionicons name="add" size={18} color="white" />
                    </Pressable>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Empty State */}
        {deals.length === 0 && (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="pricetag-outline" size={64} color="#D1D5DB" />
            <Text className="text-gray-400 mt-4 text-center">
              Chưa có deal nào
            </Text>
          </View>
        )}

        {/* Bottom Padding */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
