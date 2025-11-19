import AddToCartAnimation from "@/components/common/AddToCartAnimation";
import {
  SAMPLE_DISHES,
  useRestaurantDetail
} from "@/src/hooks";
import { useCartStore } from "@/src/store/cartStore";
import type { Dish } from "@/src/types";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type RestaurantSection = 'flash-sale' | 'discounted' | 'popular' | 'bestseller';

export default function RestaurantDetailScreen() {
  const params = useLocalSearchParams<{
    restaurantId: string;
    dishId?: string;
  }>();
  
  const restaurantId = params.restaurantId;
  const { data: restaurant, isLoading } = useRestaurantDetail(restaurantId);
  
  const [activeSection, setActiveSection] = useState<RestaurantSection>('popular');
  const [isFavorite, setIsFavorite] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  const { addItem } = useCartStore();
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  // Use sample data for now - in real app would fetch from API
  const dishes = SAMPLE_DISHES;
  
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    );
  }
  
  if (!restaurant) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Restaurant not found</Text>
      </View>
    );
  }
  
  const popularDishes = dishes.filter(d => d.isPopular);
  const bestsellerDishes = dishes.filter(d => d.isBestSeller);
  const discountedDishes = dishes.filter(d => d.discountPercent && d.discountPercent > 0);

  const handleBack = () => {
    router.back();
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In real app, would update backend
  };

  const handleDishPress = (dish: Dish) => {
    // Navigate to dish detail
    router.push(`/dish-detail/${dish.id}` as any);
  };

  const handleAddToCart = (dish: Dish, event: any) => {
    event.stopPropagation();
    addItem(dish, 1);
    setShowAddAnimation(true);
  };

  const handleSectionPress = (section: RestaurantSection) => {
    setActiveSection(section);
    // In real app, would scroll to section
  };

  if (!restaurant) {
    return (
      <SafeAreaView className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Quán không tồn tại</Text>
      </SafeAreaView>
    );
  }

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
          {restaurant.name}
        </Text>

        <Pressable
          onPress={handleToggleFavorite}
          className="p-2 -mr-2 active:opacity-70"
        >
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={24} 
            color={isFavorite ? "#EF4444" : "#374151"} 
          />
        </Pressable>
      </View>

      <ScrollView ref={scrollViewRef} className="flex-1">
        {/* Cover Image */}
        <View className="h-48 bg-gray-200">
          <Image
            source={{ uri: restaurant.coverImage || restaurant.image }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        {/* Restaurant Info */}
        <View className="p-4 bg-white border-b border-gray-100">
          {/* Name & Address */}
          <Text className="text-xl font-bold text-gray-900 mb-1">
            {restaurant.name} - {restaurant.address}
          </Text>

          {/* Rating, Reviews, Comments, Delivery Time, Favorite */}
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center flex-1">
              {/* Rating */}
              <View className="flex-row items-center mr-4">
                <Ionicons name="star" size={16} color="#F59E0B" />
                <Text className="text-sm font-semibold text-gray-900 ml-1">
                  {restaurant.rating.toFixed(1)}
                </Text>
                <Text className="text-sm text-gray-500 ml-1">
                  ({restaurant.reviewCount})
                </Text>
              </View>

              {/* Comments */}
              <View className="flex-row items-center mr-4">
                <Ionicons name="chatbubble-outline" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-1">
                  {restaurant.commentCount}
                </Text>
              </View>

              {/* Delivery Time */}
              <View className="flex-row items-center">
                <Ionicons name="time-outline" size={16} color="#6B7280" />
                <Text className="text-sm text-gray-500 ml-1">
                  {restaurant.deliveryTime}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View className="bg-white border-b border-gray-100">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="px-4 py-3"
          >
            <NavTab
              title="Món phổ biến"
              isActive={activeSection === 'popular'}
              onPress={() => handleSectionPress('popular')}
            />
            <NavTab
              title="Flash Sale"
              isActive={activeSection === 'flash-sale'}
              onPress={() => handleSectionPress('flash-sale')}
            />
            <NavTab
              title="Món đang giảm"
              isActive={activeSection === 'discounted'}
              onPress={() => handleSectionPress('discounted')}
            />
            <NavTab
              title="Best Seller"
              isActive={activeSection === 'bestseller'}
              onPress={() => handleSectionPress('bestseller')}
            />
          </ScrollView>
        </View>

        {/* Sections */}
        <View className="bg-gray-50">
          {/* Popular Dishes */}
          <DishSection
            title="Món phổ biến"
            dishes={popularDishes}
            onDishPress={handleDishPress}
            onAddToCart={handleAddToCart}
          />

          {/* Flash Sale - placeholder */}
          <DishSection
            title="Flash Sale"
            dishes={discountedDishes.slice(0, 2)} // Use some discounted dishes as flash sale
            onDishPress={handleDishPress}
            onAddToCart={handleAddToCart}
          />

          {/* Discounted Dishes */}
          <DishSection
            title="Món đang giảm"
            dishes={discountedDishes}
            onDishPress={handleDishPress}
            onAddToCart={handleAddToCart}
          />

          {/* Best Seller */}
          <DishSection
            title="Best Seller"
            dishes={bestsellerDishes}
            onDishPress={handleDishPress}
            onAddToCart={handleAddToCart}
          />
        </View>
      </ScrollView>
      <AddToCartAnimation
        visible={showAddAnimation}
        onComplete={() => setShowAddAnimation(false)}
      />
    </SafeAreaView>
  );
}

