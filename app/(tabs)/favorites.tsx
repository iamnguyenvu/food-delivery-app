import FavoriteDetail from "@/components/favorites/FavoriteDetail";
import {
    FavoriteItem,
    favoritesMockData,
} from "@/components/favorites/favoritesMockData";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Enable animation on Android
if (
    Platform.OS === "android" &&
    UIManager.setLayoutAnimationEnabledExperimental
) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FavoritesScreen() {
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"recent" | "rating" | "distance">(
        "recent"
    );
    const [activeFilter, setActiveFilter] = useState<"all" | "near" | "top">(
        "all"
    );
    const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
    const [showFavoriteDetail, setShowFavoriteDetail] = useState(false);

    const fetchData = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        // Mock Data
        setFavorites(favoritesMockData);

        /*

        const { data, error } = await supabase
          .from("favorites")
          .select(`
            *,
            restaurants(name),
            dishes(name, image, rating, distance)
          `)
          .order("created_at", { ascending: false });

        if (!error && data) {
          setFavorites(data.map(f => ({
            ...f,
            created_at: new Date(f.created_at)
          })));
        }
        */
    };

    const removeFavorite = async (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFavorites((prev) => prev.filter((f) => f.id !== id));

        /*
        await supabase.from("favorites").delete().eq("id", id);
        */
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredAndSorted = useMemo(() => {
        let list = favorites;
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (f) =>
                    f.dish_name.toLowerCase().includes(q) ||
                    f.restaurant_name.toLowerCase().includes(q)
            );
        }

        if (activeFilter === "near") {
            // keep items with distance <= 1.0 km when possible
            list = list.filter((f) => {
                const km = parseFloat((f.distance || "").replace(" km", ""));
                return !Number.isNaN(km) ? km <= 1.0 : true;
            });
        } else if (activeFilter === "top") {
            list = list.filter((f) => f.rating >= 4.6);
        }

        const sorted = [...list];
        if (sortBy === "recent") {
            sorted.sort(
                (a, b) => (b.created_at?.getTime?.() || 0) - (a.created_at?.getTime?.() || 0)
            );
        } else if (sortBy === "rating") {
            sorted.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === "distance") {
            sorted.sort((a, b) => {
                const akm = parseFloat((a.distance || "").replace(" km", ""));
                const bkm = parseFloat((b.distance || "").replace(" km", ""));
                if (Number.isNaN(akm) || Number.isNaN(bkm)) return 0;
                return akm - bkm;
            });
        }
        return sorted;
    }, [favorites, searchQuery, sortBy, activeFilter]);

    return (
        <SafeAreaView className="flex-1 bg-[#F8FDFE]">
            <ScrollView className="flex-1 px-4 pt-4 pb-6" showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View className="bg-white -mx-4 px-5 pt-4 pb-4 border-b border-[#E0F7FA] mb-4">
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <View className="bg-[#E0F7FA] w-11 h-11 rounded-full items-center justify-center mr-3">
                            <Ionicons name="heart" size={22} color="#26C6DA" />
                        </View>
                        <View>
                            <Text className="text-2xl font-bold text-[#0F172A]">Món bạn yêu thích</Text>
                            <Text className="text-xs text-gray-500 mt-0.5">
                                {filteredAndSorted.length} mục • cập nhật gần đây
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Search + Controls */}
            <View className="flex-row items-center mb-4">
                <View className="flex-1 flex-row items-center bg-white border border-[#D3F3F7] rounded-xl px-4 py-3 mr-2 shadow-sm">
                    <Ionicons name="search" size={18} color="#26C6DA" />
                    <TextInput
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholder="Tìm món hoặc quán..."
                        placeholderTextColor="#7AA6AD"
                        className="ml-3 text-[14px] text-[#0F1C1F] flex-1"
                    />
                    {searchQuery.length > 0 && (
                        <Pressable onPress={() => setSearchQuery("")} className="ml-2">
                            <Ionicons name="close-circle" size={18} color="#26C6DA" />
                        </Pressable>
                    )}
                </View>

                <Pressable
                    onPress={() =>
                        setViewMode((m) => (m === "grid" ? "list" : "grid"))
                    }
                    className="bg-white border border-[#D3F3F7] rounded-xl px-3 py-3 shadow-sm"
                    style={{
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.05,
                        shadowRadius: 3,
                        elevation: 2,
                    }}
                >
                    <Ionicons
                        name={viewMode === "grid" ? "list" : "grid"}
                        size={18}
                        color="#26C6DA"
                    />
                </Pressable>
            </View>

            {/* Filters */}
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                className="mb-4"
                contentContainerStyle={{ paddingRight: 16 }}
            >
                <View className="flex-row items-center">
                    {[
                        { key: "all", label: "Tất cả", icon: "apps" },
                        { key: "near", label: "Gần bạn", icon: "location" },
                        { key: "top", label: "Đánh giá cao", icon: "star" },
                    ].map((f) => (
                        <Pressable
                            key={f.key}
                            onPress={() => setActiveFilter(f.key as any)}
                            className={`mr-2 px-2.5 py-1.5 rounded-full border flex-row items-center ${
                                activeFilter === f.key
                                    ? "bg-[#26C6DA] border-[#26C6DA]"
                                    : "bg-white border-[#D3F3F7]"
                            }`}
                            style={
                                activeFilter === f.key
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
                            <Ionicons
                                name={f.icon as any}
                                size={12}
                                color={activeFilter === f.key ? "#FFFFFF" : "#26C6DA"}
                            />
                            <Text
                                className={`text-[10px] ml-1 font-semibold ${
                                    activeFilter === f.key
                                        ? "text-white"
                                        : "text-[#177C8A]"
                                }`}
                            >
                                {f.label}
                            </Text>
                        </Pressable>
                    ))}

                    <Pressable
                        onPress={() =>
                            setSortBy((s) =>
                                s === "recent" ? "rating" : s === "rating" ? "distance" : "recent"
                            )
                        }
                        className="flex-row items-center px-2.5 py-1.5 rounded-full bg-white border border-[#D3F3F7]"
                    >
                        <Ionicons name="swap-vertical" size={14} color="#26C6DA" />
                        <Text className="ml-1 text-[10px] font-semibold text-[#177C8A]">
                            {sortBy === "recent"
                                ? "Mới nhất"
                                : sortBy === "rating"
                                ? "Xếp theo ⭐"
                                : "Gần nhất"}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>

            {/* Content */}
            {filteredAndSorted.length === 0 ? (
                <View className="flex-1 h-[500px] justify-center items-center">
                    <View className="w-24 h-24 rounded-3xl bg-[#E0F7FA] items-center justify-center mb-4">
                        <Ionicons name="heart-dislike" size={40} color="#26C6DA" />
                    </View>
                    <Text className="text-lg font-bold text-[#0F172A] mb-1">
                        Chưa có món yêu thích
                    </Text>
                    <Text className="text-sm text-gray-500 text-center px-8">
                        Thêm món để đặt lại nhanh hơn lần sau
                    </Text>
                </View>
            ) : viewMode === "grid" ? (
                <View className="flex-row flex-wrap -mx-1.5">
                    {filteredAndSorted.map((item) => (
                        <View key={item.id} className="w-1/2 px-1.5 mb-3">
                            <Pressable
                                onPress={() => {
                                    setSelectedFavorite(item);
                                    setShowFavoriteDetail(true);
                                }}
                                className="bg-white border border-[#E6F6F9] rounded-2xl overflow-hidden"
                                style={{
                                    shadowColor: "#000",
                                    shadowOffset: { width: 0, height: 2 },
                                    shadowOpacity: 0.08,
                                    shadowRadius: 6,
                                    elevation: 3,
                                }}
                            >
                                <View className="relative">
                                    <Image
                                        source={{ uri: item.dish_image }}
                                        className="w-full h-32"
                                        resizeMode="cover"
                                    />
                                    <Pressable
                                        onPress={() => removeFavorite(item.id)}
                                        className="absolute right-2 top-2 w-9 h-9 rounded-full bg-white/95 items-center justify-center"
                                        style={{
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 1 },
                                            shadowOpacity: 0.2,
                                            shadowRadius: 2,
                                            elevation: 2,
                                        }}
                                    >
                                        <Ionicons name="heart" size={18} color="#EF4444" />
                                    </Pressable>
                                    <View className="absolute bottom-2 left-2 px-2 py-1 rounded-lg flex-row items-center" style={{ backgroundColor: "rgba(38, 198, 218, 0.9)" }}>
                                        <Ionicons name="star" size={12} color="#FFFFFF" />
                                        <Text className="text-[10px] text-white font-semibold ml-1">
                                            {item.rating.toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                                <View className="px-3 py-3">
                                    <Text className="text-[14px] font-bold text-[#0F172A] mb-1" numberOfLines={1}>
                                        {item.dish_name}
                                    </Text>
                                    <Text className="text-[12px] text-gray-600 mb-2" numberOfLines={1}>
                                        {item.restaurant_name}
                                    </Text>
                                    <View className="flex-row items-center justify-between">
                                        <View className="flex-row items-center">
                                            <Ionicons name="location" size={12} color="#26C6DA" />
                                            <Text className="text-[11px] text-gray-600 ml-1">
                                                {item.distance}
                                            </Text>
                                        </View>
                                        <Pressable className="px-3 py-1.5 rounded-full" style={{ backgroundColor: "#E0F7FA" }}>
                                            <Text className="text-[11px] font-semibold text-[#26C6DA]">Đặt lại</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    ))}
                </View>
            ) : (
                filteredAndSorted.map((item) => (
                    <Pressable
                        key={item.id}
                        onPress={() => {
                            setSelectedFavorite(item);
                            setShowFavoriteDetail(true);
                        }}
                        className="flex-row bg-white rounded-2xl px-4 py-3 mb-3 border border-[#E6F6F9]"
                        android_ripple={{ color: "#B2EBF2" }}
                        style={{
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.08,
                            shadowRadius: 6,
                            elevation: 3,
                        }}
                    >
                        <Image
                            source={{ uri: item.dish_image }}
                            className="w-20 h-20 rounded-xl mr-3"
                            resizeMode="cover"
                        />
                        <View className="flex-1">
                            <Text className="font-bold text-[15px] text-[#0F172A] mb-1" numberOfLines={1}>
                                {item.dish_name}
                            </Text>
                            <Text className="text-[13px] text-gray-600 mb-2" numberOfLines={1}>
                                {item.restaurant_name}
                            </Text>
                            <View className="flex-row items-center mb-2">
                                <View className="flex-row items-center mr-3">
                                    <Ionicons name="star" size={14} color="#FBBF24" />
                                    <Text className="text-[12px] text-gray-700 ml-1 font-semibold">
                                        {item.rating.toFixed(1)}
                                    </Text>
                                </View>
                                <View className="flex-row items-center">
                                    <Ionicons name="location" size={14} color="#26C6DA" />
                                    <Text className="text-[12px] text-gray-600 ml-1">
                                        {item.distance}
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                className="self-start px-4 py-1.5 rounded-full"
                                style={{ backgroundColor: "#E0F7FA" }}
                            >
                                <Text className="text-[12px] font-semibold text-[#26C6DA]">Đặt lại</Text>
                            </Pressable>
                        </View>
                        <Pressable
                            onPress={() => removeFavorite(item.id)}
                            className="w-10 h-10 rounded-full items-center justify-center ml-2"
                            style={{ backgroundColor: "#FFF5F5" }}
                        >
                            <Ionicons name="trash-outline" size={18} color="#EF4444" />
                        </Pressable>
                    </Pressable>
                ))
            )}

            {/* Favorite Detail Modal */}
            <Modal
                visible={showFavoriteDetail}
                animationType="slide"
                presentationStyle="fullScreen"
                statusBarTranslucent={true}
                onRequestClose={() => setShowFavoriteDetail(false)}
            >
                <View className="flex-1 bg-[#F8FDFE]">
                    <SafeAreaView className="flex-1" edges={['top']}>
                        {/* Header */}
                        <View className="bg-white px-4 pt-2 pb-3 border-b border-[#E0F7FA]">
                            <View className="flex-row items-center">
                                <Pressable
                                    onPress={() => setShowFavoriteDetail(false)}
                                    className="w-10 h-10 rounded-full items-center justify-center mr-3"
                                    style={{ backgroundColor: "#E0F7FA" }}
                                >
                                    <Ionicons name="close" size={22} color="#26C6DA" />
                                </Pressable>
                                <View className="flex-1">
                                    <Text className="text-lg font-bold text-[#0F172A]">Chi tiết món yêu thích</Text>
                                    <Text className="text-[10px] text-gray-500 mt-0.5">Món bạn đã lưu</Text>
                                </View>
                            </View>
                        </View>

                        {selectedFavorite && (
                            <FavoriteDetail
                                favorite={selectedFavorite}
                                onOrderPress={() => {
                                    setShowFavoriteDetail(false);
                                    // Handle order press - navigate to restaurant or add to cart
                                }}
                                onViewRestaurantPress={() => {
                                    setShowFavoriteDetail(false);
                                    // Handle view restaurant press - navigate to restaurant detail
                                }}
                            />
                        )}
                    </SafeAreaView>
                </View>
            </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
