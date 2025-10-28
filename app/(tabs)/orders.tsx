import { useState, useEffect } from "react";
import { ScrollView, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
import { Text } from "@/components/Themed";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {useAuth} from "@/src/contexts/AuthContext";

// type mock data
interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

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

interface FoodSuggestion {
    id: string;
    name: string;
    image: string;
    distance: string;
    rating: number;
}

// mock data
const ordersMockData: Order[] = [
    {
        id: "123-456789",
        status: "Đang giao",
        restaurant: "Bánh Bao Thịt Xiên Nướng Bờm - Lê Đức Thọ",
        thumbnail:
            "https://statics.didau.com/image/2022/09/20/3bef34ffa4174ab18486cadcf89ecd36.jpg",
        items: [{ name: "Xiên thịt nướng", quantity: 1, price: 40000 }],
        total: 40000,
        date: new Date("2025-01-15T20:32:00"),
        deliveryEstimate: 35,
        type: "Đồ ăn",
    },
];


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
];

// UI Tabs
const tabs: { key: string; icon: keyof typeof Ionicons.glyphMap }[] = [
    { key: "Đang đến", icon: "fast-food-outline" },
    { key: "Deal đã mua", icon: "pricetag-outline" },
    { key: "Lịch sử", icon: "time-outline" },
    { key: "Đánh giá", icon: "star-outline" },
    { key: "Đơn nháp", icon: "document-text-outline" },
];

