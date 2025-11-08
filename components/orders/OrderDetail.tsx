import { Ionicons } from "@expo/vector-icons";
import { Image, ScrollView, Text, View } from "react-native";
import { Order } from "./OrderTypeAndMock";

interface OrderDetailProps {
    order: Order;
}

// Helper function to format time
const formatDateTime = (date: Date): string => {
    return date.toLocaleString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

export default function OrderDetail({ order }: OrderDetailProps) {
    const statusMap: Record<string, { label: string; bg: string; text: string; icon: string }> = {
        pending: { label: "Chờ xác nhận", bg: "#FFF3E0", text: "#F57C00", icon: "time" },
        preparing: { label: "Đang chuẩn bị", bg: "#FFF3E0", text: "#F57C00", icon: "restaurant" },
        ready_for_pickup: { label: "Sẵn sàng", bg: "#E3F2FD", text: "#1976D2", icon: "checkmark-circle" },
        delivering: { label: "Đang giao", bg: "#E8F5E9", text: "#388E3C", icon: "bicycle" },
        delivered: { label: "Đã giao", bg: "#E0F7FA", text: "#26C6DA", icon: "checkmark-circle" },
        cancelled: { label: "Đã huỷ", bg: "#FFEBEE", text: "#D32F2F", icon: "close-circle" },
    };

    const statusMeta = statusMap[order.status];
    const paymentMethodMap: Record<string, string> = {
        cash: "Tiền mặt",
        momo: "MoMo",
        vnpay: "VNPay",
        zalopay: "ZaloPay",
    };

    return (
        <ScrollView className="flex-1 bg-[#F8FDFE]" showsVerticalScrollIndicator={false}>
            {/* Hero Section with Order Number */}
            <View className="bg-gradient-to-b from-[#26C6DA] to-[#00BCD4] px-4 pt-4 pb-5" style={{
                backgroundColor: "#26C6DA",
            }}>
                <View className="items-center mb-3">
                    <View className="w-12 h-12 rounded-full items-center justify-center mb-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                        <Ionicons name="receipt" size={24} color="#FFFFFF" />
                    </View>
                    <Text className="text-white text-[10px] font-medium mb-0.5">Mã đơn hàng</Text>
                    <Text className="text-white text-lg font-bold">#{order.order_number}</Text>
                </View>
                <View className="bg-white/20 rounded-xl px-3 py-2 flex-row items-center justify-center">
                    <Ionicons name={statusMeta.icon as any} size={16} color="#FFFFFF" />
                    <Text className="text-white text-sm font-semibold ml-1.5">
                        {statusMeta.label}
                    </Text>
                </View>
            </View>

            {/* Restaurant Info */}
            <View className="bg-white mx-4 -mt-4 rounded-xl p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center">
                    <View className="relative">
                        <Image
                            source={{ uri: order.restaurant_thumbnail }}
                            className="w-16 h-16 rounded-xl mr-3"
                            resizeMode="cover"
                        />
                        <View className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full items-center justify-center border border-white" style={{ backgroundColor: "#26C6DA" }}>
                            <Ionicons name="restaurant" size={12} color="#FFFFFF" />
                        </View>
                    </View>
                    <View className="flex-1">
                        <Text className="text-base font-bold text-[#0F172A] mb-1">
                            {order.restaurant_name}
                        </Text>
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={12} color="#64748B" />
                            <Text className="text-[10px] text-gray-500 ml-1">
                                {formatDateTime(order.created_at)}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Order Items */}
            <View className="bg-white mx-4 mt-3 rounded-xl p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                        <Ionicons name="fast-food" size={18} color="#26C6DA" />
                    </View>
                    <View className="flex-1">
                        <Text className="text-sm font-bold text-[#0F172A]">Món đã đặt</Text>
                        <Text className="text-[10px] text-gray-500 mt-0.5">{order.items.length} món</Text>
                    </View>
                </View>

                {order.items.map((item, index) => (
                    <View key={index} className={`flex-row items-start ${index < order.items.length - 1 ? "mb-3 pb-3 border-b border-[#F0F9FA]" : ""}`}>
                        <View className="relative">
                            <Image
                                source={{ uri: item.thumbnail }}
                                className="w-16 h-16 rounded-xl mr-3"
                                resizeMode="cover"
                            />
                            <View className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full items-center justify-center border border-white" style={{ backgroundColor: "#26C6DA" }}>
                                <Text className="text-[9px] text-white font-bold">{item.quantity}</Text>
                            </View>
                        </View>
                        <View className="flex-1">
                            <Text className="text-sm font-semibold text-[#0F172A] mb-1.5">
                                {item.name}
                            </Text>
                            {item.note && (
                                <View className="mb-1.5 bg-[#F8FDFE] rounded-lg p-1.5 border border-[#E0F7FA]">
                                    <View className="flex-row items-center mb-0.5">
                                        <Ionicons name="chatbubble-outline" size={10} color="#26C6DA" />
                                        <Text className="text-[10px] text-gray-500 ml-1 font-medium">Ghi chú:</Text>
                                    </View>
                                    <Text className="text-xs text-gray-700">{item.note}</Text>
                                </View>
                            )}
                            <View className="flex-row items-center justify-between mt-1.5">
                                <View className="flex-row items-center">
                                    <Ionicons name="pricetag" size={12} color="#64748B" />
                                    <Text className="text-xs text-gray-500 ml-1">
                                        {item.quantity}x
                                    </Text>
                                </View>
                                <Text className="text-sm font-bold text-[#26C6DA]">
                                    {item.price.toLocaleString()}đ
                                </Text>
                            </View>
                        </View>
                    </View>
                ))}
            </View>

            {/* Delivery Info */}
            <View className="bg-white mx-4 mt-3 rounded-xl p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                        <Ionicons name="location" size={18} color="#26C6DA" />
                    </View>
                    <Text className="text-sm font-bold text-[#0F172A]">Thông tin giao hàng</Text>
                </View>

                <View className="mb-3 pb-3 border-b border-[#F0F9FA]">
                    <View className="flex-row items-start">
                        <Ionicons name="home-outline" size={14} color="#26C6DA" />
                        <View className="flex-1 ml-2">
                            <Text className="text-[10px] text-gray-500 mb-1 font-medium">Địa chỉ giao hàng</Text>
                            <Text className="text-xs text-[#0F172A] font-semibold leading-4">
                                {order.delivery_address.street}, {order.delivery_address.ward}, {order.delivery_address.district}, {order.delivery_address.city}
                            </Text>
                        </View>
                    </View>
                </View>

                <View className="mb-3 pb-3 border-b border-[#F0F9FA]">
                    <View className="flex-row items-center">
                        <Ionicons name="call-outline" size={14} color="#26C6DA" />
                        <View className="flex-1 ml-2">
                            <Text className="text-[10px] text-gray-500 mb-1 font-medium">Số điện thoại</Text>
                            <Text className="text-xs text-[#0F172A] font-semibold">{order.delivery_phone}</Text>
                        </View>
                    </View>
                </View>

                {order.delivery_notes && (
                    <View className="bg-[#F8FDFE] rounded-lg p-2 border border-[#E0F7FA]">
                        <View className="flex-row items-center mb-1">
                            <Ionicons name="document-text-outline" size={12} color="#26C6DA" />
                            <Text className="text-[10px] text-gray-500 ml-1.5 font-medium">Ghi chú giao hàng</Text>
                        </View>
                        <Text className="text-xs text-[#0F172A]">{order.delivery_notes}</Text>
                    </View>
                )}
            </View>

            {/* Order Timeline */}
            <View className="bg-white mx-4 mt-3 rounded-xl p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                        <Ionicons name="time" size={18} color="#26C6DA" />
                    </View>
                    <Text className="text-sm font-bold text-[#0F172A]">Lịch sử đơn hàng</Text>
                </View>

                <View className="relative pl-5">
                    {/* Timeline line */}
                    <View className="absolute left-2 top-0 bottom-0 w-0.5" style={{ backgroundColor: "#E0F7FA" }} />

                    {/* Timeline items */}
                    <View className="mb-3 relative">
                        <View className="absolute left-[-15px] top-0.5 w-3 h-3 rounded-full border border-white" style={{ backgroundColor: "#26C6DA" }} />
                        <Text className="text-[10px] text-gray-500 mb-0.5 font-medium">Đặt hàng</Text>
                        <Text className="text-xs text-[#0F172A] font-semibold">{formatDateTime(order.created_at)}</Text>
                    </View>

                    {order.estimated_delivery && (
                        <View className="mb-3 relative">
                            <View className="absolute left-[-15px] top-0.5 w-3 h-3 rounded-full border border-white" style={{ backgroundColor: order.status === "delivering" ? "#26C6DA" : "#B0BEC5" }} />
                            <Text className="text-[10px] text-gray-500 mb-0.5 font-medium">Dự kiến giao</Text>
                            <Text className="text-xs text-[#0F172A] font-semibold">{formatDateTime(order.estimated_delivery)}</Text>
                        </View>
                    )}

                    {order.delivered_at && (
                        <View className="mb-3 relative">
                            <View className="absolute left-[-15px] top-0.5 w-3 h-3 rounded-full border border-white" style={{ backgroundColor: "#26C6DA" }} />
                            <Text className="text-[10px] text-gray-500 mb-0.5 font-medium">Đã giao</Text>
                            <Text className="text-xs text-[#0F172A] font-semibold">{formatDateTime(order.delivered_at)}</Text>
                        </View>
                    )}

                    {order.cancelled_at && (
                        <View className="relative">
                            <View className="absolute left-[-15px] top-0.5 w-3 h-3 rounded-full border border-white" style={{ backgroundColor: "#D32F2F" }} />
                            <Text className="text-[10px] text-gray-500 mb-0.5 font-medium">Đã huỷ</Text>
                            <Text className="text-xs text-[#0F172A] font-semibold">{formatDateTime(order.cancelled_at)}</Text>
                        </View>
                    )}
                </View>
            </View>

            {/* Payment Info */}
            <View className="bg-white mx-4 mt-3 rounded-xl p-3 border border-[#E6F6F9]" style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.08,
                shadowRadius: 8,
                elevation: 3,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                        <Ionicons name="card" size={18} color="#26C6DA" />
                    </View>
                    <Text className="text-sm font-bold text-[#0F172A]">Thanh toán</Text>
                </View>

                <View className="mb-3 pb-3 border-b border-[#F0F9FA]">
                    <View className="flex-row items-center">
                        <Ionicons name="wallet-outline" size={14} color="#26C6DA" />
                        <View className="flex-1 ml-2">
                            <Text className="text-[10px] text-gray-500 mb-1 font-medium">Phương thức thanh toán</Text>
                            <View className="flex-row items-center">
                                <View className="px-2 py-1 rounded-lg mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                                    <Ionicons 
                                        name={order.payment_method === "cash" ? "cash-outline" : "card-outline"} 
                                        size={12} 
                                        color="#26C6DA" 
                                    />
                                </View>
                                <Text className="text-xs text-[#0F172A] font-semibold">{paymentMethodMap[order.payment_method]}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View>
                    <Text className="text-[10px] text-gray-500 mb-1.5 font-medium">Trạng thái thanh toán</Text>
                    <View className="flex-row items-center">
                        <View
                            className="px-3 py-2 rounded-lg flex-row items-center"
                            style={{
                                backgroundColor:
                                    order.payment_status === "paid"
                                        ? "#E8F5E9"
                                        : order.payment_status === "refunded"
                                        ? "#FFF3E0"
                                        : "#FFEBEE",
                            }}
                        >
                            <Ionicons
                                name={
                                    order.payment_status === "paid"
                                        ? "checkmark-circle"
                                        : order.payment_status === "refunded"
                                        ? "refresh-circle"
                                        : "close-circle"
                                }
                                size={14}
                                color={
                                    order.payment_status === "paid"
                                        ? "#388E3C"
                                        : order.payment_status === "refunded"
                                        ? "#F57C00"
                                        : "#D32F2F"
                                }
                            />
                            <Text
                                className="text-xs font-semibold ml-1.5"
                                style={{
                                    color:
                                        order.payment_status === "paid"
                                            ? "#388E3C"
                                            : order.payment_status === "refunded"
                                            ? "#F57C00"
                                            : "#D32F2F",
                                }}
                            >
                                {order.payment_status === "paid"
                                    ? "Đã thanh toán"
                                    : order.payment_status === "refunded"
                                    ? "Đã hoàn tiền"
                                    : "Chưa thanh toán"}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Price Breakdown */}
            <View className="bg-gradient-to-br from-[#26C6DA] to-[#00BCD4] mx-4 mt-3 rounded-xl p-3 mb-3" style={{
                backgroundColor: "#26C6DA",
                shadowColor: "#26C6DA",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
            }}>
                <View className="flex-row items-center mb-3">
                    <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}>
                        <Ionicons name="receipt" size={18} color="#FFFFFF" />
                    </View>
                    <Text className="text-sm font-bold text-white">Tổng tiền</Text>
                </View>

                <View className="mb-3">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-xs text-white/90">Tạm tính</Text>
                        <Text className="text-xs text-white font-semibold">
                            {order.subtotal.toLocaleString()}đ
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-xs text-white/90">Phí giao hàng</Text>
                        <Text className="text-xs text-white font-semibold">
                            {order.delivery_fee.toLocaleString()}đ
                        </Text>
                    </View>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-xs text-white/90">Phí dịch vụ</Text>
                        <Text className="text-xs text-white font-semibold">
                            {order.service_fee.toLocaleString()}đ
                        </Text>
                    </View>
                    {order.discount > 0 && (
                        <View className="flex-row justify-between mb-2">
                            <View className="flex-row items-center">
                                <Ionicons name="pricetag" size={10} color="#FFFFFF" />
                                <Text className="text-xs text-white font-semibold ml-1">Giảm giá</Text>
                            </View>
                            <Text className="text-xs text-white font-bold">
                                -{order.discount.toLocaleString()}đ
                            </Text>
                        </View>
                    )}
                </View>

                <View className="pt-3 border-t border-white/30 mt-1">
                    <View className="flex-row justify-between items-center">
                        <Text className="text-base font-bold text-white">Tổng cộng</Text>
                        <View className="bg-white/20 rounded-lg px-3 py-1.5">
                            <Text className="text-lg font-bold text-white">
                                {order.total.toLocaleString()}đ
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Rating (if delivered and rated) */}
            {order.status === "delivered" && order.rating && (
                <View className="bg-white mx-4 mt-3 rounded-xl p-3 border border-[#E6F6F9] mb-3" style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.08,
                    shadowRadius: 8,
                    elevation: 3,
                }}>
                    <View className="flex-row items-center mb-3">
                        <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "#FFFBF0" }}>
                            <Ionicons name="star" size={18} color="#FBBF24" />
                        </View>
                        <Text className="text-sm font-bold text-[#0F172A]">Đánh giá của bạn</Text>
                    </View>

                    <View className="flex-row items-center mb-3 bg-[#FFFBF0] rounded-lg p-2.5">
                        <View className="flex-row items-center mr-3">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Ionicons
                                    key={star}
                                    name={star <= order.rating! ? "star" : "star-outline"}
                                    size={18}
                                    color="#FBBF24"
                                />
                            ))}
                        </View>
                        <View className="bg-white rounded-lg px-2 py-1">
                            <Text className="text-sm font-bold text-[#0F172A]">
                                {order.rating}/5
                            </Text>
                        </View>
                    </View>

                    {order.review && (
                        <View className="bg-[#FFFBF0] rounded-lg p-2.5 border border-[#FEF3C7]">
                            <View className="flex-row items-center mb-1.5">
                                <Ionicons name="chatbubble" size={12} color="#FBBF24" />
                                <Text className="text-[10px] text-gray-600 ml-1.5 font-medium">Nhận xét</Text>
                            </View>
                            <Text className="text-xs text-gray-700 leading-5">{order.review}</Text>
                        </View>
                    )}
                </View>
            )}

            {/* Cancellation Reason */}
            {order.status === "cancelled" && order.cancellation_reason && (
                <View className="bg-[#FFF5F5] mx-4 mt-3 rounded-xl p-3 border border-[#FEE2E2] mb-3">
                    <View className="flex-row items-start">
                        <View className="w-8 h-8 rounded-full items-center justify-center mr-2" style={{ backgroundColor: "#FEE2E2" }}>
                            <Ionicons name="close-circle" size={18} color="#D32F2F" />
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs font-bold text-[#D32F2F] mb-1.5">Lý do huỷ đơn</Text>
                            <Text className="text-xs text-[#B71C1C] leading-4">
                                {order.cancellation_reason}
                            </Text>
                        </View>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

