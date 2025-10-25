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

type BannerCarouselProps = {
  banners?: Banner[];
  isLoading?: boolean;
  autoPlayInterval?: number;
  onBannerPress?: (banner: Banner) => void;
  aspectRatio?: number;
};

export default function BannerCarousel({
  banners = [],
  isLoading = false,
  autoPlayInterval = 5000,
  onBannerPress,
  aspectRatio = 10 / 3,
}: BannerCarouselProps) {
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
    <View className="my-1 mb-2">
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
            accessibilityRole="imagebutton"
            accessibilityLabel={banner.title || "Banner"}
            style={{ width: itemWidth, height: itemHeight }}
            className="px-2"
          >
            <View className="rounded-md overflow-hidden bg-gray-200 shadow-sm">
              <Image
                source={{ uri: banner.image }}
                style={{ width: "100%", height: "100%" }}
                contentFit="cover"
                transition={200}
                cachePolicy="memory-disk"
                placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
                recyclingKey={banner.id}
              />
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {banners.length > 1 && (
        <View className="absolute bottom-8 left-0 right-0 flex-row justify-center gap-2 z-10">
          {banners.map((_, i) => (
            <View
              key={i}
              className={
                i === activeIndex
                  ? "w-2 h-2 rounded-full bg-primary-400"
                  : "w-2 h-2 rounded-full bg-gray-800"
              }
            />
          ))}
        </View>
      )}
    </View>
  );
}
