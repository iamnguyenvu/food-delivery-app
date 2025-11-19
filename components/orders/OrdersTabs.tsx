import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import EmptyTabView from "./EmptyTabView";
import OrderCard from "./OrderCard";
import OrderDetail from "./OrderDetail";
import { Dish, Order, ordersMockData } from "./OrderTypeAndMock";
import SuggestionSection from "./SuggestionSection";

// Custom Date Picker Component
function CustomDatePicker({
                              visible,
                              value,
                              onClose,
                              onConfirm
                          }: {
    visible: boolean;
    value: Date;
    onClose: () => void;
    onConfirm: (date: Date) => void;
}) {
    const [selectedDate, setSelectedDate] = useState(value);
    const dayScrollRef = useRef<ScrollView>(null);
    const monthScrollRef = useRef<ScrollView>(null);
    const yearScrollRef = useRef<ScrollView>(null);

    const daysInMonth = (month: number, year: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const months = [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
        "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - 10 + i);

    useEffect(() => {
        if (visible) {
            setSelectedDate(value);
            // Auto-scroll to selected values after a short delay
            setTimeout(() => {
                const day = value.getDate();
                const month = value.getMonth();
                const year = value.getFullYear();
                const yearIndex = years.findIndex(y => y === year);

                // Scroll to selected day (approximately 40px per item)
                dayScrollRef.current?.scrollTo({ y: (day - 1) * 40, animated: true });
                // Scroll to selected month (approximately 40px per item)
                monthScrollRef.current?.scrollTo({ y: month * 40, animated: true });
                // Scroll to selected year (approximately 40px per item)
                if (yearIndex >= 0) {
                    yearScrollRef.current?.scrollTo({ y: yearIndex * 40, animated: true });
                }
            }, 100);
        }
    }, [visible, value]);

    const handleConfirm = () => {
        onConfirm(selectedDate);
        onClose();
    };

    const handleDayChange = (day: number) => {
        const maxDay = daysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());
        const newDay = Math.min(Math.max(1, day), maxDay);
        setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), newDay));
    };

    const handleMonthChange = (month: number) => {
        const maxDay = daysInMonth(month, selectedDate.getFullYear());
        const currentDay = Math.min(selectedDate.getDate(), maxDay);
        setSelectedDate(new Date(selectedDate.getFullYear(), month, currentDay));
    };

    const handleYearChange = (year: number) => {
        const maxDay = daysInMonth(selectedDate.getMonth(), year);
        const currentDay = Math.min(selectedDate.getDate(), maxDay);
        setSelectedDate(new Date(year, selectedDate.getMonth(), currentDay));
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-end">
                <View className="bg-white rounded-md p-5" style={{ maxHeight: "60%" }}>
                    <View className="flex-row items-center justify-between mb-4">
                        <Text className="text-lg font-bold text-[#0F172A]">Chọn ngày</Text>
                        <Pressable onPress={onClose}>
                            <View className="w-8 h-8 rounded-md items-center justify-center" style={{ backgroundColor: "#F2FBFD" }}>
                                <Ionicons name="close" size={20} color="#26C6DA" />
                            </View>
                        </Pressable>
                    </View>

                    <View className="flex-row justify-between mb-4" style={{ height: 200 }}>
                        {/* Day Picker */}
                        <View className="flex-1 mr-2">
                            <Text className="text-xs text-gray-600 mb-2 text-center font-medium">Ngày</Text>
                            <ScrollView
                                ref={dayScrollRef}
                                className="border border-[#D3F3F7] rounded-md bg-[#F8FDFE]"
                                showsVerticalScrollIndicator={false}
                            >
                                {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                                    const maxDay = daysInMonth(selectedDate.getMonth(), selectedDate.getFullYear());
                                    if (day > maxDay) return null;
                                    const isSelected = day === selectedDate.getDate();
                                    return (
                                        <Pressable
                                            key={day}
                                            onPress={() => handleDayChange(day)}
                                            className={`py-3 px-4 items-center ${isSelected ? "bg-[#26C6DA]" : ""}`}
                                        >
                                            <Text className={`text-sm font-semibold ${isSelected ? "text-white" : "text-black"}`}>
                                                {day}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Month Picker */}
                        <View className="flex-1 mr-2">
                            <Text className="text-xs text-gray-600 mb-2 text-center font-medium">Tháng</Text>
                            <ScrollView
                                ref={monthScrollRef}
                                className="border border-[#D3F3F7] rounded-md bg-[#F8FDFE]"
                                showsVerticalScrollIndicator={false}
                            >
                                {months.map((month, index) => {
                                    const isSelected = index === selectedDate.getMonth();
                                    return (
                                        <Pressable
                                            key={index}
                                            onPress={() => handleMonthChange(index)}
                                            className={`py-3 px-2 items-center ${isSelected ? "bg-[#26C6DA]" : ""}`}
                                        >
                                            <Text className={`text-xs font-semibold ${isSelected ? "text-white" : "text-black"}`} numberOfLines={1}>
                                                {month}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>

                        {/* Year Picker */}
                        <View className="flex-1">
                            <Text className="text-xs text-gray-600 mb-2 text-center font-medium">Năm</Text>
                            <ScrollView
                                ref={yearScrollRef}
                                className="border border-[#D3F3F7] rounded-md bg-[#F8FDFE]"
                                showsVerticalScrollIndicator={false}
                            >
                                {years.map((year) => {
                                    const isSelected = year === selectedDate.getFullYear();
                                    return (
                                        <Pressable
                                            key={year}
                                            onPress={() => handleYearChange(year)}
                                            className={`py-3 px-4 items-center ${isSelected ? "bg-[#26C6DA]" : ""}`}
                                        >
                                            <Text className={`text-sm font-semibold ${isSelected ? "text-white" : "text-black"}`}>
                                                {year}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    </View>

                    <View className="flex-row mt-4">
                        <Pressable
                            onPress={onClose}
                            className="px-4 py-3 rounded-md border border-[#D3F3F7] bg-white mr-2 flex-1"
                        >
                            <Text className="text-sm font-semibold text-[#177C8A] text-center">Huỷ</Text>
                        </Pressable>
                        <Pressable
                            onPress={handleConfirm}
                            className="px-4 py-3 rounded-md bg-[#26C6DA] flex-1"
                            style={{
                                shadowColor: "#26C6DA",
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: 0.2,
                                shadowRadius: 4,
                                elevation: 3,
                            }}
                        >
                            <Text className="text-sm font-semibold text-white text-center">Xác nhận</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

export default function OrdersTabs({ activeTab }: { activeTab: string }) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);
    // History tab date filter: selection and applied range
    const today = new Date();
    const defaultFrom = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15);
    const defaultTo = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const [fromDateSel, setFromDateSel] = useState<Date>(defaultFrom);
    const [toDateSel, setToDateSel] = useState<Date>(defaultTo);
    const [fromDateApplied, setFromDateApplied] = useState<Date>(defaultFrom);
    const [toDateApplied, setToDateApplied] = useState<Date>(defaultTo);
    const [showFromPicker, setShowFromPicker] = useState(false);
    const [showToPicker, setShowToPicker] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewingOrder, setReviewingOrder] = useState<Order | null>(null);
    const [reviewRating, setReviewRating] = useState<number>(0);
    const [reviewText, setReviewText] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState<string>("");

    const fetchData = async (tab: string) => {
        setLoading(true);

        let statusList: string[] = [];

        if (tab === "Đang đến") {
            statusList = [
                "pending",
                "preparing",
                "ready_for_pickup",
                "delivering"
            ];
        }

        if (tab === "Deal đã mua") {
            statusList = ["delivered"];
        }

        if (tab === "Lịch sử") {
            statusList = ["delivered", "cancelled"];
        }

        if (tab === "Đánh giá") {
            statusList = ["delivered"];
        }

        if (tab === "Đơn nháp") {
            statusList = ["draft"];
        }

        //    mock order data
        setOrders(
            ordersMockData.filter(o =>
                statusList.includes(o.status)
            )
        );
        setLoading(false);

        // get data for supabase
        /*
        const { data, error } = await supabase
            .from("orders")
            .select("*")
            .in("status", statusList)
            // .ilike("order_number", `%${searchQuery}%`) // when enabling server-side search
            // .or(`restaurant_name.ilike.%${searchQuery}%,items.name.ilike.%${searchQuery}%`) // adjust to schema
            .order("created_at", { ascending: false });

        if (!error && data) {
            setOrders(
                data.map(o => ({
                    ...o,
                    created_at: new Date(o.created_at),
                    estimated_delivery: new Date(o.estimated_delivery),
                    delivered_at: o.delivered_at ? new Date(o.delivered_at) : undefined,
                    cancelled_at: o.cancelled_at ? new Date(o.cancelled_at) : undefined,
                    reviewed_at: o.reviewed_at ? new Date(o.reviewed_at) : undefined,
                }))
            );
        } else {
            setOrders([]);
        }

        setLoading(false);
        */
    };

    const fetchSuggestedDishes = async () => {
        const { data, error } = await supabase
            .from("dishes")
            .select("*")
            .eq("is_available", true)
            .order("created_at", { ascending: false });

        if (!error && data) {
            const shuffled = [...data].sort(() => 0.5 - Math.random());
            setDishes(shuffled.slice(0, 5));
        }
    };

    useEffect(() => {
        fetchData(activeTab);
        if (activeTab === "Đang đến") fetchSuggestedDishes();
    }, [activeTab]);

    // text search across orders
    const matchesSearch = (o: Order) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.trim().toLowerCase();
        const inOrderNumber = o.order_number.toLowerCase().includes(q);
        const inRestaurant = o.restaurant_name.toLowerCase().includes(q);
        const inItems = o.items.some(it => it.name.toLowerCase().includes(q));
        return inOrderNumber || inRestaurant || inItems;
    };

    // filter orders by applied date range on History tab, then search
    const visibleOrders = (
        activeTab === "Lịch sử"
            ? orders.filter(o => {
                if (!fromDateApplied || !toDateApplied) return true;
                // Normalize to date-only boundaries
                const created = new Date(o.created_at.getFullYear(), o.created_at.getMonth(), o.created_at.getDate());
                const fromOnly = new Date(fromDateApplied.getFullYear(), fromDateApplied.getMonth(), fromDateApplied.getDate());
                const toOnly = new Date(toDateApplied.getFullYear(), toDateApplied.getMonth(), toDateApplied.getDate());
                return created >= fromOnly && created <= toOnly;
            })
            : orders
    ).filter(matchesSearch);

    return (
        <ScrollView
            className="flex-1 px-4 pt-4 pb-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 24 + insets.bottom + 80 }}
        >
            {loading ? (
                <View className="py-10 items-center">
                    <ActivityIndicator color="#26C6DA" size="large" />
                    <Text className="text-sm text-gray-500 mt-3">Đang tải đơn hàng...</Text>
                </View>
            ) : (
                <>
                    {/* Search Bar */}
                    <View className="mb-4 flex-row items-center bg-white border border-[#D3F3F7] rounded-md px-4 py-3 shadow-sm">
                        <Ionicons name="search" size={18} color="#26C6DA" />
                        <TextInput
                            placeholder="Tìm theo mã đơn, nhà hàng, món..."
                            placeholderTextColor="#7AA6AD"
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            className="flex-1 text-[14px] text-[#0F1C1F] ml-3"
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery("")} className="ml-2">
                                <Ionicons name="close-circle" size={18} color="#26C6DA" />
                            </Pressable>
                        )}
                    </View>
                    {activeTab === "Lịch sử" && (
                        <View className="mb-4 bg-white rounded-md p-4 border border-[#E6F6F9] shadow-sm">
                            <View className="flex-row items-center mb-3">
                                <View className="w-8 h-8 rounded-md items-center justify-center mr-2" style={{ backgroundColor: "#E0F7FA" }}>
                                    <Ionicons name="calendar" size={16} color="#26C6DA" />
                                </View>
                                <Text className="text-[15px] font-bold text-[#0F172A]">Lọc theo khoảng thời gian</Text>
                            </View>
                            <View className="flex-row mb-3">
                                <Pressable
                                    onPress={() => {
                                        const now = new Date();
                                        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
                                        setFromDateSel(from);
                                        setToDateSel(now);
                                        setFromDateApplied(from);
                                        setToDateApplied(now);
                                    }}
                                    className="px-4 py-2 rounded-md bg-[#F2FBFD] border border-[#D3F3F7] mr-2"
                                >
                                    <Text className="text-xs font-semibold text-[#26C6DA]">7 ngày</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        const now = new Date();
                                        const from = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30);
                                        setFromDateSel(from);
                                        setToDateSel(now);
                                        setFromDateApplied(from);
                                        setToDateApplied(now);
                                    }}
                                    className="px-4 py-2 rounded-md bg-[#F2FBFD] border border-[#D3F3F7]"
                                >
                                    <Text className="text-xs font-semibold text-[#26C6DA]">30 ngày</Text>
                                </Pressable>
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-600 mb-2 font-medium">Từ ngày</Text>
                                {Platform.OS === "web" ? (
                                    <TextInput
                                        // @ts-ignore web-only type
                                        type="date"
                                        value={`${fromDateSel.getFullYear()}-${String(fromDateSel.getMonth() + 1).padStart(2, "0")}-${String(fromDateSel.getDate()).padStart(2, "0")}`}
                                        onChangeText={(v) => {
                                            const next = new Date(v);
                                            if (isNaN(next.getTime())) return;
                                            if (next > toDateSel) {
                                                setFromDateSel(next);
                                                setToDateSel(next);
                                            } else {
                                                setFromDateSel(next);
                                            }
                                        }}
                                        className="border border-[#D3F3F7] rounded-md px-4 py-2.5 text-black bg-[#F8FDFE]"
                                    />
                                ) : (
                                    <>
                                        <Pressable
                                            onPress={() => setShowFromPicker(true)}
                                            className="border border-[#D3F3F7] rounded-md px-4 py-2.5 bg-[#F8FDFE]"
                                        >
                                            <Text className="text-sm text-black">{fromDateSel.toLocaleDateString("vi-VN")}</Text>
                                        </Pressable>
                                        <CustomDatePicker
                                            visible={showFromPicker}
                                            value={fromDateSel}
                                            onClose={() => setShowFromPicker(false)}
                                            onConfirm={(selected) => {
                                                const next = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
                                                if (next > toDateSel) {
                                                    setFromDateSel(next);
                                                    setToDateSel(next);
                                                } else {
                                                    setFromDateSel(next);
                                                }
                                            }}
                                        />
                                    </>
                                )}
                            </View>

                            <View className="mb-3">
                                <Text className="text-xs text-gray-600 mb-2 font-medium">Đến ngày</Text>
                                {Platform.OS === "web" ? (
                                    <TextInput
                                        // @ts-ignore web-only type
                                        type="date"
                                        value={`${toDateSel.getFullYear()}-${String(toDateSel.getMonth() + 1).padStart(2, "0")}-${String(toDateSel.getDate()).padStart(2, "0")}`}
                                        onChangeText={(v) => {
                                            const next = new Date(v);
                                            if (isNaN(next.getTime())) return;
                                            if (next < fromDateSel) {
                                                setToDateSel(next);
                                                setFromDateSel(next);
                                            } else {
                                                setToDateSel(next);
                                            }
                                        }}
                                        className="border border-[#D3F3F7] rounded-md px-4 py-2.5 text-black bg-[#F8FDFE]"
                                    />
                                ) : (
                                    <>
                                        <Pressable
                                            onPress={() => setShowToPicker(true)}
                                            className="border border-[#D3F3F7] rounded-md px-4 py-2.5 bg-[#F8FDFE]"
                                        >
                                            <Text className="text-sm text-black">{toDateSel.toLocaleDateString("vi-VN")}</Text>
                                        </Pressable>
                                        <CustomDatePicker
                                            visible={showToPicker}
                                            value={toDateSel}
                                            onClose={() => setShowToPicker(false)}
                                            onConfirm={(selected) => {
                                                const next = new Date(selected.getFullYear(), selected.getMonth(), selected.getDate());
                                                if (next < fromDateSel) {
                                                    setToDateSel(next);
                                                    setFromDateSel(next);
                                                } else {
                                                    setToDateSel(next);
                                                }
                                            }}
                                        />
                                    </>
                                )}
                            </View>

                            <View className="flex-row items-center">
                                <Pressable
                                    onPress={() => {
                                        setFromDateSel(defaultFrom);
                                        setToDateSel(defaultTo);
                                        setFromDateApplied(defaultFrom);
                                        setToDateApplied(defaultTo);
                                    }}
                                    className="px-4 py-2.5 rounded-md border border-[#D3F3F7] bg-white mr-2 flex-1"
                                >
                                    <Text className="text-xs font-semibold text-[#177C8A] text-center">Đặt lại</Text>
                                </Pressable>
                                <Pressable
                                    onPress={() => {
                                        setFromDateApplied(fromDateSel);
                                        setToDateApplied(toDateSel);
                                    }}
                                    className="px-4 py-2.5 rounded-md bg-[#26C6DA] flex-1"
                                    style={{
                                        shadowColor: "#26C6DA",
                                        shadowOffset: { width: 0, height: 2 },
                                        shadowOpacity: 0.2,
                                        shadowRadius: 4,
                                        elevation: 3,
                                    }}
                                >
                                    <Text className="text-xs font-semibold text-white text-center">Xác nhận</Text>
                                </Pressable>
                            </View>

                            <View className="mt-3 pt-3 border-t border-[#E0F7FA]">
                                <Text className="text-[12px] text-gray-500 text-center">
                                    {fromDateApplied.toLocaleDateString("vi-VN")} — {toDateApplied.toLocaleDateString("vi-VN")}
                                </Text>
                            </View>
                        </View>
                    )}

                    {visibleOrders.length > 0
                        ? visibleOrders.map(item => (
                            <OrderCard
                                key={item.id}
                                order={item}
                                contextTab={activeTab}
                                onPress={() => {
                                    setSelectedOrder(item);
                                    setShowOrderDetail(true);
                                }}
                                onReviewPress={(o) => {
                                    setReviewingOrder(o);
                                    setReviewRating(5);
                                    setReviewText("");
                                    setShowReviewModal(true);
                                }}
                            />
                        ))
                        : <EmptyTabView />}

                    {activeTab === "Đang đến" && dishes.length > 0 && (
                        <SuggestionSection dishes={dishes} />
                    )}
                </>
            )}

            {/* Order Detail Modal */}
            <Modal
                visible={showOrderDetail}
                animationType="slide"
                presentationStyle="fullScreen"
                statusBarTranslucent={true}
                onRequestClose={() => setShowOrderDetail(false)}
            >
                <View className="flex-1 bg-[#F8FDFE]">
                    <SafeAreaView className="flex-1" edges={['top']}>
                        {/* Header */}
                        <View className="bg-white px-4 pt-3 pb-3 border-b border-[#E0F7FA]">
                            <View className="flex-row items-center">
                                <Pressable onPress={() => setShowOrderDetail(false)} className="w-10 h-10 items-center justify-center -ml-1">
                                    <Ionicons name="arrow-back" size={22} color="#0F172A" />
                                </Pressable>
                                <View className="flex-1 items-center">
                                    <Text className="text-xl font-bold text-[#0F172A]">Chi tiết đơn hàng</Text>
                                    {selectedOrder && (
                                        <Text className="text-[11px] text-gray-500 mt-0.5">#{selectedOrder.order_number}</Text>
                                    )}
                                </View>
                                {/* right spacer to balance layout */}
                                <View className="w-10" />
                            </View>
                        </View>

                        {selectedOrder && <OrderDetail order={selectedOrder} />}
                    </SafeAreaView>
                </View>
            </Modal>

            {/* Review Modal */}
            <Modal
                visible={showReviewModal}
                transparent
                animationType="slide"
                presentationStyle="overFullScreen"
                statusBarTranslucent
                onRequestClose={() => setShowReviewModal(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-md p-5" style={{ maxHeight: "80%" }}>
                        <View className="flex-row items-center justify-between mb-4">
                            <View>
                                <Text className="text-[20px] font-bold text-[#0F172A]">Đánh giá đơn hàng</Text>
                                {reviewingOrder && (
                                    <Text className="text-xs text-gray-500 mt-1">
                                        #{reviewingOrder.order_number} • {reviewingOrder.restaurant_name}
                                    </Text>
                                )}
                            </View>
                            <Pressable onPress={() => setShowReviewModal(false)}>
                                <View className="w-8 h-8 rounded-md items-center justify-center" style={{ backgroundColor: "#F2FBFD" }}>
                                    <Ionicons name="close" size={20} color="#26C6DA" />
                                </View>
                            </Pressable>
                        </View>

                        <View className="items-center mb-4">
                            <View className="flex-row items-center mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Pressable
                                        key={star}
                                        onPress={() => setReviewRating(star)}
                                        className="mx-1"
                                    >
                                        <Ionicons
                                            name={reviewRating >= star ? "star" : "star-outline"}
                                            size={36}
                                            color={reviewRating >= star ? "#FBBF24" : "#D1D5DB"}
                                        />
                                    </Pressable>
                                ))}
                            </View>
                            <Text className="text-sm text-gray-600">
                                {reviewRating > 0 ? `${reviewRating}/5 sao` : "Chọn số sao"}
                            </Text>
                        </View>

                        <TextInput
                            placeholder="Chia sẻ cảm nhận của bạn (tuỳ chọn)"
                            placeholderTextColor="#9CA3AF"
                            value={reviewText}
                            onChangeText={setReviewText}
                            multiline
                            className="border border-[#D3F3F7] rounded-md px-4 py-3 text-black min-h-[100px] bg-[#F8FDFE] mb-4"
                            textAlignVertical="top"
                        />

                        <View className="flex-row">
                            <Pressable
                                onPress={() => setShowReviewModal(false)}
                                className="px-4 py-3 rounded-md border border-[#D3F3F7] bg-white mr-2 flex-1"
                            >
                                <Text className="text-sm font-semibold text-[#177C8A] text-center">Huỷ</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => {
                                    if (!reviewingOrder) return;
                                    // Update local orders state
                                    setOrders((prev) =>
                                        prev.map((o) =>
                                            o.id === reviewingOrder.id
                                                ? {
                                                    ...o,
                                                    rating: reviewRating,
                                                    review: reviewText.trim() || undefined,
                                                    reviewed_at: new Date(),
                                                }
                                                : o
                                        )
                                    );

                                    /*
                                    // When backend is ready, uncomment to persist review to Supabase
                                    (async () => {
                                        try {
                                            await supabase
                                                .from("orders")
                                                .update({
                                                    rating: reviewRating,
                                                    review: reviewText.trim() || null,
                                                    reviewed_at: new Date().toISOString()
                                                })
                                                .eq("id", reviewingOrder.id);
                                        } catch (e) {
                                            // Optionally: handle error or revert optimistic update
                                        }
                                    })();
                                    */
                                    setShowReviewModal(false);
                                    setReviewingOrder(null);
                                }}
                                className={`px-4 py-3 rounded-md flex-1 ${
                                    reviewRating > 0 ? "bg-[#26C6DA]" : "bg-gray-300"
                                }`}
                                disabled={reviewRating === 0}
                                style={
                                    reviewRating > 0
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
                                <Text className="text-sm font-semibold text-white text-center">
                                    Gửi đánh giá
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}