export default function OrderScreen() {
    const [activeTab, setActiveTab] = useState<string>("Đang đến");
    const [loading, setLoading] = useState<boolean>(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [suggestions] = useState<FoodSuggestion[]>(suggestedFoodsMock);

    // When the user is not logged in, display the login page.
    // const { session } = useAuth();
    // useEffect(() => {
    //    if (!session) router.replace("/login");
    // }, [session]);

    const fetchData = async (tab: string) => {
        setLoading(true);
        setTimeout(() => {
            if (tab === "Đang đến") setOrders(ordersMockData);
            else setOrders([]);
            setLoading(false);
        }, 400);
    };

    useEffect(() => {
        fetchData(activeTab);
    }, [activeTab]);

    return (
        <View className="flex-1 bg-white pt-10">
            <View className="px-5 pb-3">
                <Text lightColor="#000" darkColor="#fff" className={"text-2xl font-bold"}></Text>
            </View>

            <TabsUI activeTab={activeTab} onChange={setActiveTab} />

            <ScrollView className="flex-1 px-4 mt-6">
                {loading ? (
                    <ActivityIndicator />
                ) : (
                    <>
                        {/*Tab Dang den*/}
                        {activeTab === "Đang đến" && (
                            <>
                                {orders.length > 0
                                    ? orders.map((item) => <OrderCard key={item.id} order={item} />)
                                    : <EmptyTabView tab="Đang đến" />
                                }

                                {/* Tabs recoment foods */}
                                <SuggestionSection foods={suggestions} />
                            </>
                        )}

                        {/*Tabs Deal da mua*/}
                        {activeTab === "Deal đã mua" && (
                            <>
                                {orders.length > 0
                                    ? orders.map((item) => <OrderCard key={item.id} order={item} />)
                                    : <EmptyTabView tab="Deal đã mua" />
                                }
                            </>
                        )}

                        {/*Tabs lich su*/}
                        {activeTab === "Lịch sử" && (
                            <>
                                {orders.length > 0
                                    ? orders.map((item) => <OrderCard key={item.id} order={item} />)
                                    : <EmptyTabView tab="Lịch sử" />
                                }
                            </>
                        )}

                        {/*Tabs danh gia*/}
                        {activeTab === "Đánh giá" && (
                            <>
                                {orders.length > 0
                                    ? orders.map((item) => <OrderCard key={item.id} order={item} />)
                                    : <EmptyTabView tab="Đánh giá" />
                                }
                            </>
                        )}

                        {/*Tabs don nhap*/}
                        {activeTab === "Đơn nháp" && (
                            <>
                                {orders.length > 0
                                    ? orders.map((item) => <OrderCard key={item.id} order={item} />)
                                    : <EmptyTabView tab="Đơn nháp" />
                                }
                            </>
                        )}
                    </>
                )}

            </ScrollView>
        </View>
    );
}

// UI — TABS
function TabsUI({
                    activeTab,
                    onChange,
                }: {
    activeTab: string;
    onChange: (key: string) => void;
}) {
    return (
        <View className="flex-row px-5 mt-3 border-b border-gray-200">
            {tabs.map((tab) => (
                <TouchableOpacity
                    key={tab.key}
                    className="mr-6 pb-3 items-center"
                    onPress={() => onChange(tab.key)}
                >
                    <Ionicons
                        name={tab.icon}
                        size={22}
                        color={activeTab === tab.key ? "#26C6DA" : "#7E7E7E"}
                    />
                    <Text
                        lightColor={activeTab === tab.key ?"#26C6DA":"#555"}
                        darkColor={activeTab === tab.key ?"#26C6DA":"#bbb"}
                        className={`text-xs mt-1 ${activeTab === tab.key ? "font-bold": ""}`}
                    >
                        {tab.key}
                    </Text>

                    {activeTab === tab.key && (
                        <View className="h-1 w-8 bg-primary-400 mt-1 rounded-full" />
                    )}
                </TouchableOpacity>
            ))}
        </View>
    );
}

// UI — EMPTY
function EmptyTabView({ tab }: { tab: string }) {
    return (
        <View className="items-center justify-center mt-20">
            <Ionicons name="receipt-outline" size={70} color="#26C6DA" />
            <Text lightColor={"#000"} darkColor={"#fff"} className={"text-lg font-bold text-center mt-4"}>
                {tab} chưa có dữ liệu
            </Text>
        </View>
    );
}

// UI — ORDER CARD
function OrderCard({ order }: { order: Order }) {
    const isDelivering = order.status === "Đang giao";

    return (
        <View className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
            <Text
                lightColor={isDelivering ? "#26C6DA" : "#2E7D32"}
                darkColor={isDelivering ? "#26C6DA" : "#81C784"}
                className="text-xs font-bold mb-2"
            >
                {order.status}
            </Text>

            <View className="flex-row items-center">
                <Image
                    source={{ uri: order.thumbnail }}
                    className="w-20 h-20 rounded-xl mr-3"
                />

                <View className="flex-1">
                    <Text lightColor="#000" darkColor="#fff" className="font-bold text-[15px]" numberOfLines={1}>
                        {order.items[0].name}
                    </Text>


                    <Text lightColor="#444" darkColor="#ccc" className="text-xs mt-1">
                        {order.items[0].quantity} món • {order.total.toLocaleString()}đ
                    </Text>


                    {isDelivering ? (
                        <Text lightColor="#26C6DA" darkColor="#26C6DA" className="text-xs mt-1">
                            Dự kiến giao lúc: {
                            new Date(order.date.getTime() + order.deliveryEstimate * 60000)
                                .toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
                        }
                        </Text>
                    ) : (
                        <Text lightColor="#2E7D32" darkColor="#81C784" className="text-xs mt-1">
                            Đã giao lúc: {order.date.toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                        </Text>
                    )}

                </View>
            </View>
        </View>
    );
}

// UI - Recomment foods
function SuggestionSection({ foods }: { foods: FoodSuggestion[] }) {
    return (
        <View className="mt-8">
            <Text lightColor="#000" darkColor="#fff" className="font-bold text-lg mb-3">
                Có thể bạn cũng thích
            </Text>

            {foods.map((item) => (
                <View
                    key={item.id}
                    className="flex-row bg-white rounded-xl p-3 mb-3 border border-gray-100"
                >
                    <Image
                        source={{ uri: item.image }}
                        className="w-20 h-20 rounded-xl mr-3"
                    />
                    <View className="flex-1">
                        <Text lightColor="#000" darkColor="#fff" className="font-semibold text-[15px]">
                            {item.name}
                        </Text>
                        <Text lightColor="#26C6DA" darkColor="#26C6DA" className="text-xs mt-1">
                            ⭐ {item.rating} • {item.distance}
                        </Text>

                    </View>
                </View>
            ))}
        </View>
    );
}
