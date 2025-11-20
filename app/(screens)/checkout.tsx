import { useAuth } from "@/src/hooks/useAuth";
import { supabase } from "@/src/lib/supabase";
import { useCartStore } from "@/src/store/cartStore";
import { useLocationStore } from "@/src/store/locationStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type PaymentMethod = "cash" | "card" | "momo" | "zalopay" | "bank_transfer";

const DELIVERY_FEE = 15000; // 15,000 VND default delivery fee
const SERVICE_FEE = 0; // No service fee for now
const TAX_RATE = 0.1; // 10% VAT

export default function CheckoutScreen() {
    const insets = useSafeAreaInsets();
    const { user } = useAuth();
    const { items, getTotalPrice, getTotalDiscount, getRestaurantId, clearCart } = useCartStore();
    const { location, address } = useLocationStore();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("cash");
    const [deliveryNotes, setDeliveryNotes] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPaymentMethods, setShowPaymentMethods] = useState(false);

    // Redirect to login if not authenticated (use useEffect to avoid setState during render)
    useEffect(() => {
        if (!user) {
            router.replace("/(screens)/login" as any);
        }
    }, [user]);

    // Show loading while redirecting to login
    if (!user) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#26C6DA" />
                </View>
            </SafeAreaView>
        );
    }

    // Calculate totals
    const subtotal = getTotalPrice();
    const itemDiscount = getTotalDiscount();
    const couponDiscount = appliedCoupon?.discount || 0;
    const deliveryFee = DELIVERY_FEE;
    const serviceFee = SERVICE_FEE;
    const tax = (subtotal - itemDiscount - couponDiscount) * TAX_RATE;
    const total = subtotal - itemDiscount - couponDiscount + deliveryFee + serviceFee + tax;

    // Get restaurant ID from cart store
    const restaurantId = getRestaurantId();

    // Check if address is set
    const hasAddress = !!address?.formatted;

    // Payment methods (matching database enum)
    const paymentMethods: { id: PaymentMethod; label: string; icon: string }[] = [
        { id: "cash", label: "Tiền mặt", icon: "cash" },
        { id: "card", label: "Thẻ tín dụng/Ghi nợ", icon: "card" },
        { id: "momo", label: "Ví MoMo", icon: "phone-portrait" },
        { id: "zalopay", label: "ZaloPay", icon: "wallet" },
    ];

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            Alert.alert("Lỗi", "Vui lòng nhập mã giảm giá");
            return;
        }

        try {
            const { data, error } = await supabase
                .from("coupons")
                .select("*")
                .eq("code", couponCode.toUpperCase())
                .eq("is_active", true)
                .single();

            if (error || !data) {
                Alert.alert("Lỗi", "Mã giảm giá không hợp lệ hoặc đã hết hạn");
                return;
            }

            // Check if coupon is valid
            const now = new Date();
            const validFrom = data.valid_from ? new Date(data.valid_from) : null;
            const validUntil = data.valid_until ? new Date(data.valid_until) : null;

            if (validFrom && now < validFrom) {
                Alert.alert("Lỗi", "Mã giảm giá chưa có hiệu lực");
                return;
            }

            if (validUntil && now > validUntil) {
                Alert.alert("Lỗi", "Mã giảm giá đã hết hạn");
                return;
            }

            // Check minimum order
            if (data.minimum_order && subtotal < data.minimum_order) {
                Alert.alert(
                    "Lỗi",
                    `Đơn hàng tối thiểu ${data.minimum_order.toLocaleString("vi-VN")}đ để áp dụng mã này`
                );
                return;
            }

            // Calculate discount
            let discount = 0;
            if (data.discount_type === "percentage") {
                discount = (subtotal * data.discount_value) / 100;
                if (data.max_discount) {
                    discount = Math.min(discount, data.max_discount);
                }
            } else if (data.discount_type === "free_delivery") {
                discount = deliveryFee;
            }

            setAppliedCoupon({ code: data.code, discount });
            Alert.alert("Thành công", `Đã áp dụng mã giảm giá ${data.code}`);
        } catch (error) {
            console.error("Error applying coupon:", error);
            Alert.alert("Lỗi", "Không thể áp dụng mã giảm giá");
        }
    };

    const handleRemoveCoupon = () => {
        setAppliedCoupon(null);
        setCouponCode("");
    };

    const handlePlaceOrder = async () => {
        if (!hasAddress) {
            Alert.alert("Lỗi", "Vui lòng chọn địa chỉ giao hàng", [
                {
                    text: "Chọn địa chỉ",
                    onPress: () => router.push("/(screens)/address-input"),
                },
                { text: "Hủy", style: "cancel" },
            ]);
            return;
        }

        if (!user) {
            Alert.alert("Lỗi", "Vui lòng đăng nhập để đặt hàng");
            router.push("/(screens)/login");
            return;
        }

        if (items.length === 0) {
            Alert.alert("Lỗi", "Giỏ hàng trống");
            router.back();
            return;
        }

        setIsSubmitting(true);

        try {
            // Generate order number
            const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

            // Prepare delivery address as JSON object
            const deliveryAddressData = {
                formatted: address?.formatted || "",
                street: address?.street || "",
                latitude: location?.latitude || null,
                longitude: location?.longitude || null,
            };

            // Create order (match database schema)
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .insert({
                    user_id: user.id,
                    restaurant_id: restaurantId,
                    order_number: orderNumber,
                    status: "pending",
                    subtotal: subtotal,
                    delivery_fee: deliveryFee,
                    tax_amount: tax,
                    discount_amount: itemDiscount + couponDiscount,
                    total_amount: total,
                    delivery_address: deliveryAddressData,
                    estimated_delivery_time: 30, // 30 minutes
                    payment_method: selectedPaymentMethod,
                    payment_status: selectedPaymentMethod === "cash" ? "pending" : "pending",
                    notes: deliveryNotes || null,
                })
                .select()
                .single();

            if (orderError) {
                throw orderError;
            }

            // Create order items (match database schema)
            const orderItems = items.map((item) => ({
                order_id: orderData.id,
                dish_id: item.dish.id,
                dish_name: item.dish.name,
                dish_price: item.dish.price,
                quantity: item.quantity,
                subtotal: item.dish.price * item.quantity,
                notes: item.notes || null,
                options: item.options ? JSON.stringify(item.options) : null,
            }));

            const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

            if (itemsError) {
                throw itemsError;
            }

            // Clear cart
            clearCart();

            // Navigate to order success/confirmation
            Alert.alert(
                "Đặt hàng thành công!",
                `Đơn hàng ${orderNumber} đã được đặt thành công. Chúng tôi sẽ liên hệ với bạn sớm nhất.`,
                [
                    {
                        text: "Xem đơn hàng",
                        onPress: () => {
                            router.replace("/(tabs)/orders");
                        },
                    },
                    {
                        text: "Về trang chủ",
                        onPress: () => {
                            router.replace("/(tabs)");
                        },
                    },
                ]
            );
        } catch (error: any) {
            console.error("Error placing order:", error);
            Alert.alert("Lỗi", error.message || "Không thể đặt hàng. Vui lòng thử lại.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (items.length === 0) {
        return (
            <SafeAreaView className="flex-1 bg-white">
                <View className="flex-1 items-center justify-center px-8">
                    <Ionicons name="cart-outline" size={64} color="#9CA3AF" />
                    <Text className="text-xl font-bold text-gray-800 mt-4 mb-2">
                        Giỏ hàng trống
                    </Text>
                    <Text className="text-gray-500 text-center mb-6">
                        Vui lòng thêm món vào giỏ hàng trước khi thanh toán
                    </Text>
                    <Pressable
                        onPress={() => router.back()}
                        className="bg-primary-400 rounded-full px-6 py-3"
                    >
                        <Text className="text-white font-semibold">Quay lại</Text>
                    </Pressable>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-gray-50">
            {/* Header */}
            <View className="bg-white px-4 py-3 border-b border-gray-200 flex-row items-center">
                <Pressable onPress={() => router.back()} className="p-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-semibold flex-1">Thanh toán</Text>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Delivery Address */}
                <View className="bg-white mt-2 px-4 py-4 border-b border-gray-100">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-base font-semibold text-gray-800">Địa chỉ giao hàng</Text>
                        <Pressable
                            onPress={() => router.push("/(screens)/address-input")}
                            className="flex-row items-center"
                        >
                            <Text className="text-primary-400 font-medium mr-1">
                                {hasAddress ? "Thay đổi" : "Chọn địa chỉ"}
                            </Text>
                            <Ionicons name="chevron-forward" size={16} color="#26C6DA" />
                        </Pressable>
                    </View>
                    {hasAddress ? (
                        <View className="flex-row items-start">
                            <Ionicons name="location" size={20} color="#26C6DA" />
                            <Text className="flex-1 ml-2 text-gray-700">{address.formatted}</Text>
                        </View>
                    ) : (
                        <View className="flex-row items-center py-2">
                            <Ionicons name="location-outline" size={20} color="#9CA3AF" />
                            <Text className="ml-2 text-gray-500">Chưa chọn địa chỉ</Text>
                        </View>
                    )}
                </View>

                {/* Order Items */}
                <View className="bg-white mt-2 px-4 py-4">
                    <Text className="text-base font-semibold text-gray-800 mb-3">Đơn hàng</Text>
                    {items.map((item) => (
                        <View key={item.dish.id} className="flex-row items-center mb-4 last:mb-0">
                            <View className="w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                                {item.dish.image ? (
                                    <Image
                                        source={{ uri: item.dish.image }}
                                        className="w-full h-full"
                                        resizeMode="cover"
                                    />
                                ) : (
                                    <View className="w-full h-full items-center justify-center">
                                        <Ionicons name="restaurant" size={24} color="#9CA3AF" />
                                    </View>
                                )}
                            </View>
                            <View className="flex-1 ml-3">
                                <Text className="text-sm font-semibold text-gray-800" numberOfLines={1}>
                                    {item.dish.name}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">
                                    {item.dish.price.toLocaleString("vi-VN")}đ × {item.quantity}
                                </Text>
                            </View>
                            <Text className="text-sm font-bold text-gray-800">
                                {(item.dish.price * item.quantity).toLocaleString("vi-VN")}đ
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Coupon Code */}
                <View className="bg-white mt-2 px-4 py-4">
                    <Text className="text-base font-semibold text-gray-800 mb-3">Mã giảm giá</Text>
                    {appliedCoupon ? (
                        <View className="flex-row items-center justify-between bg-green-50 rounded-lg p-3">
                            <View className="flex-row items-center flex-1">
                                <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                                <Text className="ml-2 text-sm font-medium text-green-800">
                                    {appliedCoupon.code} - Giảm{" "}
                                    {appliedCoupon.discount.toLocaleString("vi-VN")}đ
                                </Text>
                            </View>
                            <Pressable onPress={handleRemoveCoupon}>
                                <Ionicons name="close-circle" size={20} color="#10B981" />
                            </Pressable>
                        </View>
                    ) : (
                        <View className="flex-row gap-2">
                            <TextInput
                                value={couponCode}
                                onChangeText={setCouponCode}
                                placeholder="Nhập mã giảm giá"
                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2"
                                autoCapitalize="characters"
                            />
                            <Pressable
                                onPress={handleApplyCoupon}
                                className="bg-primary-400 rounded-lg px-4 py-2"
                            >
                                <Text className="text-white font-semibold">Áp dụng</Text>
                            </Pressable>
                        </View>
                    )}
                </View>

                {/* Payment Method */}
                <View className="bg-white mt-2 px-4 py-4">
                    <Pressable
                        onPress={() => setShowPaymentMethods(!showPaymentMethods)}
                        className="flex-row items-center justify-between"
                    >
                        <Text className="text-base font-semibold text-gray-800">Phương thức thanh toán</Text>
                        <View className="flex-row items-center">
                            <Text className="text-gray-600 mr-2">
                                {paymentMethods.find((m) => m.id === selectedPaymentMethod)?.label}
                            </Text>
                            <Ionicons
                                name={showPaymentMethods ? "chevron-up" : "chevron-down"}
                                size={20}
                                color="#6B7280"
                            />
                        </View>
                    </Pressable>
                    {showPaymentMethods && (
                        <View className="mt-3 space-y-2">
                            {paymentMethods.map((method) => (
                                <Pressable
                                    key={method.id}
                                    onPress={() => {
                                        setSelectedPaymentMethod(method.id);
                                        setShowPaymentMethods(false);
                                    }}
                                    className={`flex-row items-center p-3 rounded-lg border-2 ${
                                        selectedPaymentMethod === method.id
                                            ? "border-primary-400 bg-primary-50"
                                            : "border-gray-200 bg-white"
                                    }`}
                                >
                                    <Ionicons
                                        name={method.icon as any}
                                        size={20}
                                        color={selectedPaymentMethod === method.id ? "#26C6DA" : "#6B7280"}
                                    />
                                    <Text
                                        className={`ml-3 flex-1 font-medium ${
                                            selectedPaymentMethod === method.id
                                                ? "text-primary-400"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        {method.label}
                                    </Text>
                                    {selectedPaymentMethod === method.id && (
                                        <Ionicons name="checkmark-circle" size={20} color="#26C6DA" />
                                    )}
                                </Pressable>
                            ))}
                        </View>
                    )}
                </View>

                {/* Delivery Notes */}
                <View className="bg-white mt-2 px-4 py-4">
                    <Text className="text-base font-semibold text-gray-800 mb-3">
                        Ghi chú cho tài xế (tùy chọn)
                    </Text>
                    <TextInput
                        value={deliveryNotes}
                        onChangeText={setDeliveryNotes}
                        placeholder="Ví dụ: Gọi trước khi đến, để ở cổng..."
                        multiline
                        numberOfLines={3}
                        className="border border-gray-300 rounded-lg px-3 py-2 text-gray-700"
                        textAlignVertical="top"
                    />
                </View>

                {/* Price Summary */}
                <View className="bg-white mt-2 px-4 py-4 mb-4">
                    <Text className="text-base font-semibold text-gray-800 mb-3">Tóm tắt đơn hàng</Text>
                    <View className="space-y-2">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Tạm tính</Text>
                            <Text className="text-gray-800">{subtotal.toLocaleString("vi-VN")}đ</Text>
                        </View>
                        {itemDiscount > 0 && (
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Giảm giá món</Text>
                                <Text className="text-red-500">-{itemDiscount.toLocaleString("vi-VN")}đ</Text>
                            </View>
                        )}
                        {appliedCoupon && (
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Mã giảm giá</Text>
                                <Text className="text-red-500">
                                    -{appliedCoupon.discount.toLocaleString("vi-VN")}đ
                                </Text>
                            </View>
                        )}
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Phí giao hàng</Text>
                            <Text className="text-gray-800">{deliveryFee.toLocaleString("vi-VN")}đ</Text>
                        </View>
                        {serviceFee > 0 && (
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Phí dịch vụ</Text>
                                <Text className="text-gray-800">{serviceFee.toLocaleString("vi-VN")}đ</Text>
                            </View>
                        )}
                        {tax > 0 && (
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">VAT (10%)</Text>
                                <Text className="text-gray-800">{tax.toLocaleString("vi-VN")}đ</Text>
                            </View>
                        )}
                        <View className="border-t border-gray-200 pt-2 mt-2">
                            <View className="flex-row justify-between items-center">
                                <Text className="text-lg font-bold text-gray-800">Tổng cộng</Text>
                                <Text className="text-xl font-bold text-primary-400">
                                    {total.toLocaleString("vi-VN")}đ
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View
                className="bg-white border-t border-gray-200 px-4 pt-3"
                style={{ paddingBottom: Math.max(insets.bottom, 12) }}
            >
                <View className="flex-row items-center justify-between mb-3">
                    <Text className="text-gray-600">Tổng cộng</Text>
                    <Text className="text-xl font-bold text-primary-400">
                        {total.toLocaleString("vi-VN")}đ
                    </Text>
                </View>
                <Pressable
                    onPress={handlePlaceOrder}
                    disabled={isSubmitting || !hasAddress}
                    className={`rounded-full py-4 items-center ${
                        isSubmitting || !hasAddress
                            ? "bg-gray-300"
                            : "bg-primary-400 active:opacity-90"
                    }`}
                >
                    {isSubmitting ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text className="text-white font-bold text-base">
                            {!hasAddress ? "Chọn địa chỉ giao hàng" : "Đặt hàng"}
                        </Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

