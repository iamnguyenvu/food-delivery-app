import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    RefreshControl,
    ScrollView,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

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

const FILTERS = [
    { key: "all", label: "Tất cả" },
    { key: "percentage", label: "Giảm giá món" },
    { key: "free_delivery", label: "Phí vận chuyển" },
] as const;

type ScreenMode = "active" | "history";

function createVoucherScreen(mode: ScreenMode) {
    return function VoucherScreen() {
        const router = useRouter();
        const [loading, setLoading] = useState(true);
        const [refreshing, setRefreshing] = useState(false);
        const [activeFilter, setActiveFilter] =
            useState<(typeof FILTERS)[number]["key"]>("all");
        const [coupons, setCoupons] = useState<Coupon[]>([]);

        const showHistory = mode === "history";

        const fetchCoupons = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from("coupons")
                    .select("*")
                    .in("discount_type", ["percentage", "free_delivery"])
                    .order("valid_until", { ascending: true });

                if (error) throw error;

                setCoupons(
                    (data || []).map((item) => ({
                        ...item,
                        valid_from: item.valid_from ? new Date(item.valid_from) : null,
                        valid_until: item.valid_until
                            ? new Date(item.valid_until)
                            : null,
                    }))
                );
            } catch (err) {
                console.error("Failed to fetch coupons", err);
                setCoupons([]);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        };

        useEffect(() => {
            fetchCoupons();
        }, []);

        const handleRefresh = () => {
            setRefreshing(true);
            fetchCoupons();
        };

        const isExpiredOrUsed = (coupon: Coupon) => {
            const now = new Date();
            const expired =
                (coupon.valid_until && coupon.valid_until < now) ||
                !coupon.is_active;
            const usedUp =
                coupon.usage_limit !== null &&
                coupon.usage_limit !== undefined &&
                coupon.current_usage !== null &&
                coupon.current_usage !== undefined &&
                coupon.current_usage >= coupon.usage_limit;
            return expired || usedUp;
        };

        const displayedCoupons = useMemo(() => {
            return coupons
                .filter((coupon) => {
                    const expiredOrUsed = isExpiredOrUsed(coupon);
                    const matchesHistory = showHistory ? expiredOrUsed : !expiredOrUsed;
                    const matchesFilter =
                        activeFilter === "all" || coupon.discount_type === activeFilter;
                    return matchesHistory && matchesFilter;
                })
                .sort((a, b) => {
                    const timeA = a.valid_until
                        ? a.valid_until.getTime()
                        : Number.MAX_SAFE_INTEGER;
                    const timeB = b.valid_until
                        ? b.valid_until.getTime()
                        : Number.MAX_SAFE_INTEGER;
                    return timeA - timeB;
                });
        }, [coupons, showHistory, activeFilter]);

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

        const formatDate = (date?: Date | null) => {
            if (!date) return "--";
            return date.toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        };

        const renderCouponCard = (coupon: Coupon) => {
            const expired = isExpiredOrUsed(coupon);
            const actionLabel = showHistory
                ? expired
                    ? "Đã hết hạn"
                    : "Đã dùng"
                : "Dùng ngay";
            const actionStyles = showHistory
                ? {
                      borderColor: "#CBD5F5",
                      color: "#64748B",
                      backgroundColor: "#F8FAFC",
                  }
                : {
                      borderColor: "#26C6DA",
                      color: "#26C6DA",
                      backgroundColor: "rgba(38, 198, 218, 0.1)",
                  };

            return (
                <View
                    key={coupon.id}
                    className="flex-row bg-white rounded-md mb-2 border border-[#E6F6F9]"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.04,
                        shadowRadius: 3,
                        elevation: 1,
                    }}
                >
                    <View
                        className="w-[72px] rounded-md items-center justify-center px-2 py-3"
                        style={{ backgroundColor: "#26C6DA" }}
                    >
                        <Ionicons name="gift" size={22} color="#FFFFFF" />
                        <Text className="text-white text-[10px] font-semibold mt-2 text-center">
                            {coupon.applicable_to === "all"
                                ? "Tất cả quán"
                                : "Quán chọn lọc"}
                        </Text>
                    </View>
                    <View className="flex-1 px-3 py-2.5">
                        <View className="flex-row justify-between items-start mb-1.5">
                            <Text className="text-[13px] font-semibold text-[#0F172A] flex-1 pr-2">
                                {coupon.discount_type === "percentage"
                                    ? `Giảm ${coupon.discount_value}%`
                                    : `Giảm ${formatCurrency(
                                          coupon.discount_value
                                      )} phí VC`}
                            </Text>
                            <Pressable
                                className="px-2.5 py-1 rounded-md border"
                                style={{
                                    borderColor: actionStyles.borderColor,
                                    backgroundColor: actionStyles.backgroundColor,
                                }}
                            >
                                <Text
                                    className="text-[10px] font-semibold"
                                    style={{ color: actionStyles.color }}
                                >
                                    {actionLabel}
                                </Text>
                            </Pressable>
                        </View>
                        <Text className="text-[11px] text-gray-600 mb-1">
                            Đơn tối thiểu{" "}
                            {coupon.minimum_order
                                ? formatCurrency(coupon.minimum_order)
                                : "0đ"}
                        </Text>
                        <View className="flex-row items-center mb-1.5">
                            <View className="px-2 py-1 rounded-md bg-[#F2FBFD] mr-2 border border-[#D3F3F7]">
                                <Text className="text-[10px] text-[#177C8A] font-semibold">
                                    {coupon.usage_limit
                                        ? `Giới hạn ${coupon.usage_limit}`
                                        : "Ưu đãi có hạn"}
                                </Text>
                            </View>
                            <Pressable
                                onPress={() =>
                                    router.push({
                                        pathname: "/voucher/voucher-detail",
                                        params: { id: coupon.id },
                                    })
                                }
                            >
                                <Text className="text-[10px] text-[#177C8A] font-semibold">
                                    Điều kiện
                                </Text>
                            </Pressable>
                        </View>
                        <View className="flex-row justify-between items-center">
                            <Text className="text-[10px] text-gray-500">
                                HSD: {formatDate(coupon.valid_until)}
                            </Text>
                            <Text className="text-[10px] text-gray-400">
                                {coupon.code}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        };

        const headerTitle = showHistory ? "Lịch sử voucher" : "Ví Voucher";

        return (
            <SafeAreaView className="flex-1 bg-white">

                <View className="bg-white px-4 py-3 border-b border-[#E5E5E5]">
                    <View className="flex-row items-center justify-between">

                        {/* LEFT: Back + Title */}
                        <View className="flex-row items-center">
                            <Pressable
                                onPress={() => router.back()}
                                className="p-2 -ml-1"
                                hitSlop={10}
                            >
                                <Ionicons name="arrow-back" size={26} color="#000" />
                            </Pressable>

                            <Text
                                className="text-lg text-[#000] ml-1"
                                style={{
                                    fontFamily: "Pacifico-Regular",
                                }}
                            >
                                {headerTitle}
                            </Text>
                        </View>

                        {/* RIGHT: History Button */}
                        {!showHistory && (
                            <Pressable
                                onPress={() =>
                                    router.push("/voucher/voucher-history" as any)
                                }
                                className="px-4 py-2 rounded-xl border"
                                style={{ borderColor: "#D6EEF4" }}
                            >
                                <Text className="text-xs font-semibold text-[#177C8A]">
                                    Lịch sử
                                </Text>
                            </Pressable>
                        )}
                    </View>
                </View>


                <View className="bg-white px-2 pt-1 pb-0.5 border-b border-[#E0F7FA] flex-row">
                    {FILTERS.map((filter) => {
                        const active = activeFilter === filter.key;
                        return (
                            <Pressable
                                key={filter.key}
                                onPress={() => setActiveFilter(filter.key)}
                                className="flex-1 items-center py-3"
                            >
                                <Text
                                    className={`text-sm font-semibold ${
                                        active ? "text-[#26C6DA]" : "text-[#94A3B8]"
                                    }`}
                                >
                                    {filter.label}
                                </Text>
                                <View
                                    className={`h-1 w-16 rounded-md mt-2 ${
                                        active ? "bg-[#26C6DA]" : "bg-transparent"
                                    }`}
                                />
                            </Pressable>
                        );
                    })}
                </View>

                {loading ? (
                    <View className="flex-1 items-center justify-center">
                        <ActivityIndicator size="large" color="#26C6DA" />
                        <Text className="text-sm text-gray-500 mt-3">
                            Đang tải voucher...
                        </Text>
                    </View>
                ) : (
                    <ScrollView
                        className="flex-1 px-4"
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                colors={["#26C6DA"]}
                            />
                        }
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                    >
                        {displayedCoupons.length === 0 ? (
                            <View className="items-center justify-center py-16">
                                <View className="w-24 h-24 rounded-md bg-[#E0F7FA] items-center justify-center mb-4">
                                    <Ionicons name="ticket" size={36} color="#26C6DA" />
                                </View>
                                <Text className="text-lg font-semibold text-[#0F172A] mb-1">
                                    Không có voucher phù hợp
                                </Text>
                                <Text className="text-sm text-gray-500 text-center px-6">
                                    Bạn chưa có voucher hết hiệu lực hoặc đã sử dụng.
                                </Text>
                            </View>
                        ) : (
                            displayedCoupons.map(renderCouponCard)
                        )}
                    </ScrollView>
                )}

            </SafeAreaView>
        );
    };
}

const VouchersScreen = createVoucherScreen("active");
export default VouchersScreen;
export { createVoucherScreen };

