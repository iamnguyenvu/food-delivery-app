import AddToCartAnimation from "@/components/common/AddToCartAnimation";
import DishOptionsModal from "@/components/common/DishOptionsModal";
import { useDish } from "@/src/hooks";
import { useCartStore } from "@/src/store/cartStore";
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

// Mock reviews data
const MOCK_REVIEWS = [
  {
    id: "1",
    userName: "Nguyễn Văn A",
    avatar: "https://i.pravatar.cc/150?img=1",
    rating: 5,
    comment: "Món ăn rất ngon, phục vụ nhanh chóng. Sẽ quay lại!",
    date: "2 ngày trước",
    images: ["https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200"],
  },
  {
    id: "2",
    userName: "Trần Thị B",
    avatar: "https://i.pravatar.cc/150?img=2",
    rating: 4,
    comment: "Món ăn khá ổn, giá hợp lý. Có thể thêm ít nước mắm.",
    date: "1 tuần trước",
    images: [],
  },
  {
    id: "3",
    userName: "Lê Văn C",
    avatar: "https://i.pravatar.cc/150?img=3",
    rating: 5,
    comment: "Tuyệt vời! Đúng gu của tôi",
    date: "2 tuần trước",
    images: [],
  },
];

export default function DishDetailScreen() {
  const { dishId } = useLocalSearchParams<{ dishId: string }>();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  const { addItem } = useCartStore();

  // Mock flash sale data
  const isFlashSale = false; // Set to true to test flash sale UI
  const flashSaleData = {
    endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    sold: 45,
    total: 100,
    flashPrice: 35000,
  };

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

  const handleAddToCart = (
    dishData: any,
    quantity: number,
    selectedOptions: any,
    notes: string
  ) => {
    addItem(dishData, quantity, notes);
    setShowAddAnimation(true);
    // In production, handle options (selectedOptions can be stored in metadata)
    console.log("Added with options:", selectedOptions, notes);
  };

  const handleQuickAdd = () => {
    // Check if dish has options (mock - in production check dish.hasOptions)
    const hasOptions = false;

    if (hasOptions) {
      setShowOptionsModal(true);
    } else {
      addItem(dish, 1);
      setShowAddAnimation(true);
    }
  };

  const averageRating = 4.7;
  const totalReviews = MOCK_REVIEWS.length;

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {/* Banner Image with Transparent Header */}
        <View className="relative">
          <Image
            source={{ uri: dish.image || "https://via.placeholder.com/400x300" }}
            className="w-full h-80"
            resizeMode="cover"
          />

          {/* Transparent Header with Back Button */}
          <View className="absolute top-0 left-0 right-0 pt-12 px-4 pb-4">
            <Pressable
              onPress={handleBack}
              className="w-10 h-10 bg-black/40 rounded-full items-center justify-center active:opacity-70"
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Content */}
        <View className="px-4 py-4">
          {/* Flash Sale Info Row (if applicable) */}
          {isFlashSale && (
            <View className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-3 mb-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <View className="bg-red-500 rounded-full p-1 mr-2">
                    <Ionicons name="flash" size={16} color="white" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-red-600 font-bold text-lg">
                      ₫{flashSaleData.flashPrice.toLocaleString()}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      Đã bán {flashSaleData.sold}/{flashSaleData.total}
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-xs text-gray-500 mb-1">Kết thúc sau</Text>
                  <View className="flex-row gap-1">
                    <View className="bg-red-500 px-2 py-1 rounded">
                      <Text className="text-white text-xs font-bold">02</Text>
                    </View>
                    <Text className="text-red-600 font-bold">:</Text>
                    <View className="bg-red-500 px-2 py-1 rounded">
                      <Text className="text-white text-xs font-bold">45</Text>
                    </View>
                    <Text className="text-red-600 font-bold">:</Text>
                    <View className="bg-red-500 px-2 py-1 rounded">
                      <Text className="text-white text-xs font-bold">30</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Title & Description */}
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            {dish.name}
          </Text>
          <Text className="text-base text-gray-600 leading-relaxed" numberOfLines={3}>
            {dish.description}
          </Text>

          {/* Stats Row */}
          <View className="flex-row items-center mt-4 mb-4">
            <View className="flex-row items-center mr-4">
              <Ionicons name="flame" size={16} color="#EF4444" />
              <Text className="text-sm text-gray-700 ml-1">Đã bán 234</Text>
            </View>
            <View className="flex-row items-center mr-4">
              <Ionicons name="heart" size={16} color="#F59E0B" />
              <Text className="text-sm text-gray-700 ml-1">1.2k yêu thích</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="restaurant" size={16} color="#10B981" />
              <Text className="text-sm text-gray-700 ml-1">Còn 45 phần</Text>
            </View>
          </View>

          {/* Price Row with Add Button (if not flash sale) */}
          {!isFlashSale && (
            <View className="flex-row items-center justify-between py-4 border-t border-b border-gray-200 mb-4">
              <View>
                {dish.originalPrice && dish.discountPercent ? (
                  <>
                    <Text className="text-2xl font-bold text-primary-400">
                      ₫{dish.price.toLocaleString()}
                    </Text>
                    <Text className="text-sm text-gray-400 line-through">
                      ₫{dish.originalPrice.toLocaleString()}
                    </Text>
                  </>
                ) : (
                  <Text className="text-2xl font-bold text-gray-800">
                    ₫{dish.price.toLocaleString()}
                  </Text>
                )}
              </View>
              <Pressable
                onPress={handleQuickAdd}
                className="w-10 h-10 bg-primary-400 rounded-full items-center justify-center active:opacity-70"
              >
                <Ionicons name="add" size={24} color="white" />
              </Pressable>
            </View>
          )}

          {/* Reviews/Ratings Section */}
          <View className="mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Đánh giá từ khách hàng
              </Text>
              <Pressable>
                <Text className="text-sm text-primary-400 font-semibold">
                  Xem tất cả
                </Text>
              </Pressable>
            </View>

            {/* Rating Summary */}
            <View className="bg-gray-50 rounded-lg p-4 mb-4">
              <View className="flex-row items-center">
                <View className="items-center mr-6">
                  <Text className="text-4xl font-bold text-gray-800">
                    {averageRating}
                  </Text>
                  <View className="flex-row mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Ionicons
                        key={star}
                        name={star <= averageRating ? "star" : "star-outline"}
                        size={14}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                  <Text className="text-xs text-gray-500 mt-1">
                    {totalReviews} đánh giá
                  </Text>
                </View>

                <View className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} className="flex-row items-center mb-1">
                      <Text className="text-xs text-gray-600 w-3">{star}</Text>
                      <Ionicons name="star" size={10} color="#F59E0B" />
                      <View className="flex-1 bg-gray-200 h-1.5 rounded-full mx-2">
                        <View
                          className="bg-yellow-400 h-full rounded-full"
                          style={{
                            width: `${star === 5 ? 80 : star === 4 ? 15 : 5}%`,
                          }}
                        />
                      </View>
                      <Text className="text-xs text-gray-500 w-6 text-right">
                        {star === 5 ? "80%" : star === 4 ? "15%" : "5%"}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Recent Reviews */}
            {MOCK_REVIEWS.slice(0, 2).map((review) => (
              <View key={review.id} className="mb-4 pb-4 border-b border-gray-100">
                <View className="flex-row items-start">
                  <Image
                    source={{ uri: review.avatar }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="flex-1 ml-3">
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="font-semibold text-gray-800">
                        {review.userName}
                      </Text>
                      <Text className="text-xs text-gray-400">{review.date}</Text>
                    </View>
                    <View className="flex-row mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= review.rating ? "star" : "star-outline"}
                          size={12}
                          color="#F59E0B"
                        />
                      ))}
                    </View>
                    <Text className="text-sm text-gray-600 leading-relaxed">
                      {review.comment}
                    </Text>
                    {review.images.length > 0 && (
                      <View className="flex-row mt-2 gap-2">
                        {review.images.map((img, idx) => (
                          <Image
                            key={idx}
                            source={{ uri: img }}
                            className="w-16 h-16 rounded-lg"
                          />
                        ))}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Options Modal */}
      <DishOptionsModal
        visible={showOptionsModal}
        dish={dish}
        onClose={() => setShowOptionsModal(false)}
        onAddToCart={handleAddToCart}
      />

      {/* Add to Cart Animation */}
      <AddToCartAnimation
        visible={showAddAnimation}
        onComplete={() => setShowAddAnimation(false)}
      />
    </View>
  );
}