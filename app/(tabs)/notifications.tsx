import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// import { supabase } from "@/src/lib/supabase";

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
            return {
                icon: "bag" as const,
                bgColor: "#E0F7FA",
                iconColor: "#26C6DA",
                borderColor: "#B2EBF2",
            };
        case "promo":
            return {
                icon: "gift" as const,
                bgColor: "#FFF3E0",
                iconColor: "#FF9800",
                borderColor: "#FFE0B2",
            };
        case "system":
            return {
                icon: "information-circle" as const,
                bgColor: "#F3E5F5",
                iconColor: "#9C27B0",
                borderColor: "#E1BEE7",
            };
    }
};

export default function NotificationsScreen() {
    const [notifications, setNotifications] = useState<NotificationItem[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchData = async () => {
        // Mock Data trước khi có API
        setNotifications(notificationsMockData);
        setUnreadCount(notificationsMockData.filter((n) => !n.is_read).length);

        /*
        const { data, error } = await supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data) {
          const notificationList = data.map((n) => ({
            ...n,
            created_at: new Date(n.created_at),
          }));
          setNotifications(notificationList);
          setUnreadCount(notificationList.filter((n) => !n.is_read).length);
        }
        */
    };

    const markAsRead = async (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));

        /*
        await supabase
          .from("notifications")
          .update({ is_read: true })
          .eq("id", id);
        */
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <SafeAreaView className="flex-1 bg-[#F8FDFE]">
            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View className="bg-white px-5 pt-4 pb-4 border-b border-[#E0F7FA]">
                    <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center">
                            <View className="bg-[#E0F7FA] w-11 h-11 rounded-full items-center justify-center mr-3">
                                <Ionicons name="notifications" size={22} color="#26C6DA" />
                            </View>
                            <View>
                                <Text className="text-2xl font-bold text-[#0F172A]">
                                    Thông báo
                                </Text>
                                <Text className="text-xs text-gray-500 mt-0.5">
                                    {unreadCount > 0
                                        ? `${unreadCount} thông báo chưa đọc`
                                        : "Tất cả đã đọc"}
                                </Text>
                            </View>
                        </View>
                        {unreadCount > 0 && (
                            <View className="bg-[#26C6DA] px-3 py-1.5 rounded-full">
                                <Text className="text-white text-xs font-semibold">
                                    {unreadCount}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>

                {/* Notifications List */}
                <View className="px-4 pt-4 pb-6">
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
                        notifications.map((item, index) => {
                            const typeConfig = getTypeConfig(item.type);
                            const isLast = index === notifications.length - 1;

                            return (
                                <Pressable
                                    key={item.id}
                                    onPress={() => !item.is_read && markAsRead(item.id)}
                                    className={`mb-3 ${isLast ? "mb-0" : ""}`}
                                    android_ripple={{ color: "#B2EBF2" }}
                                >
                                    <View
                                        className={`bg-white rounded-2xl overflow-hidden ${
                                            !item.is_read
                                                ? "border-l-4 border-[#26C6DA] shadow-lg"
                                                : "border border-[#E6F6F9] shadow-sm"
                                        }`}
                                        style={
                                            !item.is_read
                                                ? {
                                                      shadowColor: "#26C6DA",
                                                      shadowOffset: { width: 0, height: 2 },
                                                      shadowOpacity: 0.1,
                                                      shadowRadius: 8,
                                                      elevation: 4,
                                                  }
                                                : {
                                                      shadowColor: "#000",
                                                      shadowOffset: { width: 0, height: 1 },
                                                      shadowOpacity: 0.05,
                                                      shadowRadius: 3,
                                                      elevation: 2,
                                                  }
                                        }
                                    >
                                        <View className="flex-row p-4">
                                            {/* Icon/Image Container */}
                                            <View className="relative mr-4">
                                                {item.image ? (
                                                    <Image
                                                        source={{ uri: item.image }}
                                                        className="w-14 h-14 rounded-xl"
                                                        resizeMode="cover"
                                                    />
                                                ) : (
                                                    <View
                                                        className="w-14 h-14 rounded-xl items-center justify-center"
                                                        style={{
                                                            backgroundColor: typeConfig.bgColor,
                                                        }}
                                                    >
                                                        <Ionicons
                                                            name={typeConfig.icon}
                                                            size={24}
                                                            color={typeConfig.iconColor}
                                                        />
                                                    </View>
                                                )}
                                                {/* Type Badge */}
                                                <View
                                                    className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full items-center justify-center border-2 border-white"
                                                    style={{
                                                        backgroundColor: typeConfig.bgColor,
                                                    }}
                                                >
                                                    <Ionicons
                                                        name={typeConfig.icon}
                                                        size={12}
                                                        color={typeConfig.iconColor}
                                                    />
                                                </View>
                                            </View>

                                            {/* Content */}
                                            <View className="flex-1">
                                                <View className="flex-row items-start justify-between mb-1">
                                                    <Text
                                                        className={`flex-1 font-bold text-[15px] leading-5 ${
                                                            item.is_read
                                                                ? "text-gray-700"
                                                                : "text-[#0F172A]"
                                                        }`}
                                                        numberOfLines={2}
                                                    >
                                                        {item.title}
                                                    </Text>
                                                    {!item.is_read && (
                                                        <View className="w-2.5 h-2.5 bg-[#26C6DA] rounded-full ml-2 mt-1" />
                                                    )}
                                                </View>

                                                <Text
                                                    className={`text-[13px] leading-5 mb-1 ${
                                                        item.is_read
                                                            ? "text-gray-500"
                                                            : "text-gray-600"
                                                    }`}
                                                    numberOfLines={2}
                                                >
                                                    {item.message}
                                                </Text>

                                                <Text className="text-[11px] text-gray-400 mt-1">
                                                    {formatTime(item.created_at)}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </Pressable>
                            );
                        })
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
