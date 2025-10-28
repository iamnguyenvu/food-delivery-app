import Card from "@/components/common/Card";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

interface FlashSaleProps {
  endTime: Date;
  onViewMore?: () => void;
  onSelectItem?: (id: string) => void;
}

// Countdown Timer Component
function CountdownTimer({ endTime }: { endTime: Date }) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

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

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <View className="flex-row items-center gap-1">
      <View className="bg-white/20 px-2 py-1 rounded">
        <Text className="text-white text-xs font-bold">
          {String(timeLeft.hours).padStart(2, "0")}
        </Text>
      </View>
      <Text className="text-white text-xs">:</Text>
      <View className="bg-white/20 px-2 py-1 rounded">
        <Text className="text-white text-xs font-bold">
          {String(timeLeft.minutes).padStart(2, "0")}
        </Text>
      </View>
      <Text className="text-white text-xs">:</Text>
      <View className="bg-white/20 px-2 py-1 rounded">
        <Text className="text-white text-xs font-bold">
          {String(timeLeft.seconds).padStart(2, "0")}
        </Text>
      </View>
    </View>
  );
}

export default function FlashSale({
  endTime,
  onViewMore,
  onSelectItem,
}: FlashSaleProps) {
  // Sample data
  const items = [
    { id: "1", name: "Bún Bò Huế", price: 25000, originalPrice: 50000, image: "https://via.placeholder.com/200" },
    { id: "2", name: "Phở Bò", price: 27000, originalPrice: 45000, image: "https://via.placeholder.com/200" },
  ];

  return (
    <Card
      className="mx-2 my-3"
      customHeader={
        <LinearGradient
          colors={["#EF4444", "#F87171", "#FCA5A5"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="rounded-t-xl"
        >
          <View className="flex-row items-center justify-between px-4 py-3">
            {/* Left side: Icon + FLASH SALE + Timer */}
            <View className="flex-row items-center gap-2">
              <View className="w-6 h-6 bg-white rounded-full items-center justify-center">
                <Ionicons name="flash" size={16} color="#EF4444" />
              </View>
              <Text className="text-white text-lg font-black tracking-wide">
                FLASH SALE
              </Text>
              <CountdownTimer endTime={endTime} />
            </View>

            {/* Right side: Xem thêm */}
            <Pressable
              onPress={onViewMore}
              className="flex-row items-center gap-1 active:opacity-70"
            >
              <Text className="text-white text-sm font-medium">Xem thêm</Text>
              <Ionicons name="chevron-forward" size={16} color="white" />
            </Pressable>
          </View>
        </LinearGradient>
      }
    >
      {/* Content */}
      <View className="p-4">
        <View className="flex-row gap-3">
          {items.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onSelectItem?.(item.id)}
              className="flex-1 active:opacity-80"
            >
              <View className="bg-gray-50 rounded-lg overflow-hidden">
                <Image
                  source={{ uri: item.image }}
                  className="w-full h-32"
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text className="font-semibold text-gray-900" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View className="flex-row items-center gap-2 mt-1">
                    <Text className="text-primary-400 font-bold">
                      {item.price.toLocaleString()}đ
                    </Text>
                    <Text className="text-gray-400 text-xs line-through">
                      {item.originalPrice.toLocaleString()}đ
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </Card>
  );
}
