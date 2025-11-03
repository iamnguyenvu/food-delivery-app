import type { Banner } from "@/src/types";
import { Image } from "expo-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";

type SecondaryBannerCarouselProps = {
  banners?: Banner[];
  isLoading?: boolean;
  autoPlayInterval?: number;
  onBannerPress?: (banner: Banner) => void;
  aspectRatio?: number;
};

// Sample secondary banners (different from main banners) - fixed dates
const SAMPLE_SECONDARY_BANNERS: Banner[] = [
  {
    id: "sec-1",
    title: "Ưu đãi cuối tuần",
    subtitle: "Giảm đến 50%",
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    actionType: "none",
    backgroundColor: "#F59E0B",
    textColor: "#ffffff",
    displayOrder: 1,
    isActive: true,
    clickCount: 0,
    impressionCount: 0,
    createdAt: "2025-11-01T00:00:00.000Z",
    updatedAt: "2025-11-03T00:00:00.000Z",
  },
  {
    id: "sec-2",
    title: "Món mới đặc biệt",
    subtitle: "Khám phá ngay",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800",
    actionType: "none",
    backgroundColor: "#8B5CF6",
    textColor: "#ffffff",
    displayOrder: 2,
    isActive: true,
    clickCount: 0,
    impressionCount: 0,
    createdAt: "2025-11-01T00:00:00.000Z",
    updatedAt: "2025-11-03T00:00:00.000Z",
  },
  {
    id: "sec-3",
    title: "Combo tiết kiệm",
    subtitle: "Chỉ từ 99K",
    image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800",
    actionType: "none",
    backgroundColor: "#EF4444",
    textColor: "#ffffff",
    displayOrder: 3,
    isActive: true,
    clickCount: 0,
    impressionCount: 0,
    createdAt: "2025-11-01T00:00:00.000Z",
    updatedAt: "2025-11-03T00:00:00.000Z",
  },
];

export default function SecondaryBannerCarousel({
  banners = SAMPLE_SECONDARY_BANNERS,
  isLoading = false,
  autoPlayInterval = 5000,
  onBannerPress,
  aspectRatio = 10 / 3,
}: SecondaryBannerCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isDraggingRef = useRef(false);
  const indexRef = useRef(0);

  const hasData = banners && banners.length > 0;
  const itemWidth = width;
  const itemHeight = useMemo(
    () => Math.round(itemWidth / aspectRatio),
    [itemWidth, aspectRatio]
  );

  useEffect(() => {
    indexRef.current = activeIndex;
  }, [activeIndex]);

  // auto-play stable, pause while user dragging
  useEffect(() => {
    if (!hasData || !banners || banners.length <= 1 || autoPlayInterval <= 0)
      return;
    const id = setInterval(() => {
      if (isDraggingRef.current) return;
      const next = (indexRef.current + 1) % banners.length;
      scrollRef.current?.scrollTo({ x: next * itemWidth, animated: true });
      setActiveIndex(next);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [hasData, banners, autoPlayInterval, itemWidth]);

  const onScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / itemWidth);
      setActiveIndex(i);
      isDraggingRef.current = false;
    },
    [itemWidth]
  );

  const onScrollBegin = useCallback(() => {
    isDraggingRef.current = true;
  }, []);

  if (isLoading) {
    return (
      <View className="px-2" style={{ height: itemHeight }}>
        <View
          className="rounded-md overflow-hidden bg-gray-200 items-center justify-center"
          style={{ height: itemHeight }}
        >
          <ActivityIndicator size="large" color="#26C6DA" />
        </View>
      </View>
    );
  }

  if (!hasData) return null;

  return (
    <View className="mb-3">
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScrollEnd}
        onScrollBeginDrag={onScrollBegin}
        bounces={false}
        scrollEventThrottle={16}
      >
        {banners.map((banner) => (
          <Pressable
            key={banner.id}
            onPress={() => onBannerPress?.(banner)}
            style={{ width: itemWidth }}
            className="px-2"
          >
            <View className="rounded-md overflow-hidden" style={{ height: itemHeight }}>
              <Image
                source={banner.image}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={300}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Dots Indicator */}
      {banners.length > 1 && (
        <View
          className="absolute bottom-2 left-0 right-0 flex-row justify-center gap-1.5"
          style={{ zIndex: 10 }}
        >
          {banners.map((_, i) => (
            <View
              key={i}
              className={`h-1.5 rounded-full ${
                i === activeIndex ? "bg-white w-6" : "bg-white/50 w-1.5"
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
}
