import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import { Dish } from "./OrderTypeAndMock";

export default function SuggestionSection({ dishes }: { dishes: Dish[] }) {
    return (
        <View className="mt-8 mb-10">
            <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                    <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-2"
                        style={{ backgroundColor: "#E0F7FA" }}
                    >
                        <Ionicons name="sparkles" size={18} color="#26C6DA" />
                    </View>
                    <Text className="font-bold text-lg text-[#0F172A]">Có thể bạn cũng thích</Text>
                </View>
                <Pressable className="px-3 py-1.5 rounded-full bg-[#F2FBFD] border border-[#D3F3F7]">
                    <Text className="text-xs text-[#26C6DA] font-semibold">Xem tất cả</Text>
                </Pressable>
            </View>

            <View className="flex-row -mx-1.5 flex-wrap">
                {dishes.map((item, index) => (
                    <View key={`${item.id}-${index}`} className="w-1/2 px-1.5 mb-3">
                        <SuggestionCard item={item} />
                    </View>
                ))}
            </View>
        </View>
    );
}

function SuggestionCard({ item }: { item: Dish }) {
    return (
        <Pressable
            className="bg-white rounded-2xl overflow-hidden border border-[#E6F6F9]"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 6,
                elevation: 3,
            }}
        >
            <View className="relative">
                <Image
                    source={{ uri: item.image }}
                    className="w-full h-32"
                    resizeMode="cover"
                />
                <View
                    className="absolute top-2 left-2 px-2 py-1 rounded-lg flex-row items-center"
                    style={{ backgroundColor: "rgba(38, 198, 218, 0.9)" }}
                >
                    <Ionicons name="star" size={12} color="#FFFFFF" />
                    <Text className="text-[10px] text-white font-semibold ml-1">
                        {item.rating.toFixed(1)}
                    </Text>
                </View>
            </View>

            <View className="p-3">
                <Text className="font-semibold text-[13px] text-[#0F172A] mb-2" numberOfLines={2}>
                    {item.name}
                </Text>

                <View className="flex-row items-center justify-between">
                    <Text className="text-[14px] font-bold text-[#26C6DA]">
                        {item.price.toLocaleString()}đ
                    </Text>
                    <Pressable
                        className="flex-row items-center px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: "#E0F7FA" }}
                    >
                        <Ionicons name="add" size={14} color="#26C6DA" />
                        <Text className="text-xs text-[#26C6DA] ml-1 font-semibold">Thêm</Text>
                    </Pressable>
                </View>
            </View>
        </Pressable>
    );
}



