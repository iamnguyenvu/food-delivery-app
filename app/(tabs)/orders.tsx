import { Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, View } from "react-native";

// Order type
interface OrderItem { name: string; quantity: number; price: number; }
interface Order {
    id: string;
    status: "Đang giao" | "Đã giao";
    restaurant: string;
    thumbnail: string;
    items: OrderItem[];
    total: number;
    date: Date;
    deliveryEstimate: number;
    type: string;
}
interface FoodSuggestion { id: string; name: string; image: string; distance: string; rating: number; }

// mocks data for order
const ordersMockData: Order[] = [
    {
        id: "123-456789",
        status: "Đang giao",
        restaurant: "Bánh Bao Xiên Nướng Bờm - Lê Đức Thọ",
        thumbnail: "https://statics.didau.com/image/2022/09/20/3bef34ffa4174ab18486cadcf89ecd36.jpg",
        items: [{ name: "Xiên thịt nướng", quantity: 1, price: 40000 }],
        total: 40000,
        date: new Date(),
        deliveryEstimate: 35,
        type: "Đồ ăn",
    },
];
// mocks data for food suggestion
const suggestedFoodsMock: FoodSuggestion[] = [
    {
        id: "f3",
        name: "Trà Chanh BỐI BỐI",
        rating: 4.7,
        distance: "0.2 km",
        image: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(95)/https://cms-prod.s3-sgn09.fptcloud.com/cach_lam_tra_chanh_cuc_ngon_giai_nhiet_ngay_nong1_3b47897bee.jpg"
    },
    {
        id: "f7",
        name: "Trà Sữa Đường Đen",
        rating: 4.9,
        distance: "0.4 km",
        image: "https://mixuediemdien.com/wp-content/uploads/2024/03/Sua-tuoi-tran-chau-duong-den.jpg"
    },
    {
        id: "f7",
        name: "Trà Sữa Đường Đen",
        rating: 4.9,
        distance: "0.4 km",
        image: "https://mixuediemdien.com/wp-content/uploads/2024/03/Sua-tuoi-tran-chau-duong-den.jpg"
    },
    {
        id: "f7",
        name: "Trà Sữa Đường Đen",
        rating: 4.9,
        distance: "0.4 km",
        image: "https://mixuediemdien.com/wp-content/uploads/2024/03/Sua-tuoi-tran-chau-duong-den.jpg"
    },
    {
        id: "f7",
        name: "Trà Sữa Đường Đen",
        rating: 4.9,
        distance: "0.4 km",
        image: "https://mixuediemdien.com/wp-content/uploads/2024/03/Sua-tuoi-tran-chau-duong-den.jpg"
    },
];

//Tab labels & their icons
const tabs = ["Đang đến", "Deal đã mua", "Lịch sử", "Đánh giá", "Đơn nháp"];
const tabIcons: Record<string, string> = {
    "Đang đến": "bicycle-outline",
    "Deal đã mua": "pricetag-outline",
    "Lịch sử": "time-outline",
    "Đánh giá": "star-outline",
    "Đơn nháp": "document-text-outline"
};

// Order screen
export default function OrderScreen() {
    const [activeTab, setActiveTab] = useState("Đang đến");
    const [loading, setLoading] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [suggestions] = useState(suggestedFoodsMock);

    const fetchData = (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            if (tab === "Đang đến") setOrders(ordersMockData);
            else setOrders([]);
            setLoading(false);
        }, 350);
    };
    

    useEffect(() => { fetchData(activeTab); }, [activeTab]);

    return (
        <View className="flex-1 bg-white pt-6">

            {/* HEADER */}
            <View className="flex-row justify-between items-center px-5 pb-4 bg-white shadow-sm">
                <Text className="text-2xl font-semibold text-black">Đơn hàng</Text>
                <View className="rounded-lg bg-gray-50 p-2 border border-gray-200">
                    <Ionicons name="search" size={18} color="#4B5563" />
                </View>
            </View>

            <TabsUI activeTab={activeTab} onChange={setActiveTab} />

            <ScrollView className="flex-1 px-4 mt-0">
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        {orders.length > 0
                            ? orders.map(item => <OrderCard key={item.id} order={item} />)
                            : <EmptyTabView />}

                        <SuggestionSection foods={suggestions} />
                    </>
                )}
            </ScrollView>
        </View>
    );
}

// The tabs bar helps with navigation
function TabsUI({ activeTab, onChange }: { activeTab: string; onChange: (k: string) => void }) {
    return (
        <View className="flex-row justify-around px-1 py-1 bg-white border-b border-gray-100">
            {tabs.map((tab, i) => {
                const isActive = activeTab === tab;
                return (
                    <Pressable
                        key={i}
                        onPress={() => onChange(tab)}
                        className="items-center px-3 pb-1"
                    >
                        <Ionicons
                            name={tabIcons[tab] as any}
                            size={17}
                            color={isActive ? "#26C6DA" : "#9CA3AF"}
                        />
                        <Text
                            className={`text-xs mt-0.5 ${
                                isActive
                                     ? "font-semibold text-primary-400"
                                         : "text-black"
                            }`}
                        >
                            {tab}
                        </Text>
                        {isActive && (
                            <View className="h-1 w-7 bg-primary-400 mt-1 rounded-lg" />
                        )}
                    </Pressable>
                );
            })}
        </View>
    );
}


