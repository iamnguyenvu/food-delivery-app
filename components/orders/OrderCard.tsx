import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Order } from "./OrderTypeAndMock";

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
    return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
};

export default function OrderCard({
                                      order,
                                      contextTab,
                                      onReviewPress,
                                      onPress,
                                  }: {
    order: Order;
    contextTab?: string;
    onReviewPress?: (order: Order) => void;
    onPress?: () => void;
}) {
    const createdTime = order.created_at.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const etaTime = order.estimated_delivery.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const firstItem = order.items[0];
    const remainingItems = order.items.length - 1;

    const statusMap: Record<
        string,
        { label: string; bg: string; text: string; icon: string }
    > = {
        pending: {
            label: "Chờ xác nhận",
            bg: "#FFF3E0",
            text: "#F57C00",
            icon: "time",
        },
        preparing: {
            label: "Đang chuẩn bị",
            bg: "#FFF3E0",
            text: "#F57C00",
            icon: "restaurant",
        },
        ready_for_pickup: {
            label: "Sẵn sàng",
            bg: "#E3F2FD",
            text: "#1976D2",
            icon: "checkmark-circle",
        },
        delivering: {
            label: "Đang giao",
            bg: "#E8F5E9",
            text: "#388E3C",
            icon: "bicycle",
        },
        delivered: {
            label: "Đã giao",
            bg: "#E0F7FA",
            text: "#26C6DA",
            icon: "checkmark-circle",
        },
        cancelled: {
            label: "Đã huỷ",
            bg: "#FFEBEE",
            text: "#D32F2F",
            icon: "close-circle",
        },
    };

    const statusMeta = statusMap[order.status];
    const [progressPct, setProgressPct] = useState<number>(0);

    useEffect(() => {
        if (order.status !== "delivering") return;
        const total =
            order.estimated_delivery.getTime() - order.created_at.getTime();
        const interval = setInterval(() => {
            const elapsed = Date.now() - order.created_at.getTime();
            const pct = Math.min(
                100,
                Math.max(0, Math.round((elapsed / total) * 100))
            );
            setProgressPct(pct);
        }, 1000);
        return () => clearInterval(interval);
    }, [order.status]);

    return (
        <Pressable
            onPress={onPress}
            className="bg-white rounded-2xl mb-3 overflow-hidden border border-[#E6F6F9]"
            style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between px-4 pt-4 pb-2">
                <View className="flex-row items-center">
                    <View
                        className="w-8 h-8 rounded-full items-center justify-center mr-2"
                        style={{ backgroundColor: "#E0F7FA" }}
                    >
                        <Ionicons name="receipt" size={16} color="#26C6DA" />
                    </View>
                    <Text className="text-xs font-semibold text-[#0F172A]">
                        #{order.order_number}
                    </Text>
                </View>
                <Text className="text-[10px] text-gray-400">
                    {formatTime(order.created_at)}
                </Text>
            </View>

            {/* Restaurant Info */}
            <View className="px-4 pb-3 border-b border-[#F0F9FA]">
                <View className="flex-row items-center">
                    <Image
                        source={{ uri: order.restaurant_thumbnail }}
                        className="w-16 h-16 rounded-xl mr-3"
                        resizeMode="cover"
                    />
                    <View className="flex-1">
                        <Text
                            className="font-bold text-[15px] text-[#0F172A]"
                            numberOfLines={1}
                        >
                            {order.restaurant_name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <View
                                className="px-2.5 py-1 rounded-full flex-row items-center"
                                style={{ backgroundColor: statusMeta.bg }}
                            >
                                <Ionicons
                                    name={statusMeta.icon as any}
                                    size={12}
                                    color={statusMeta.text}
                                />
                                <Text
                                    className="text-[10px] font-semibold ml-1"
                                    style={{ color: statusMeta.text }}
                                >
                                    {statusMeta.label}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Items */}
            <View className="px-4 py-3">
                <View className="flex-row items-start">
                    {firstItem.thumbnail && (
                        <Image
                            source={{ uri: firstItem.thumbnail }}
                            className="w-14 h-14 rounded-lg mr-3"
                            resizeMode="cover"
                        />
                    )}
                    <View className="flex-1">
                        <Text
                            className="text-[14px] font-semibold text-[#0F172A]"
                            numberOfLines={1}
                        >
                            {firstItem.name}
                        </Text>
                        <Text className="text-[12px] text-gray-600 mt-0.5">
                            {firstItem.quantity}x • {firstItem.price.toLocaleString()}đ
                        </Text>
                        {remainingItems > 0 && (
                            <Text className="text-[11px] text-gray-400 mt-1">
                                +{remainingItems} món khác
                            </Text>
                        )}
                    </View>
                    <View className="items-end">
                        <Text className="text-[15px] font-bold text-[#26C6DA]">
                            {order.total.toLocaleString()}đ
                        </Text>
                        <Text className="text-[10px] text-gray-400 mt-0.5">
                            {order.items.length} món
                        </Text>
                    </View>
                </View>
            </View>

            {/* Delivery Progress */}
            {order.status === "delivering" && (
                <View className="px-4 pb-3">
                    <View className="bg-[#F2FBFD] rounded-xl p-3 border border-[#D3F3F7]">
                        <View className="flex-row items-center justify-between mb-2">
                            <View className="flex-row items-center">
                                <Ionicons name="bicycle" size={16} color="#26C6DA" />
                                <Text className="text-[12px] font-semibold text-[#0F172A] ml-2">
                                    Đang giao hàng
                                </Text>
                            </View>
                            <Text className="text-[11px] text-gray-500">{progressPct}%</Text>
                        </View>
                        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <View
                                className="h-2 bg-[#26C6DA] rounded-full"
                                style={{ width: `${progressPct}%` }}
                            />
                        </View>
                        <View className="flex-row items-center mt-2">
                            <Ionicons name="time" size={12} color="#26C6DA" />
                            <Text className="text-[11px] text-gray-600 ml-1">
                                Dự kiến giao lúc {etaTime}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {contextTab === "Đánh giá" &&
                order.status === "delivered" &&
                !order.rating && (
                    <View className="px-4 pb-4 pt-2 border-t border-[#F0F9FA]">
                        <Pressable
                            className="bg-[#26C6DA] px-4 py-2.5 rounded-xl items-center active:bg-[#00BCD4]"
                            onPress={() => onReviewPress && onReviewPress(order)}
                            style={{
                                shadowColor: "#26C6DA",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Text className="text-[13px] font-semibold text-white">
                                Đánh giá đơn hàng
                            </Text>
                        </Pressable>
                    </View>
                )}
        </Pressable>
    );
}
