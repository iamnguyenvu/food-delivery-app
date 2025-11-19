import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

type Coupon = {
    id: string;
    code: string;
    discount_type: "percentage" | "free_delivery";
    discount_value: number;
    max_discount?: number | null;
    minimum_order?: number | null;
    applicable_to?: string | null;
    restaurant_ids?: string[] | null;
    usage_limit?: number | null;
    usage_per_user?: number | null;
    current_usage?: number | null;
    valid_from?: Date | null;
    valid_until?: Date | null;
    is_active: boolean;
    description?: string | null;
    terms?: string | null;
};

const MAIN_COLOR = "#26C6DA";

const formatCurrency = (value?: number | null) => {
    if (typeof value !== "number") return "0đ";
    try {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `${value.toLocaleString("vi-VN")}đ`;
    }
};

const formatDateTime = (date?: Date | null) =>
    date
        ? date.toLocaleString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "--";

const formatDateRange = (start?: Date | null, end?: Date | null) => {
    const from = formatDateTime(start);
    const to = formatDateTime(end);
    return `${from} – ${to}`;
};

export default function VoucherDetailScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams<{ id?: string }>();
    const [loading, setLoading] = useState(true);
    const [coupon, setCoupon] = useState<Coupon | null>(null);
    const [copied, setCopied] = useState(false);

    const termItems = useMemo(() => {
        if (!coupon?.terms) return [];
        return coupon.terms
            .split(/\n+/)
            .map((item) => item.trim())
            .filter(Boolean);
    }, [coupon?.terms]);

    useEffect(() => {
        if (id) {
            (async () => {
                try {
                    setLoading(true);
                    const { data, error } = await supabase
                        .from("coupons")
                        .select("*")
                        .eq("id", id)
                        .single();

                    if (error) throw error;

                    setCoupon(
                        data
                            ? {
                                  ...data,
                                  valid_from: data.valid_from
                                      ? new Date(data.valid_from)
                                      : null,
                                  valid_until: data.valid_until
                                      ? new Date(data.valid_until)
                                      : null,
                              }
                            : null
                    );
                } catch (err) {
                    console.error("Failed to load coupon detail", err);
                    setCoupon(null);
                } finally {
                    setLoading(false);
                }
            })();
        }
    }, [id]);

    const handleCopy = async () => {
        if (!coupon?.code) return;

        try {
            if (navigator?.clipboard?.writeText) {
                await navigator.clipboard.writeText(coupon.code);
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
                return;
            }

            alert("Thiết bị không hỗ trợ sao chép tự động. Bạn có thể nhấn giữ để copy.");
        } catch {
            alert("Không thể sao chép tự động. Hãy copy thủ công.");
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                <Pressable onPress={() => router.back()} className="p-2 mr-2">
                    <Ionicons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-semibold">Chi tiết voucher</Text>
            </View>

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color="#26C6DA" />
                    <Text className="text-sm text-gray-500 mt-3">
                        Đang tải chi tiết...
                    </Text>
                </View>
            ) : !coupon ? (
                <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-lg font-semibold text-[#0F172A] mb-1">
                        Không tìm thấy voucher
                    </Text>
                    <Text className="text-sm text-gray-500 text-center">
                        Voucher có thể đã bị xoá hoặc không tồn tại.
                    </Text>
                </View>
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 160 }}
                >
                    <LinearGradient
                        colors={[MAIN_COLOR, "#8EF1FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="w-full pt-6 pb-12"
                    >
                        <View className="px-4">
                            <View style={styles.ticketCard}>
                                <View style={styles.ticketSide}>
                                    <Ionicons name="restaurant" size={32} color="#fff" />
                                    <Text style={styles.ticketSideLabel}>
                                        {coupon.applicable_to === "all" ? "Tất cả quán" : "Quán đối tác"}
                                    </Text>

                                    <View style={[styles.notch, { top: 20 }]} />
                                    <View style={[styles.notch, { bottom: 20 }]} />
                                </View>

                                <View style={styles.ticketContent}>
                                    <Text style={styles.ticketTitle}>
                                        {coupon.discount_type === "percentage"
                                            ? `Giảm ${coupon.discount_value}% cho đơn từ ${formatCurrency(
                                                  coupon.minimum_order || 0
                                              )}`
                                            : `Giảm ${formatCurrency(coupon.discount_value)} cho đơn từ ${formatCurrency(
                                                  coupon.minimum_order || 0
                                              )}`}
                                    </Text>
                                    <View style={styles.ticketTag}>
                                        <Text style={styles.ticketTagText}>Ưu đãi có hạn</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    <View className="px-4 mt-10 space-y-6">
                        <View>
                            <Text className="text-base font-semibold text-[#1F2937] mb-2">
                                Mã voucher
                            </Text>
                            <View className="flex-row items-center space-x-3 ">
                                <Text selectable className="text-xl font-bold tracking-wider text-[#111]">
                                    {coupon.code}
                                </Text>

                                <Pressable onPress={handleCopy}>
                                    <Text className="text-[#26C6DA] font-semibold ml-3">
                                        {copied ? "Đã sao chép" : "Sao chép"}
                                    </Text>
                                </Pressable>
                            </View>
                        </View>

                        <View className="border-t border-gray-100 pt-4">
                            <Text className="text-base font-semibold text-[#1F2937] mb-1">
                                Hạn sử dụng
                            </Text>
                            <Text className="text-[14px] text-gray-700 leading-relaxed">
                                {formatDateRange(coupon.valid_from, coupon.valid_until)}
                            </Text>
                        </View>

                        <View className="border-t border-gray-100 pt-4">
                            <Text className="text-base font-semibold text-[#1F2937] mb-1">
                                Quán áp dụng
                            </Text>
                            <Text className="text-[14px] text-gray-700">
                                {coupon.applicable_to === "all" ? "Tất cả quán" : "Quán đối tác"}
                            </Text>
                        </View>

                        <View className="border-t border-gray-100 pt-4">
                            <Text className="text-base font-semibold text-[#1F2937] mb-1">
                                Phương thức giao hàng
                            </Text>
                            <Text className="text-[14px] text-gray-700">Giao hàng</Text>
                        </View>

                        <View className="border-t border-gray-100 pt-4">
                            <Text className="text-base font-semibold text-[#1F2937] mb-1">
                                Điều kiện
                            </Text>

                            <View className="space-y-2">
                                <Text className="text-[14px] text-gray-700">
                                    - Áp dụng cho đơn từ {formatCurrency(coupon.minimum_order || 0)}
                                </Text>

                                {coupon.description && (
                                    <Text className="text-[14px] text-gray-700">{coupon.description}</Text>
                                )}

                                {termItems.length > 0 ? (
                                    termItems.map((item, index) => (
                                        <Text
                                            key={`${item}-${index}`}
                                            className="text-[14px] text-gray-700 leading-relaxed"
                                        >
                                            - {item}
                                        </Text>
                                    ))
                                ) : (
                                    <Text className="text-[14px] text-gray-500">
                                        Không có điều kiện bổ sung.
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                </ScrollView>
            )}
            {!loading && coupon && (
                <View
                    style={[
                        styles.bottomBar,
                        {
                            paddingBottom: Math.max(insets.bottom, 12),
                        },
                    ]}
                >
                    <Pressable style={styles.ctaButton}>
                        <Text className="text-white text-[16px] font-semibold">Dùng ngay</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    ticketCard: {
        flexDirection: "row",
        borderRadius: 20,
        backgroundColor: "#fff",
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
        elevation: 6,
    },
    ticketSide: {
        width: 110,
        backgroundColor: MAIN_COLOR,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 28,
        paddingHorizontal: 16,
    },
    ticketSideLabel: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "600",
        textAlign: "center",
        textTransform: "uppercase",
        marginTop: 10,
    },
    ticketContent: {
        flex: 1,
        paddingVertical: 20,
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    ticketTitle: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: "600",
        color: "#0F172A",
    },
    ticketTag: {
        alignSelf: "flex-start",
        marginTop: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: MAIN_COLOR,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    ticketTagText: {
        fontSize: 12,
        fontWeight: "600",
        color: MAIN_COLOR,
    },
    notch: {
        position: "absolute",
        right: -12,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#fff",
    },
    bottomBar: {
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "#fff",
        paddingHorizontal: 16,
        paddingTop: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: "#E2E8F0",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 12,
    },
    ctaButton: {
        backgroundColor: MAIN_COLOR,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 14,
    },
});

