import { useDish } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Image,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DishDetailScreen() {
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});

  // Fetch dish data based on dishId
  const { data: dish, isLoading } = useDish(dishId || '');

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Đang tải...</Text>
      </SafeAreaView>
    );
  }

  if (!dish) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Món ăn không tồn tại</Text>
      </SafeAreaView>
    );
  }

  const handleBack = () => {
    router.back();
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = Math.max(1, quantity + change);
    setQuantity(newQuantity);
  };

  const handleAddToCart = () => {
    // In real app, would add to cart with selected options
    console.log("Add to cart:", {
      dish: dish.name,
      quantity,
      options: selectedOptions,
      total: dish.price * quantity,
    });
    router.back();
  };

  const handleCustomizePress = () => {
    // Show customization modal
    console.log("Show customization modal for:", dish.name);
  };

  const finalPrice = dish.discountPercent && dish.originalPrice 
    ? dish.price 
    : dish.price;
  const totalPrice = finalPrice * quantity;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
        <Pressable
          onPress={handleBack}
          className="p-2 -ml-2 active:opacity-70"
        >
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </Pressable>

        <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>
          Chi tiết món ăn
        </Text>

        <View className="w-10" />
      </View>

      <ScrollView className="flex-1">
        {/* Dish Image */}
        <View className="h-64 bg-gray-200">
          <Image
            source={{ uri: dish.image }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* Discount Badge */}
          {dish.discountPercent && dish.discountPercent > 0 && (
            <View className="absolute top-4 right-4 bg-red-500 rounded-full px-3 py-1">
              <Text className="text-white text-sm font-bold">
                -{dish.discountPercent}% OFF
              </Text>
            </View>
          )}

          {/* Popular/Bestseller Badges */}
          <View className="absolute top-4 left-4 flex-row gap-2">
            {dish.isPopular && (
              <View className="bg-orange-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">Phổ biến</Text>
              </View>
            )}
            {dish.isBestSeller && (
              <View className="bg-green-500 rounded-full px-2 py-1">
                <Text className="text-white text-xs font-bold">Bán chạy</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dish Info */}
        <View className="p-4">
          {/* Name & Rating */}
          <View className="flex-row items-start justify-between mb-2">
            <Text className="text-xl font-bold text-gray-900 flex-1 mr-4">
              {dish.name}
            </Text>
            {dish.rating && (
              <View className="flex-row items-center">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="text-sm font-semibold text-gray-900 ml-1">
                  {dish.rating.toFixed(1)}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <Text className="text-base text-gray-600 leading-relaxed mb-4">
            {dish.description}
          </Text>

          {/* Price */}
          <View className="flex-row items-center mb-6">
            <Text className="text-2xl font-bold text-primary-500">
              {dish.price.toLocaleString()}đ
            </Text>
            {dish.discountPercent && dish.originalPrice && (
              <Text className="text-lg text-gray-400 line-through ml-3">
                {dish.originalPrice.toLocaleString()}đ
              </Text>
            )}
          </View>

          {/* Spice Level */}
          {dish.spiceLevel && (
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Độ cay
              </Text>
              <View className="flex-row items-center">
                {[1, 2, 3, 4].map((level) => (
                  <Ionicons
                    key={level}
                    name="flame"
                    size={16}
                    color={getSpiceLevelColor(dish.spiceLevel!, level)}
                    style={{ marginRight: 4 }}
                  />
                ))}
                <Text className="text-sm text-gray-600 ml-2 capitalize">
                  {getSpiceLevelText(dish.spiceLevel)}
                </Text>
              </View>
            </View>
          )}

          {/* Ingredients */}
          {dish.ingredients && dish.ingredients.length > 0 && (
            <View className="mb-4">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Thành phần
              </Text>
              <Text className="text-sm text-gray-600">
                {dish.ingredients.join(", ")}
              </Text>
            </View>
          )}

          {/* Allergens */}
          {dish.allergens && dish.allergens.length > 0 && (
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Chất gây dị ứng
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {dish.allergens.map((allergen: string, index: number) => (
                  <View key={index} className="bg-red-50 border border-red-200 rounded-full px-3 py-1">
                    <Text className="text-sm text-red-600">{allergen}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Customization Section */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-900 mb-3">
              Tùy chỉnh món ăn
            </Text>
            <Pressable
              onPress={handleCustomizePress}
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg active:bg-gray-100"
            >
              <View className="flex-row items-center">
                <Ionicons name="options-outline" size={20} color="#6B7280" />
                <Text className="text-base text-gray-700 ml-3">
                  Tùy chọn thêm
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#6B7280" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Cart Section */}
      <View className="bg-white border-t border-gray-200 px-4 py-3">
        {/* Quantity Selector */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-base font-semibold text-gray-900">
            Số lượng
          </Text>
          <View className="flex-row items-center">
            <Pressable
              onPress={() => handleQuantityChange(-1)}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center active:bg-gray-200"
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </Pressable>
            <Text className="text-lg font-semibold text-gray-900 mx-4 min-w-8 text-center">
              {quantity}
            </Text>
            <Pressable
              onPress={() => handleQuantityChange(1)}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center active:bg-gray-200"
            >
              <Ionicons name="add" size={20} color="#374151" />
            </Pressable>
          </View>
        </View>

        {/* Add to Cart Button */}
        <Pressable
          onPress={handleAddToCart}
          className="bg-primary-500 rounded-lg py-4 active:opacity-80"
        >
          <View className="flex-row items-center justify-center">
            <Ionicons name="bag-add-outline" size={20} color="white" />
            <Text className="text-white text-lg font-semibold ml-2">
              Thêm vào giỏ - {totalPrice.toLocaleString()}đ
            </Text>
          </View>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

// Helper functions
function getSpiceLevelColor(spiceLevel: string, level: number): string {
  const levels = {
    mild: 1,
    medium: 2,
    hot: 3,
    very_hot: 4,
  };
  
  const currentLevel = levels[spiceLevel as keyof typeof levels] || 0;
  return level <= currentLevel ? "#EF4444" : "#E5E7EB";
}

function getSpiceLevelText(spiceLevel: string): string {
  const texts = {
    mild: "Nhẹ",
    medium: "Vừa",
    hot: "Cay",
    very_hot: "Rất cay",
  };
  
  return texts[spiceLevel as keyof typeof texts] || "Không cay";
}