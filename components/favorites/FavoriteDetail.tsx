import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { FavoriteItem } from "./favoritesMockData";

interface FavoriteDetailProps {
    favorite: FavoriteItem;
    onOrderPress?: () => void;
    onViewRestaurantPress?: () => void;
}

export default function FavoriteDetail({ favorite, onOrderPress, onViewRestaurantPress }: FavoriteDetailProps) {
    return (
        <ScrollView className="flex-1 bg-[#F8FDFE]" showsVerticalScrollIndicator={false}>
            {/* Hero Image Section */}
            <View className="relative">
                <Image
                    source={{ uri: favorite.dish_image }}
                    className="w-full h-56"
                    resizeMode="cover"
                />
                {/* Gradient Overlay */}
                <View
                    className="absolute bottom-0 left-0 right-0 h-24"
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.45)",
                    }}
                />

                {/* Rating Badge */}
                <View className="absolute top-4 right-4">
                    <View
                        className="px-3 py-2 rounded-md flex-row items-center"
                        style={{ 
                            backgroundColor: "rgba(38, 198, 218, 0.95)",
                            shadowColor: "#26C6DA",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.3,
                            shadowRadius: 6,
                            elevation: 5,
                        }}
                    >
                        <Ionicons name="star" size={16} color="#FFFFFF" />
                        <Text className="text-sm text-white font-bold ml-1.5">
                            {favorite.rating.toFixed(1)}
                        </Text>
                    </View>
                </View>

                {/* Favorite Badge */}
                <View className="absolute top-4 left-4">
                    <View
                        className="w-10 h-10 rounded-md items-center justify-center"
                        style={{ 
                            backgroundColor: "rgba(255, 255, 255, 0.95)",
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                            shadowRadius: 4,
                            elevation: 3,
                        }}
                    >
                        <Ionicons name="heart" size={20} color="#EF4444" />
                    </View>
                </View>
            </View>

            {/* Dish Info */}
            <View className="bg-white mx-4 -mt-6 rounded-md p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <Text className="text-lg font-bold text-[#0F172A] mb-3 leading-6">
                    {favorite.dish_name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <View className="flex-1 mr-2">
                        <View className="bg-[#FFFBF0] rounded-md p-2.5 border border-[#FEF3C7]">
                            <View className="flex-row items-center mb-1.5">
                                <Ionicons name="star" size={14} color="#FBBF24" />
                                <Text className="text-[10px] text-gray-600 ml-1.5 font-medium">Đánh giá</Text>
                            </View>
                            <View className="flex-row items-center mb-1.5">
                                <Text className="text-base font-bold text-[#0F172A] mr-1.5">
                                    {favorite.rating.toFixed(1)}
                                </Text>
                                <Text className="text-xs text-gray-500">/ 5.0</Text>
                            </View>
                            <View className="flex-row items-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Ionicons
                                        key={star}
                                        name={star <= Math.round(favorite.rating) ? "star" : "star-outline"}
                                        size={12}
                                        color="#FBBF24"
                                    />
                                ))}
                            </View>
                        </View>
                    </View>

                    <View className="flex-1">
                        <View className="bg-[#E0F7FA] rounded-md p-2.5 border border-[#B2EBF2]">
                            <View className="flex-row items-center mb-1.5">
                                <Ionicons name="location" size={14} color="#26C6DA" />
                                <Text className="text-[10px] text-gray-600 ml-1.5 font-medium">Khoảng cách</Text>
                            </View>
                            <Text className="text-base font-bold text-[#0F172A]">
                                {favorite.distance}
                            </Text>
                            <Text className="text-[10px] text-gray-500 mt-0.5">từ vị trí của bạn</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Restaurant Info */}
            <View className="bg-white mx-4 mt-3 rounded-md p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-md items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                        <Ionicons name="restaurant" size={18} color="#26C6DA" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-[#0F172A]">Nhà hàng</Text>
                        <Text className="text-[10px] text-gray-500 mt-0.5">Thông tin nhà hàng</Text>
                    </View>
                </View>

                <View className="bg-[#F8FDFE] rounded-md p-2.5 border border-[#E0F7FA]">
                    <View className="flex-row items-center">
                        <View className="w-14 h-14 rounded-md mr-3 items-center justify-center" style={{ backgroundColor: "#E0F7FA" }}>
                            <Ionicons name="storefront" size={28} color="#26C6DA" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-base font-bold text-[#0F172A] mb-1.5">
                                {favorite.restaurant_name}
                            </Text>
                            <View className="flex-row items-center bg-white rounded-md px-2 py-1.5 self-start">
                                <Ionicons name="location" size={12} color="#26C6DA" />
                                <Text className="text-xs text-gray-600 ml-1.5 font-medium">
                                    {favorite.distance} từ vị trí của bạn
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Saved Info */}
            <View className="bg-white mx-4 mt-3 rounded-md p-3 border border-[#E6F6F9] mb-3" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-md items-center justify-center mr-2" style={{ backgroundColor: "#FFF5F5" }}>
                        <Ionicons name="heart" size={18} color="#EF4444" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-[#0F172A]">Thông tin đã lưu</Text>
                        <Text className="text-[10px] text-gray-500 mt-0.5">Chi tiết món yêu thích</Text>
                    </View>
                </View>

                <View className="mb-3 pb-3 border-b border-[#F0F9FA]">
                    <View className="flex-row items-center mb-1.5">
                        <Ionicons name="calendar-outline" size={14} color="#26C6DA" />
                        <Text className="text-[10px] text-gray-500 ml-1.5 font-medium">Đã lưu vào</Text>
                    </View>
                    <View className="bg-[#F8FDFE] rounded-md p-2 ml-6 border border-[#E0F7FA]">
                        <Text className="text-xs text-[#0F172A] font-semibold">
                            {favorite.created_at.toLocaleDateString("vi-VN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </Text>
                    </View>
                </View>

                <View>
                    <View className="flex-row items-center mb-1.5">
                        <Ionicons name="barcode-outline" size={14} color="#26C6DA" />
                        <Text className="text-[10px] text-gray-500 ml-1.5 font-medium">Mã món yêu thích</Text>
                    </View>
                    <View className="bg-[#F8FDFE] rounded-md p-2 ml-6 border border-[#E0F7FA]">
                        <Text className="text-xs text-[#0F172A] font-mono font-semibold">
                            {favorite.id}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Action Buttons */}
            <View className="px-4 pb-6">
                <Pressable
                    onPress={onOrderPress}
                    className="bg-[#26C6DA] rounded-md py-3.5 items-center mb-3"
                    style={{
                        shadowColor: "#26C6DA",
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                    }}
                >
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-md items-center justify-center mr-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                            <Ionicons name="cart" size={18} color="#FFFFFF" />
                        </View>
                        <Text className="text-white font-bold text-sm">
                            Đặt ngay
                        </Text>
                    </View>
                </Pressable>

                <Pressable
                    onPress={onViewRestaurantPress}
                    className="bg-white border-2 border-[#26C6DA] rounded-md py-3.5 items-center"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                    }}
                >
                    <View className="flex-row items-center">
                        <View className="w-8 h-8 rounded-md items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                            <Ionicons name="storefront-outline" size={18} color="#26C6DA" />
                        </View>
                        <Text className="text-[#26C6DA] font-bold text-sm">
                            Xem nhà hàng
                        </Text>
                    </View>
                </Pressable>
            </View>
        </ScrollView>
    );
}

