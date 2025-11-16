import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Platform, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import OrdersTabs from "../../components/orders/OrdersTabs";
import TabsUI from "../../components/orders/TabsUI";

export default function OrderScreen() {
    const [activeTab, setActiveTab] = useState("Đang đến");

    // Reset StatusBar when screen loses focus (navigating away)
    useFocusEffect(
        useCallback(() => {
            // Set StatusBar for this screen when focused
            StatusBar.setBarStyle("dark-content");
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor("#FFFFFF");
                StatusBar.setTranslucent(false);
            }

            // Reset StatusBar when screen loses focus
            return () => {
                StatusBar.setBarStyle("light-content");
                if (Platform.OS === "android") {
                    StatusBar.setBackgroundColor("#26C6DA");
                    StatusBar.setTranslucent(false);
                }
            };
        }, [])
    );

    return (
        <SafeAreaView
            className="flex-1 bg-[#F8FDFE]"
            edges={["top", "left", "right"]}
        >

            {/* Header */}
            <View className="bg-white px-5 pt-4 pb-4 border-b border-[#E0F7FA] mb-4">
                <Text className="text-2xl font-bold text-[#0F172A]">Đơn hàng</Text>
                <Text className="text-xs text-gray-500 mt-1">
                    Theo dõi, đánh giá và đặt lại nhanh
                </Text>
            </View>

            {/* Tabs */}
            <TabsUI activeTab={activeTab} onChange={setActiveTab} />
            <OrdersTabs activeTab={activeTab} />
        </SafeAreaView>
    );
}
