import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { Order } from "./OrderTypeAndMock";

export default function OrderCard({ order }: { order: Order }) {
    const createdTime = order.created_at.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });
    const createdDate = order.created_at.toLocaleDateString("vi-VN");

    const etaTime = order.estimated_delivery.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const firstItem = order.items[0];
    const remainingItems = order.items.length - 1;

    const statusMap: Record<string, { label: string; bg: string; text: string }> = {
        pending: { label: "Chờ xác nhận", bg: "bg-yellow-50", text: "text-yellow-600" },
        preparing: { label: "Đang chuẩn bị", bg: "bg-orange-50", text: "text-orange-600" },
        ready_for_pickup: { label: "Sẵn sàng", bg: "bg-blue-50", text: "text-blue-600" },
        delivering: { label: "Đang giao", bg: "bg-green-50", text: "text-green-600" },
        delivered: { label: "Đã giao", bg: "bg-blue-50", text: "text-blue-600" },
        cancelled: { label: "Đã huỷ", bg: "bg-red-50", text: "text-red-600" },
    };

    const statusMeta = statusMap[order.status];

    const [progressPct, setProgressPct] = useState<number>(0);
    useEffect(() => {
        if (order.status !== "delivering") return;

        const total = order.estimated_delivery.getTime() - order.created_at.getTime();
        const interval = setInterval(() => {
            const elapsed = Date.now() - order.created_at.getTime();
            const pct = Math.min(100, Math.max(0, Math.round((elapsed / total) * 100)));
            setProgressPct(pct);
        }, 1000);

        return () => clearInterval(interval);
    }, [order.status]);

    return (
        <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4 active:opacity-80">
            <View className="flex-row justify-between">
                <Text className="text-black text-xs">
                    #{order.order_number}
                </Text>
                <Text className="text-black text-xs">
                    {createdTime}, {createdDate}
                </Text>
            </View>

            <View className="flex-row items-center mt-2">
                <Text className="font-semibold text-[15px] flex-1 text-black">
                    {order.restaurant_name}
                </Text>
                <Ionicons name="fast-food-outline" size={20} color="#26C6DA" />
            </View>

            <View className="flex-row items-center mt-3">
                <Image source={{ uri: order.restaurant_thumbnail }} className="w-20 h-20 rounded-xl mr-3" />
                <View className="flex-1">
                    <Text className="text-[14px]" numberOfLines={1}>{firstItem.name}</Text>
                    <Text className="text-black text-xs mt-1">
                        {order.items.length} món • {order.total.toLocaleString()}đ
                    </Text>
                    {remainingItems > 0 && (
                        <Text className="text-gray-500 text-[10px]">+{remainingItems} món khác</Text>
                    )}
                </View>
            </View>

            <View className="flex-row justify-between mt-3">
                <View className={`px-2 py-1 rounded-md ${statusMeta.bg}`}>
                    <Text className={`text-xs font-medium ${statusMeta.text}`}>
                        {statusMeta.label}
                    </Text>
                </View>

                {order.status === "delivering" && (
                    <Text className="text-black text-xs">
                        Đơn hàng đang được giao đến
                    </Text>
                )}

                {order.status === "cancelled" && (
                    <Text className="text-red-500 text-xs">
                        {order.cancellation_reason}
                    </Text>
                )}
            </View>

            {order.status === "delivering" && (
                <View className="flex-row items-center mt-1">
                    <Ionicons name="time-outline" size={14} color="#6B7280" />
                    <Text className="text-black text-xs ml-1">
                        Dự kiến giao lúc {etaTime}
                    </Text>
                </View>
            )}

            {order.status === "delivering" && (
                <View className="mt-3">
                    <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-black">Tiến độ</Text>
                        <Text className="text-xs text-black">{progressPct}%</Text>
                    </View>
                    <View className="h-2 bg-gray-200 rounded-lg">
                        <View
                            className="h-2 bg-primary-400 rounded-lg"
                            style={{ width: `${progressPct}%` }}
                        />
                    </View>
                </View>
            )}

            {order.status === "delivered" && order.rating && (
                <View className="flex-row items-center mt-2">
                    <Ionicons name="star" color="#FBBF24" size={14} />
                    <Text className="ml-1 text-xs text-black">{order.rating}/5 — {order.review}</Text>
                </View>
            )}
        </Pressable>
    );
}


