import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import DishOptionsModal from "../common/DishOptionsModal";
import { Dish } from "./OrderTypeAndMock";
import { useCartStore } from "@/src/store/cartStore";

export default function SuggestionSection({ dishes }: { dishes: Dish[] }) {
    return (
        <View className="mt-8 mb-10">
            <View className="flex-row items-center justify-between pr-1 mb-3">
                <Text className="font-bold text-lg">Có thể bạn cũng thích</Text>
                <Pressable className="px-2 py-1">
                    <Text className="text-xs text-[#00ACC1] font-semibold">Xem tất cả</Text>
                </Pressable>
            </View>

            <View>
                {dishes.map((item, index) => (
                    <SuggestionCard key={`${item.id}-${index}`} item={item} />
                ))}
            </View>
        </View>
    );
}

function SuggestionCard({ item }: { item: Dish }) {
    const [showOptionsModal, setShowOptionsModal] = useState(false);
    const { addItem } = useCartStore();

    // Check if dish has options (mock logic - in production, check dish.hasOptions)
    const hasOptions = item.id === "dish1"; // First dish has options

    const handleAddClick = () => {
        if (hasOptions) {
            setShowOptionsModal(true);
        } else {
            // Direct add to cart
            const dishData = {
                id: item.id,
                restaurantId: "sample-restaurant",
                name: item.name,
                description: "Món ăn ngon",
                price: item.price,
                image: item.image,
                category: "food",
                isAvailable: true,
            };
            addItem(dishData, 1);
        }
    };

    const handleAddToCart = (dish: any, quantity: number, selectedOptions: any, notes: string) => {
        // Add to cart with options
        addItem({
            ...dish,
            notes,
            selectedOptions,
        }, quantity);
    };

    return (
        <>
            <Pressable className="flex-row bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-200 active:opacity-90">
                <View>
                    <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl" />
                    <View className="absolute top-1 left-1 px-1.5 py-0.5 rounded-xl bg-primary-400/60">
                        <Text className="text-[10px] text-white">⭐ {item.rating.toFixed(1)}</Text>
                    </View>
                </View>

                <View className="flex-1 ml-3 justify-center">
                    <Text className="font-semibold text-[15px] text-black" numberOfLines={1}>
                        {item.name}
                    </Text>

                    <View className="flex-row items-center mt-1">
                        <View className="px-2 py-0.5 rounded-xl bg-[#FFF4E5]">
                            <Text className="text-orange-600 text-[10px] font-semibold">Gợi ý</Text>
                        </View>
                    </View>
                </View>

                <View className="justify-center">
                    <Pressable 
                        onPress={handleAddClick}
                        className="flex-row items-center px-3 py-1 rounded-lg border border-primary-400 active:opacity-70"
                    >
                        <Ionicons name="add" size={14} color="#26C6DA" />
                        <Text className="text-xs text-primary-400 ml-1 font-medium">Thêm</Text>
                    </Pressable>
                </View>
            </Pressable>

            <DishOptionsModal
                visible={showOptionsModal}
                dish={hasOptions ? {
                    id: item.id,
                    restaurantId: "sample-restaurant",
                    name: item.name,
                    description: "Món ăn ngon, có nhiều lựa chọn size và topping",
                    price: item.price,
                    image: item.image,
                    category: "food",
                    isAvailable: true,
                } : null}
                onClose={() => setShowOptionsModal(false)}
                onAddToCart={handleAddToCart}
            />
        </>
    );
}