// Navigation Tab Component
function NavTab({
  title,
  isActive,
  onPress,
}: {
  title: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`px-4 py-2 mr-2 rounded-full ${
        isActive ? 'bg-primary-500' : 'bg-gray-100'
      }`}
    >
      <Text
        className={`text-sm font-medium ${
          isActive ? 'text-white' : 'text-gray-600'
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );
}

// Dish Section Component
function DishSection({
  title,
  dishes,
  onDishPress,
  onAddToCart,
}: {
  title: string;
  dishes: Dish[];
  onDishPress: (dish: Dish) => void;
  onAddToCart: (dish: Dish, event: any) => void;
}) {
  if (dishes.length === 0) return null;

  return (
    <View className="bg-white mb-2">
      <View className="px-4 py-3 border-b border-gray-100">
        <Text className="text-lg font-bold text-gray-900">
          {title}
        </Text>
      </View>

      <View className="px-4 pb-4">
        {dishes.slice(0, 5).map((dish, index) => (
          <DishCard
            key={dish.id}
            dish={dish}
            onPress={() => onDishPress(dish)}
            onAddToCart={(event) => onAddToCart(dish, event)}
            isLast={index === dishes.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// Dish Card Component (similar to RecentlyViewed layout)
function DishCard({
  dish,
  onPress,
  onAddToCart,
  isLast,
}: {
  dish: Dish;
  onPress: () => void;
  onAddToCart: (event: any) => void;
  isLast: boolean;
}) {
  const hasDiscount = dish.discountPercent && dish.discountPercent > 0;

  return (
    <Pressable
      onPress={onPress}
      className={`flex-row py-3 active:bg-gray-50 ${!isLast ? 'border-b border-gray-100' : ''}`}
    >
      {/* Left: Image */}
      <View className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 mr-3">
        <Image
          source={{ uri: dish.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        
        {/* Discount Badge */}
        {hasDiscount && (
          <View className="absolute top-1 right-1 bg-red-500 rounded px-1 py-0.5">
            <Text className="text-white text-xs font-bold">
              -{dish.discountPercent}%
            </Text>
          </View>
        )}
      </View>

      {/* Right: Info */}
      <View className="flex-1 justify-between">
        {/* Row 1: Name */}
        <Text
          className="text-base font-semibold text-gray-900 leading-tight"
          numberOfLines={2}
        >
          {dish.name}
        </Text>

        {/* Row 2: Description */}
        <Text
          className="text-sm text-gray-500 mt-1"
          numberOfLines={2}
        >
          {dish.description}
        </Text>

        {/* Row 3: Price & Add Button */}
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <Text className="text-base font-bold text-primary-500">
              {dish.price.toLocaleString()}đ
            </Text>
            {hasDiscount && dish.originalPrice && (
              <Text className="text-sm text-gray-400 line-through ml-2">
                {dish.originalPrice.toLocaleString()}đ
              </Text>
            )}
          </View>

          <Pressable
            onPress={onAddToCart}
            className="bg-primary-500 rounded-full w-8 h-8 items-center justify-center active:opacity-80"
          >
            <Ionicons name="add" size={16} color="white" />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}