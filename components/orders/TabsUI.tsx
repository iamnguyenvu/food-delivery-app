import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export const TABS = ["Đang đến", "Deal đã mua", "Lịch sử", "Đánh giá", "Đơn nháp"] as const;

const tabIcons: Record<string, string> = {
    "Đang đến": "bicycle-outline",
    "Deal đã mua": "pricetag-outline",
    "Lịch sử": "time-outline",
    "Đánh giá": "star-outline",
    "Đơn nháp": "document-text-outline"
};

export default function TabsUI({ activeTab, onChange }: { activeTab: string; onChange: (k: string) => void }) {
    return (
        <View className="flex-row justify-around px-1 py-1 bg-white border-b border-gray-100">
            {TABS.map((tab, i) => {
                const isActive = activeTab === tab;
                return (
                    <Pressable
                        key={i}
                        onPress={() => onChange(tab)}
                        className="items-center px-3 pb-1"
                    >
                        <Ionicons
                            name={tabIcons[tab] as any}
                            size={17}
                            color={isActive ? "#26C6DA" : "#9CA3AF"}
                        />
                        <Text
                            className={`text-xs mt-0.5 ${
                                isActive
                                    ? "font-semibold text-primary-400"
                                    : "text-black"
                            }`}
                        >
                            {tab}
                        </Text>
                        {isActive && (
                            <View className="h-1 w-7 bg-primary-400 mt-1 rounded-lg" />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
}


