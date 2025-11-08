import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersTabs from "../../components/orders/OrdersTabs";
import TabsUI from "../../components/orders/TabsUI";

export default function OrderScreen() {
    const [activeTab, setActiveTab] = useState("Đang đến");

    return (
        <SafeAreaView className="flex-1 bg-[#F8FDFE]">
            {/* Header */}
            <View className="bg-white px-5 pt-4 pb-4 border-b border-[#E0F7FA]">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="bg-[#E0F7FA] w-11 h-11 rounded-full items-center justify-center mr-3">
                            <Ionicons name="receipt" size={22} color="#26C6DA" />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-[#0F172A]">Đơn hàng</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">
                                Theo dõi, đánh giá và đặt lại nhanh
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            <TabsUI activeTab={activeTab} onChange={setActiveTab} />
            <OrdersTabs activeTab={activeTab} />
        </SafeAreaView>
    );
}
