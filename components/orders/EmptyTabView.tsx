import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function EmptyTabView() {
    return (
        <View className="items-center justify-center mt-20 px-8">
            <View
                className="w-24 h-24 rounded-3xl items-center justify-center mb-4"
                style={{
                    backgroundColor: "#E0F7FA",
                }}
            >
                <Ionicons name="clipboard-outline" size={40} color="#26C6DA" />
            </View>
            <Text className="text-lg font-bold text-[#0F172A] mb-1">
                Chưa có đơn hàng
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-6">
                Đặt món yêu thích và theo dõi tại đây
            </Text>
            <Pressable
                className="bg-[#26C6DA] px-6 py-3 rounded-xl"
                style={{
                    shadowColor: "#26C6DA",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                }}
            >
                <Text className="text-white font-semibold text-[14px]">
                    Đặt ngay
                </Text>
            </Pressable>
        </View>
    );
}


