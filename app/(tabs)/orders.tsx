import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, View } from "react-native";
import OrdersTabs from "../../components/orders/OrdersTabs";
import TabsUI from "../../components/orders/TabsUI";

export default function OrderScreen() {
    const [activeTab, setActiveTab] = useState("Đang đến");

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-row justify-between items-center px-5 pb-4 bg-white shadow-sm">
                <Text className="text-2xl font-semibold text-black">Đơn hàng</Text>
                <View className="rounded-lg bg-gray-50 p-2 border border-gray-200">
                    <Ionicons name="search" size={18} color="#4B5563" />
                </View>
            </View>

            <TabsUI activeTab={activeTab} onChange={setActiveTab} />
            <OrdersTabs activeTab={activeTab} />
        </SafeAreaView>
    );
}
