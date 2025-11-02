import Card from "@/components/common/Card";
import { useFlashSales, type FlashSale } from "@/src/hooks";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

interface FlashSaleProps {
  onViewMore?: () => void;
  onSelectItem?: (id: string) => void;
}

// Countdown Timer Component
function CountdownTimer({ endTime }: { endTime: string }) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date(endTime).getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <View className="flex-row items-center gap-1">
      <View className="bg-red-500/20 px-2 py-1 rounded">
        <Text className="text-red-600 text-xs font-bold">
          {String(timeLeft.hours).padStart(2, "0")}
        </Text>
      </View>
      <Text className="text-red-600 text-xs font-bold">:</Text>
      <View className="bg-red-500/20 px-2 py-1 rounded">
        <Text className="text-red-600 text-xs font-bold">
          {String(timeLeft.minutes).padStart(2, "0")}
        </Text>
      </View>
      <Text className="text-red-600 text-xs font-bold">:</Text>
      <View className="bg-red-500/20 px-2 py-1 rounded">
        <Text className="text-red-600 text-xs font-bold">
          {String(timeLeft.seconds).padStart(2, "0")}
        </Text>
      </View>
    </View>
  );
}

// Flash Sale Item Card
function FlashSaleItem({
  item,
  onPress,
}: {
  item: FlashSale;
  onPress: () => void;
}) {
  const total = item.total_quantity || 0;
  const sold = item.sold_quantity || 0;
  const soldPercentage = total > 0 ? (sold / total) * 100 : 0;
  const isSoldOut = total > 0 ? sold >= total : false;

  return (
    <Pressable onPress={onPress} className="w-[130px] mr-3 active:opacity-80">
      <View className="items-center">
        {/* Image Container */}
        <View className="w-full aspect-square rounded-md mb-2 overflow-hidden">
          <Image
            source={{
              uri:
                item.dish?.image ||
                item.image ||
                "https://via.placeholder.com/200",
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
          {/* Discount Badge */}
          <View className="absolute top-1 right-1 bg-red-500 pl-1 pr-2 py-0.5 rounded flex-row">
            <Ionicons name="flash" size={16} color={"white"} />
            <Text className="text-white text-xs font-bold">
              -{item.discount_percent}%
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text
          className="text-sm font-semibold text-gray-800 leading-tight mb-1"
          numberOfLines={1}
        >
          {item.dish?.name || item.title}
        </Text>

        {/* Price */}
        <View className="flex-row items-center gap-1 mb-2">
          <Text className="text-sm font-bold text-primary-400">
            {item.flash_sale_price?.toLocaleString()}đ
          </Text>
          <Text className="text-xs text-gray-400 line-through">
            {item.original_price?.toLocaleString()}đ
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="w-full">
          <View className="h-6 bg-red-100 rounded-full overflow-hidden relative">
            {/* Animated progress fill */}
            <View
              className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-red-500 to-red-600 rounded-full"
              style={{ width: `${Math.min(soldPercentage, 100)}%` }}
            />
            {/* Overlay text */}
            <View className="absolute inset-0 items-center justify-center">
              <Text className="text-[11px] font-bold text-white drop-shadow">
                {isSoldOut ? "Đã bán hết" : "Đang bán chạy"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function FlashSale({
  onViewMore,
  onSelectItem,
}: FlashSaleProps) {
  const { flashSales, isLoading } = useFlashSales({ limit: 10 });

  const handleViewAll = () => {
    // Implement later: Navigate to flash sales list screen
    router.push("/(screens)/flashsales" as any);
    console.log("View all collections");
  };

  if (isLoading || !flashSales || flashSales.length === 0) {
    return null;
  }

  // Get earliest end time for countdown
  const endTime =
    flashSales[0]?.valid_until || new Date(Date.now() + 3600000).toISOString();

  return (
    <Card className="mx-2 mb-3">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-4 pb-3 border-b border-red-100">
        <View className="flex-row items-center gap-2">
          <View className="w-7 h-7 bg-red-500 rounded-full items-center justify-center">
            <Ionicons name="flash" size={16} color="white" />
          </View>
          <Text className="text-lg font-black text-red-600 tracking-wide">
            FLASH SALE
          </Text>
          <CountdownTimer endTime={endTime} />
        </View>

        <Pressable
          onPress={onViewMore}
          className="flex-row items-center gap-1 active:opacity-70"
        >
          <Text className="text-xs text-gray-500">Xem tất cả</Text>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
        </Pressable>
      </View>

      {/* Horizontal Scroll */}
      <View className="px-2 py-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 12 }}
        >
          {flashSales.map((item: FlashSale) => (
            <FlashSaleItem
              key={item.id}
              item={item}
              onPress={() => onSelectItem?.(item.id)}
            />
          ))}
          {/* View All card at the end */}
          <Pressable onPress={handleViewAll} className="w-[130px] mr-3 justify-center">
            <View className="items-center justify-center h-full">
              <Ionicons
                name="chevron-forward-circle-outline"
                size={40}
                color="#26C6DA"
              />
              <Text
                className="text-sm font-semibold text-gray-800 text-center mt-2"
                numberOfLines={2}
              >
                Xem tất cả
              </Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </Card>
  );
}
