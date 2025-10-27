// import { useState, useEffect } from "react";
// import { ScrollView, TouchableOpacity, View, Image, ActivityIndicator } from "react-native";
// import { Text } from "@/components/Themed";
// import { Ionicons } from "@expo/vector-icons";
// import { router } from "expo-router";
//
// // import { useAuth } from "@/src/contexts/AuthContext"; // ✅ bật lại khi có login
// import { foods } from "@/components/data/foods";
// import { ordersMockData } from "@/components/data/orders";
//
// /* ✅ Các Tab Đơn hàng */
// const tabs = [
//     { key: "Đang đến", icon: "fast-food-outline" },
//     { key: "Deal đã mua", icon: "pricetag-outline" },
//     { key: "Lịch sử", icon: "time-outline" },
//     { key: "Đánh giá", icon: "star-outline" },
//     { key: "Đơn nháp", icon: "document-text-outline" },
// ];
//
// export default function OrderScreen() {
//     const [activeTab, setActiveTab] = useState("Đang đến");
//     const [loading, setLoading] = useState(false);
//     const [orders, setOrders] = useState<any[]>([]);
//
//     const suggestedFoods = foods.slice(0, 4);
//
//     const fetchData = async (tab: string) => {
//         setLoading(true);
//
//         setTimeout(() => {
//             if (tab === "Đang đến") {
//                 setOrders(ordersMockData);
//             }
//             if (tab === "Deal đã mua") {
//                 setOrders([]); // ✅ API sau này: setOrders(data)
//             }
//             if (tab === "Lịch sử") {
//                 setOrders([]); // ✅ API sau này: setOrders(data)
//             }
//             if (tab === "Đánh giá") {
//                 setOrders([]); // ✅ API sau này: setOrders(data)
//             }
//             if (tab === "Đơn nháp") {
//                 setOrders([]); // ✅ API sau này: setOrders(data)
//             }
//             setLoading(false);
//         }, 350);
//
//         /* ✅ Khi có Supabase API thật:
//         const { data } = await supabase
//           .from("orders")
//           .select("*")
//           .eq("status", apiStatusMapping[tab])
//           .eq("user_id", session.user.id);
//
//         setOrders(data ?? []);
//         */
//     };
//
//     useEffect(() => {
//         fetchData(activeTab);
//     }, [activeTab]);
//
//     return (
//         <View className="flex-1 bg-white pt-10">
//
//             {/* ✅ Header */}
//             <View className="px-5 pb-3">
//                 <Text className="text-2xl font-bold text-gray-900">Đơn hàng</Text>
//             </View>
//
//             {/* ✅ Tabs UI */}
//             <View className="flex-row px-5 mt-3 border-b border-gray-200">
//                 {tabs.map((tab) => (
//                     <TouchableOpacity
//                         key={tab.key}
//                         className="mr-6 pb-3 items-center"
//                         onPress={() => setActiveTab(tab.key)}
//                     >
//                         <Ionicons
//                             name={tab.icon as any}
//                             size={22}
//                             color={activeTab === tab.key ? "#26C6DA" : "#7E7E7E"}
//                         />
//                         <Text
//                             className={`text-xs mt-1 ${
//                                 activeTab === tab.key ? "text-[#26C6DA] font-bold" : "text-gray-500"
//                             }`}
//                         >
//                             {tab.key}
//                         </Text>
//
//                         {activeTab === tab.key && (
//                             <View className="h-1 w-8 bg-[#26C6DA] mt-1 rounded-full" />
//                         )}
//                     </TouchableOpacity>
//                 ))}
//             </View>
//
//             <ScrollView className="flex-1 px-4 mt-6">
//                 {loading ? (
//                     <View className="items-center mt-10">
//                         <ActivityIndicator size="large" color="#26C6DA" />
//                     </View>
//                 ) : (
//                     <>
//                         {/* ✅ TAB 1: Đang đến */}
//                         {activeTab === "Đang đến" && (
//                             <>
//                                 {orders.length > 0 ? (
//                                     orders.map((item) => <OrderCard key={item.id} order={item} />)
//                                 ) : (
//                                     <EmptyTabView tab="Đang đến" />
//                                 )}
//
//                                 {/* ✅ Gợi ý món ăn */}
//                                 <SuggestionSection foods={suggestedFoods} />
//                             </>
//                         )}
//
//                         {/* ✅ TAB 2: Deal đã mua */}
//                         {activeTab === "Deal đã mua" && (
//                             <>
//                                 {/* ✅ Render danh sách deal đã mua */}
//                                 {orders.length > 0 ? (
//                                     orders.map((item) => <OrderCard key={item.id} order={item} />)
//                                 ) : (
//                                     <EmptyTabView tab="Deal đã mua" />
//                                 )}
//                             </>
//                         )}
//
//                         {/* ✅ TAB 3: Lịch sử */}
//                         {activeTab === "Lịch sử" && (
//                             <>
//                                 {orders.length > 0 ? (
//                                     orders.map((item) => <OrderCard key={item.id} order={item} />)
//                                 ) : (
//                                     <EmptyTabView tab="Lịch sử" />
//                                 )}
//                             </>
//                         )}
//
//                         {/* ✅ TAB 4: Đánh giá */}
//                         {activeTab === "Đánh giá" && (
//                             <>
//                                 {/* ✅ Sau này render danh sách cần đánh giá */}
//                                 <EmptyTabView tab="Đánh giá" />
//                             </>
//                         )}
//
//                         {/* ✅ TAB 5: Đơn nháp */}
//                         {activeTab === "Đơn nháp" && (
//                             <>
//                                 {/* ✅ Sau này render đơn nháp */}
//                                 <EmptyTabView tab="Đơn nháp" />
//                             </>
//                         )}
//                     </>
//                 )}
//             </ScrollView>
//         </View>
//     );
// }
//
// /* ✅ EMPTY View */
// function EmptyTabView({ tab }: { tab: string }) {
//     return (
//         <View className="items-center justify-center mt-20">
//             <Ionicons name="receipt-outline" size={70} color="#26C6DA" />
//             <Text className="text-lg font-bold text-gray-800 text-center mt-4">
//                 {tab} chưa có dữ liệu
//             </Text>
//         </View>
//     );
// }
//
// /* ✅ Card item - chỉ hỗ trợ 2 trạng thái: Đang giao / Đã giao */
// function OrderCard({ order }: any) {
//     const isDelivering = order.status === "Đang giao";
//     const isDelivered = order.status === "Đã giao";
//
//     return (
//         <View className="bg-white rounded-xl p-4 shadow-sm mb-4 border border-gray-100">
//
//             {/* ✅ Trạng thái */}
//             <Text className={`text-xs font-bold mb-2 ${
//                 isDelivering ? "text-[#26C6DA]" : "text-green-600"
//             }`}>
//                 {order.status}
//             </Text>
//
//             {/* ✅ Món & giá */}
//             <View className="flex-row items-center">
//                 <Image
//                     source={{ uri: order.thumbnail }}
//                     className="w-20 h-20 rounded-xl mr-3"
//                 />
//
//                 <View className="flex-1">
//                     <Text className="font-bold text-[15px]" numberOfLines={1}>
//                         {order.items[0].name}
//                     </Text>
//
//                     <Text className="text-gray-600 text-xs mt-1">
//                         {order.items[0].quantity} món • {order.total.toLocaleString()}đ
//                     </Text>
//
//                     {/* ✅ Chỉ hiển thị thời gian dự kiến nếu đang giao */}
//                     {isDelivering && (
//                         <Text className="text-[#26C6DA] text-xs mt-1">
//                             Giao dự kiến: {order.deliveryEstimate}
//                         </Text>
//                     )}
//
//                     {/* ✅ Hiển thị ngày giao khi đã giao thành công */}
//                     {isDelivered && (
//                         <Text className="text-green-600 text-xs mt-1">
//                             Đã giao: {order.date}
//                         </Text>
//                     )}
//                 </View>
//             </View>
//
//             {/* ✅ Thanh trạng thái chỉ khi đang giao */}
//             {isDelivering && (
//                 <View className="w-full bg-gray-200 h-2 rounded-full mt-3">
//                     <View className="bg-[#26C6DA] h-2 w-1/3 rounded-full" />
//                 </View>
//             )}
//
//             {/* ✅ Nút xem chi tiết */}
//             <TouchableOpacity
//                 className="mt-3 py-2 bg-gray-100 rounded-xl items-center"
//                 onPress={() => router.push(`/order/${order.id}`)}
//             >
//                 <Text className="text-[#26C6DA] font-medium text-sm">
//                     Xem chi tiết đơn hàng
//                 </Text>
//             </TouchableOpacity>
//         </View>
//     );
// }
//
//
//
// /* ✅ Gợi ý đồ ăn */
// function SuggestionSection({ foods }: { foods: any[] }) {
//     return (
//         <View className="mt-8">
//             <Text className="font-bold text-lg text-gray-900 mb-3">
//                 Có thể bạn cũng thích
//             </Text>
//
//             {foods.map((item) => (
//                 <View key={item.id} className="flex-row bg-white rounded-xl p-3 mb-3 border border-gray-100">
//                     <Image source={{ uri: item.image }} className="w-20 h-20 rounded-xl mr-3" />
//                     <View className="flex-1">
//                         <Text className="font-semibold text-[15px]">{item.name}</Text>
//                         <Text className="text-gray-500 text-xs mt-1">
//                             ⭐ {item.rating} • {item.distance}
//                         </Text>
//                     </View>
//                 </View>
//             ))}
//         </View>
//     );
// }