// displayed when there are no orders
function EmptyTabView() {
    return (
        <View className="items-center justify-center mt-16 px-8">
            <Ionicons name="clipboard-outline" size={80} color="#26C6DA" />
            <Text className="text-lg font-semibold mt-4 text-center text-black">
                Bạn chưa có đơn nào
            </Text>
            <Text className="text-black text-sm mt-2 text-center">
                Các đơn đã đặt sẽ hiển thị tại đây
            </Text>
            <Pressable className="mt-5 bg-primary-400 px-6 py-2 rounded-lg shadow-sm">
                <Text className="text-white font-medium">
                    Đặt ngay
                </Text>
            </Pressable>
        </View>
    );
}

// display order item
function OrderCard({ order }: { order: Order }) {
    const deliveryDeadline = new Date(order.date.getTime() + order.deliveryEstimate * 60000);
    const deliveryTime = deliveryDeadline.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    const [nowMs, setNowMs] = useState<number>(Date.now());
    const timerRef = useRef<any>(null);

    useEffect(() => {
        if (order.status !== "Đang giao") return;
        // start ticking once per second until deadline is reached
        timerRef.current = setInterval(() => {
            setNowMs((current) => {
                const next = Date.now();
                if (next >= deliveryDeadline.getTime() && timerRef.current) {
                    clearInterval(timerRef.current);
                    timerRef.current = null;
                }
                return next;
            });
        }, 1000);
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [order.status, order.date, order.deliveryEstimate]);

    const totalMs = Math.max(0, deliveryDeadline.getTime() - order.date.getTime());
    const elapsedMs = Math.max(0, nowMs - order.date.getTime());
    const progressPct = totalMs > 0 ? Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100))) : 0;

    return (
        <Pressable className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4 active:opacity-80">

            <View className="flex-row justify-between">
                <Text className="text-black text-xs">
                    {order.type} • #{order.id}
                </Text>
                <Text className="text-black text-xs">
                    {order.date.toLocaleString("vi-VN")}
                </Text>
            </View>

            <View className="flex-row items-center mt-2">
                <Text className="font-semibold text-[15px] flex-1 text-black">
                    {order.restaurant}
                </Text>
                <Ionicons name="fast-food-outline" size={20} color="#26C6DA" />
            </View>

            <View className="flex-row items-center mt-3">
                <Image source={{ uri: order.thumbnail }} className="w-20 h-20 rounded-xl mr-3" />
                <View style={{ flex: 1 }}>
                    <Text className="text-[14px]">{order.items[0].name}</Text>
                    <Text className="text-black text-xs mt-1">
                        {order.items[0].quantity} món • {order.total.toLocaleString()}đ
                    </Text>
                </View>
            </View>

            <View className="flex-row justify-between mt-3">
                <View className={`px-2 py-1 rounded-md ${
                    order.status === "Đang giao"
                        ? "bg-green-50"
                        : "bg-blue-50"
                }`}>
                    <Text
                        className={`text-xs font-medium ${
                            order.status === "Đang giao"
                                ? "text-green-700"
                                : "text-blue-700"
                        }`}
                    >
                        {order.status}
                    </Text>
                </View>

                <Text className="text-black text-xs">
                    Đang tìm tài xế…
                </Text>
            </View>

            <View className="flex-row items-center mt-1">
                <Ionicons name="time-outline" size={14} color="#6B7280" />
                <Text className="text-black text-xs ml-1">
                    Dự kiến giao lúc {deliveryTime}
                </Text>
            </View>

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
        </Pressable>
    );
}
//Suggestion list Recommended items
function SuggestionSection({ foods }: { foods: FoodSuggestion[] }) {
    return (
        <View className="mt-8 mb-10">
            <View className="flex-row items-center justify-between pr-1 mb-3">
                <Text className="font-bold text-lg">Có thể bạn cũng thích</Text>
                <Pressable className="px-2 py-1">
                    <Text className="text-xs text-[#00ACC1] font-semibold">Xem tất cả</Text>
                </Pressable>
            </View>

            <View>
                {foods.map((item, index) => (
                    <SuggestionCard key={`${item.id}-${index}`} item={item} />
                ))}
            </View>
        </View>
    );
}
// display suggestion item
function SuggestionCard({ item }: { item: FoodSuggestion }) {
    return (
        <Pressable className="flex-row bg-white rounded-xl p-3 mb-3 shadow-sm border border-gray-200 active:opacity-90">
            <View>
                <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl" />
                <View className="absolute top-1 left-1 px-1.5 py-0.5 rounded-xl bg-primary-400/60">
                    <Text className="text-[10px] text-white">⭐ {item.rating.toFixed(1)}</Text>
                </View>
            </View>

            <View className="flex-1 ml-3 justify-center">
                <Text className="font-semibold text-[15px] text-black" numberOfLines={1}>
                    {item.name}
                </Text>
                <View className="flex-row items-center mt-1">
                    <View className="px-2 py-0.5 rounded-xl bg-white border border-[#eee] mr-2">
                        <Text className="text-[10px] text-black">
                            {item.distance}
                        </Text>
                    </View>
                    <View className="px-2 py-0.5 rounded-xl bg-[#FFF4E5]">
                        <Text className="text-orange-600 text-[10px] font-semibold">Gợi ý</Text>
                    </View>
                </View>
            </View>

            <View className="justify-center">
                <View className="flex-row items-center px-3 py-1 rounded-lg border border-primary-400">
                    <Ionicons name="add" size={14} color="#26C6DA" />
                    <Text className="text-xs text-primary-400 ml-1 font-medium">Thêm</Text>
                </View>
            </View>
        </Pressable>
    );
}
