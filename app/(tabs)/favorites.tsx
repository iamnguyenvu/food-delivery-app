import FavoriteDetail from "@/components/favorites/FavoriteDetail";
import {
    FavoriteItem,
    favoritesMockData,
} from "@/components/favorites/favoritesMockData";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
    Image,
    LayoutAnimation,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    UIManager,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// animation
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function FavoritesScreen() {
    const insets = useSafeAreaInsets();
    const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [sortBy, setSortBy] = useState<"recent" | "rating" | "distance">("recent");
    const [activeFilter, setActiveFilter] = useState<"all" | "near" | "top">("all");
    const [selectedFavorite, setSelectedFavorite] = useState<FavoriteItem | null>(null);
    const [showFavoriteDetail, setShowFavoriteDetail] = useState(false);

    const fetchData = async () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFavorites(favoritesMockData);
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Reset StatusBar when screen loses focus (navigating away)
    useFocusEffect(
        useCallback(() => {
            // Set StatusBar for this screen when focused
            StatusBar.setBarStyle("dark-content");
            if (Platform.OS === "android") {
                StatusBar.setBackgroundColor("#FFFFFF");
                StatusBar.setTranslucent(false);
            }

            // Reset StatusBar when screen loses focus
            return () => {
                StatusBar.setBarStyle("light-content");
                if (Platform.OS === "android") {
                    StatusBar.setBackgroundColor("#26C6DA");
                    StatusBar.setTranslucent(false);
                }
            };
        }, [])
    );

    // sort + search
    const filteredAndSorted = useMemo(() => {
        let list = favorites;

        // search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter(
                (f) =>
                    f.dish_name.toLowerCase().includes(q) ||
                    f.restaurant_name.toLowerCase().includes(q)
            );
        }

        // filter
        if (activeFilter === "near") {
            list = list.filter((f) => {
                const km = parseFloat((f.distance || "").replace(" km", ""));
                return !Number.isNaN(km) && km <= 1.0;
            });
        } else if (activeFilter === "top") {
            list = list.filter((f) => f.rating >= 4.6);
        }

        // sort
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
                return akm - bkm;
            });
        }

        return sorted;
    }, [favorites, searchQuery, activeFilter, sortBy]);

    // remove favorite
    const removeFavorite = (id: string) => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFavorites((prev) => prev.filter((f) => f.id !== id));
    };

    return (
        <SafeAreaView className="flex-1 bg-[#F8FDFE]" edges={["top", "left", "right"]}>

            <ScrollView
                className="flex-1 px-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 24 + insets.bottom + 60 }}
            >
                {/* -------------------- HEADER -------------------- */}
                <View className="bg-white -mx-4 px-5 pt-4 pb-4 border-b border-[#E0F7FA] mb-4">
                    <Text className="text-2xl font-bold text-[#0F172A]">
                        Món bạn yêu thích
                    </Text>
                    <Text className="text-xs text-gray-500 mt-1">
                        {filteredAndSorted.length} mục • cập nhật gần đây
                    </Text>
                </View>

                {/* -------------------- search bar-------------------- */}
                <View className="flex-row items-center mb-4">
                    {/* Search box */}
                    <View className="flex-1 flex-row items-center bg-white border border-[#D3F3F7] rounded-md px-4 py-3 mr-2 shadow-sm">
                        <Ionicons name="search" size={18} color="#26C6DA" />
                        <TextInput
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Tìm món hoặc quán..."
                            placeholderTextColor="#7AA6AD"
                            className="ml-3 text-[14px] text-[#0F1C1F] flex-1"
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery("")}>
                                <Ionicons name="close-circle" size={18} color="#26C6DA" />
                            </Pressable>
                        )}
                    </View>

                    {/* Grid/List toggle */}
                    <Pressable
                        onPress={() => setViewMode((m) => (m === "grid" ? "list" : "grid"))}
                        className="bg-white border border-[#D3F3F7] rounded-md px-3 py-3 shadow-sm"
                    >
                        <Ionicons
                            name={viewMode === "grid" ? "list" : "grid"}
                            size={18}
                            color="#26C6DA"
                        />
                    </Pressable>
                </View>

                {/* --------------------sort-------------------- */}
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
                                className={`mr-2 px-2.5 py-1.5 rounded-md border flex-row items-center ${
                                    activeFilter === f.key
                                        ? "bg-[#26C6DA] border-[#26C6DA]"
                                        : "bg-white border-[#D3F3F7]"
                                }`}
                            >
                                <Ionicons
                                    name={f.icon as any}
                                    size={12}
                                    color={activeFilter === f.key ? "#FFFFFF" : "#26C6DA"}
                                />
                                <Text
                                    className={`text-[10px] ml-1 font-semibold ${
                                        activeFilter === f.key ? "text-white" : "text-[#177C8A]"
                                    }`}
                                >
                                    {f.label}
                                </Text>
                            </Pressable>
                        ))}

                        {/* Sort */}
                        <Pressable
                            onPress={() =>
                                setSortBy((s) =>
                                    s === "recent" ? "rating" : s === "rating" ? "distance" : "recent"
                                )
                            }
                            className="flex-row items-center px-2.5 py-1.5 rounded-md bg-white border border-[#D3F3F7]"
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

                {/* -------------------- List Favorites-------------------- */}
                {filteredAndSorted.length === 0 ? (
                    <View className="flex-1 h-[500px] justify-center items-center">
                        <View className="w-24 h-24 rounded-md bg-[#E0F7FA] items-center justify-center mb-4">
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
                                    className="bg-white border border-[#E6F6F9] rounded-md overflow-hidden"
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
                                            className="absolute right-2 top-2 w-9 h-9 rounded-md bg-white/95 items-center justify-center"
                                        >
                                            <Ionicons name="heart" size={18} color="#EF4444" />
                                        </Pressable>
                                        {/* Rating */}
                                        <View className="absolute bottom-2 left-2 px-2 py-1 rounded-md flex-row items-center bg-[#26C6DA]/90">
                                            <Ionicons name="star" size={12} color="#FFFFFF" />
                                            <Text className="text-[10px] text-white font-semibold ml-1">
                                                {item.rating.toFixed(1)}
                                            </Text>
                                        </View>
                                    </View>

                                    <View className="px-3 py-3">
                                        <Text
                                            className="text-[14px] font-bold text-[#0F172A] mb-1"
                                            numberOfLines={1}
                                        >
                                            {item.dish_name}
                                        </Text>
                                        <Text
                                            className="text-[12px] text-gray-600 mb-2"
                                            numberOfLines={1}
                                        >
                                            {item.restaurant_name}
                                        </Text>
                                        <View className="flex-row items-center justify-between">
                                            <View className="flex-row items-center">
                                                <Ionicons name="location" size={12} color="#26C6DA" />
                                                <Text className="text-[11px] text-gray-600 ml-1">
                                                    {item.distance}
                                                </Text>
                                            </View>
                                            <Pressable
                                                className="px-3 py-1.5 rounded-md bg-[#E0F7FA]"
                                            >
                                                <Text className="text-[11px] font-semibold text-[#26C6DA]">
                                                    Đặt lại
                                                </Text>
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
                            className="flex-row bg-white rounded-md px-4 py-3 mb-3 border border-[#E6F6F9]"
                            android_ripple={{ color: "#B2EBF2" }}
                        >
                            <Image
                                source={{ uri: item.dish_image }}
                                className="w-20 h-20 rounded-md mr-3"
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
                                    <Ionicons name="star" size={14} color="#FBBF24" />
                                    <Text className="text-[12px] text-gray-700 ml-1 font-semibold">
                                        {item.rating.toFixed(1)}
                                    </Text>
                                    <Ionicons name="location" size={14} color="#26C6DA" className="ml-3" />
                                    <Text className="text-[12px] text-gray-600 ml-1">{item.distance}</Text>
                                </View>
                                <Pressable className="self-start px-4 py-1.5 rounded-md bg-[#E0F7FA]">
                                    <Text className="text-[12px] font-semibold text-[#26C6DA]">Đặt lại</Text>
                                </Pressable>
                            </View>
                            <Pressable
                                onPress={() => removeFavorite(item.id)}
                                className="w-10 h-10 rounded-md items-center justify-center ml-2 bg-[#FFF5F5]"
                            >
                                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                            </Pressable>
                        </Pressable>
                    ))
                )}

                <Modal
                    visible={showFavoriteDetail}
                    animationType="slide"
                    presentationStyle="fullScreen"
                    statusBarTranslucent={true}
                    onRequestClose={() => setShowFavoriteDetail(false)}
                >
                     <SafeAreaView className="flex-1 bg-[#F8FDFE]" edges={["top"]}>
                        {/* Header */}
                         <View className="bg-white px-4 pt-3 pb-3 border-b border-[#E0F7FA]">
                             <View className="flex-row items-center">
                                 <Pressable onPress={() => setShowFavoriteDetail(false)} className="w-10 h-10 items-center justify-center -ml-1">
                                     <Ionicons name="arrow-back" size={22} color="#0F172A" />
                                 </Pressable>
                                 <View className="flex-1 items-center">
                                     <Text className="text-lg font-bold text-[#0F172A]">
                                         Chi tiết món yêu thích
                                     </Text>
                                     <Text className="text-[10px] text-gray-500 mt-0.5">
                                         Món bạn đã lưu
                                     </Text>
                                 </View>
                                 <View className="w-10" />
                             </View>
                         </View>

                        {selectedFavorite && (
                            <FavoriteDetail
                                favorite={selectedFavorite}
                                onOrderPress={() => setShowFavoriteDetail(false)}
                                onViewRestaurantPress={() => setShowFavoriteDetail(false)}
                            />
                        )}
                    </SafeAreaView>
                </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}
