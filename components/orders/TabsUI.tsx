import { Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, Text, View } from "react-native";

export const TABS = ["Đang đến", "Deal đã mua", "Lịch sử", "Đánh giá", "Đơn nháp"] as const;

const tabIcons: Record<string, string> = {
    "Đang đến": "bicycle",
    "Deal đã mua": "pricetag",
    "Lịch sử": "time",
    "Đánh giá": "star",
    "Đơn nháp": "document-text"
};

export default function TabsUI({ activeTab, onChange }: { activeTab: string; onChange: (k: string) => void }) {
    return (
        <View className="bg-white border-b border-[#E0F7FA]">
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 12, paddingVertical: 12 }}
            >
                <View className="flex-row">
                    {TABS.map((tab, i) => {
                        const isActive = activeTab === tab;
                        return (
                            <Pressable
                                key={i}
                                onPress={() => onChange(tab)}
                                className={`px-4 py-2 rounded-full flex-row items-center mr-2 ${
                                    isActive
                                        ? "bg-[#26C6DA]"
                                        : "bg-[#F2FBFD] border border-[#D3F3F7]"
                                }`}
                                style={
                                    isActive
                                        ? {
                                              shadowColor: "#26C6DA",
                                              shadowOffset: { width: 0, height: 2 },
                                              shadowOpacity: 0.2,
                                              shadowRadius: 4,
                                              elevation: 3,
                                          }
                                        : {}
                                }
                            >
                                <Ionicons
                                    name={tabIcons[tab] as any}
                                    size={16}
                                    color={isActive ? "#FFFFFF" : "#26C6DA"}
                                />
                                <Text
                                    className={`text-xs ml-1.5 font-semibold ${
                                        isActive ? "text-white" : "text-[#177C8A]"
                                    }`}
                                >
                                    {tab}
                                </Text>
                            </Pressable>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
}


