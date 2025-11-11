import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

interface NotificationItem {
    id: string;
    title: string;
    message: string;
    image?: string;
    type: "order" | "promo" | "system";
    is_read: boolean;
    created_at: Date;
    action_label?: string;
    action_url?: string;
}

// Mock data
const notificationsMockData: NotificationItem[] = [
    {
        id: "1",
        title: "Đơn hàng của bạn đang được giao!",
        message: "Tài xế đang trên đường đến. Vui lòng giữ điện thoại bên mình nhé 📦",
        image: "https://i.imgur.com/gtBqoNL.jpeg",
        type: "order",
        is_read: false,
        created_at: new Date(Date.now() - 2 * 60 * 1000),
    },
    {
        id: "2",
        title: "Nhận ưu đãi 30% cho đơn hàng đầu tiên 🎉",
        message: "Chào mừng bạn mới! Áp dụng mã WELCOME30 tại trang thanh toán.",
        image: "https://i.imgur.com/H1vjE2V.jpeg",
        type: "promo",
        is_read: true,
        created_at: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
        id: "3",
        title: "Cập nhật chính sách bảo mật",
        message: "Chúng tôi vừa cập nhật Điều khoản Dịch vụ và Chính sách Bảo mật.",
        image: "https://cdn-icons-png.flaticon.com/512/992/992700.png",
        type: "system",
        is_read: false,
        created_at: new Date(Date.now() - 5 * 60 * 60 * 1000),
    },
    {
        id: "4",
        title: "Đơn hàng #O-439821 đã giao thành công",
        message: "Cảm ơn bạn đã tin tưởng đặt món tại Cơm Tấm Sườn Que!",
        image: "https://i.imgur.com/ZyA9Nho.jpeg",
        type: "order",
        is_read: true,
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
];

// Helper function to format time
const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Vừa xong";
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
};

// Get type icon and color
const getTypeConfig = (type: "order" | "promo" | "system") => {
    switch (type) {
        case "order":
            return { icon: "bag" as const, bgColor: "#E0F7FA", iconColor: "#26C6DA" };
        case "promo":
            return { icon: "gift" as const, bgColor: "#FFF3E0", iconColor: "#FF9800" };
        case "system":
            return { icon: "information-circle" as const, bgColor: "#F3E5F5", iconColor: "#9C27B0" };
    }
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const insets = useSafeAreaInsets();

    const fetchData = async () => {
        setNotifications(notificationsMockData);
        setUnreadCount(notificationsMockData.filter((n) => !n.is_read).length);
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#F8FDFE]" edges={["top", "left", "right"]}>
            <StatusBar
                translucent={false}
                backgroundColor="#FFFFFF"
                barStyle={Platform.OS === "ios" ? "dark-content" : "dark-content"}
            />

            {/* Header */}
            <View className="bg-white px-5 pt-4 pb-4 border-b border-[#E0F7FA] mb-2">
                <Text className="text-2xl font-bold text-[#0F172A]">Thông báo</Text>
                <Text className="text-xs text-gray-500 mt-1">
                    {unreadCount > 0 ? `${unreadCount} thông báo chưa đọc` : "Tất cả đã đọc"}
                </Text>
            </View>

            {/* Notifications List */}
            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 + insets.bottom + 60 }}
            >
                {notifications.length === 0 ? (
                    <View className="h-[500px] items-center justify-center">
                        <View className="w-24 h-24 rounded-3xl bg-[#E0F7FA] items-center justify-center mb-4">
                            <Ionicons name="notifications-off-outline" size={40} color="#26C6DA" />
                        </View>
                        <Text className="text-lg font-semibold text-[#0F172A] mb-1">
                            Chưa có thông báo
                        </Text>
                        <Text className="text-sm text-gray-500 text-center px-8">
                            Thông báo mới sẽ xuất hiện tại đây
                        </Text>
                    </View>
                ) : (
                    notifications.map((item) => {
                        const typeConfig = getTypeConfig(item.type);
                        return (
                            <Pressable
                                key={item.id}
                                onPress={() => !item.is_read && markAsRead(item.id)}
                                className="mb-2"
                                android_ripple={{ color: "#B2EBF2" }}
                            >
                                <View className="bg-white rounded-2xl overflow-hidden border border-[#E6F6F9]" style={{ elevation: item.is_read ? 2 : 4 }}>
                                    {/* Left accent (stable width to avoid layout shift) */}
                                    <View className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: item.is_read ? "transparent" : "#26C6DA" }} />

                                    <View className="flex-row p-3 pl-4">
                                        {/* Icon / Image */}
                                        <View className="relative mr-3">
                                            {item.image ? (
                                                <Image
                                                    source={{ uri: item.image }}
                                                    className="w-12 h-12 rounded-lg"
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <View
                                                    className="w-12 h-12 rounded-lg items-center justify-center"
                                                    style={{ backgroundColor: typeConfig.bgColor }}
                                                >
                                                    <Ionicons
                                                        name={typeConfig.icon}
                                                        size={20}
                                                        color={typeConfig.iconColor}
                                                    />
                                                </View>
                                            )}
                                            <View
                                                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full items-center justify-center border-2 border-white"
                                                style={{ backgroundColor: typeConfig.bgColor }}
                                            >
                                                <Ionicons
                                                    name={typeConfig.icon}
                                                    size={10}
                                                    color={typeConfig.iconColor}
                                                />
                                            </View>
                                        </View>

                                        {/* Content */}
                                        <View className="flex-1">
                                            <View className="flex-row items-start justify-between mb-0.5">
                                                <Text
                                                    className={`flex-1 font-bold text-[14px] leading-5 ${
                                                        item.is_read ? "text-gray-700" : "text-[#0F172A]"
                                                    }`}
                                                    numberOfLines={2}
                                                >
                                                    {item.title}
                                                </Text>
                                                {!item.is_read && (
                                                    <View className="w-2 h-2 bg-[#26C6DA] rounded-full ml-2 mt-0.5" />
                                                )}
                                            </View>

                                            <Text
                                                className={`text-[12px] leading-5 mb-0.5 ${
                                                    item.is_read ? "text-gray-500" : "text-gray-600"
                                                }`}
                                                numberOfLines={2}
                                            >
                                                {item.message}
                                            </Text>

                                            <Text className="text-[10px] text-gray-400 mt-0.5">
                                                {formatTime(item.created_at)}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Pressable>
                        );
                    })
                )}
            </ScrollView>
        </SafeAreaView>
    );
}
