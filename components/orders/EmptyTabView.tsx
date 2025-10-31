import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function EmptyTabView() {
    return (
        <View className="items-center justify-center mt-16 px-8">
            <Ionicons name="clipboard-outline" size={80} color="#26C6DA" />
            <Text className="text-lg font-semibold mt-4 text-center text-black">
                Bạn chưa có đơn nào
            </Text>
            <Text className="text-black text-sm mt-2 text-center">
                Các đơn đã đặt sẽ hiển thị tại đây
            </Text>
            <Pressable className="mt-5 bg-primary-400 px-6 py-2 rounded-lg shadow-sm">
                <Text className="text-white font-medium">
                    Đặt ngay
                </Text>
            </Pressable>
        </View>
    );
}


