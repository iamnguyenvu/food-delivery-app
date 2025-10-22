import type { Banner } from "@/src/types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  Text,
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

  containerClassName?: string;
  slidePaddingXClassName?: string;
  imageWrapperClassName?: string;
  overlayClassName?: string;
  dotActiveClassName?: string;
  dotInactiveClassName?: string;

  aspectRatio?: number;
};

export default function BannerCarousel({
  banners = [],
  isLoading = false,
  autoPlayInterval = 3000,
  onBannerPress,
  aspectRatio = 20 / 9,

  containerClassName = "mb-4",
  slidePaddingXClassName = "px-gutter",
  imageWrapperClassName = "rounded-card overflow-hidden bg-gray-200",
  overlayClassName = "bg-banner-overlay rounded-xl px-2 py-1",
  dotActiveClassName = "w-6 h-2 rounded-full bg-banner-dot-active",
  dotInactiveClassName = "w-2 h-2 rounded-full bg-banner-dot-inactive",
}: BannerCarouselProps) {
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const isDraggindRef = useRef(false);
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

  useEffect(() => {
    if (!hasData || !banners || banners.length <= 1 || autoPlayInterval <= 0) return;
    const id = setInterval(() => {
      if (isDraggindRef.current) return;
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
      isDraggindRef.current = false;
    },
    [itemWidth]
  );

  const onScrollBegin = useCallback(() => {
    isDraggindRef.current = true;
  }, []);

  if (isLoading) {
    return (
      <View className={containerClassName} style={{ height: itemHeight }}>
        <View className={`${imageWrapperClassName} ${slidePaddingXClassName} items-center justify-center`}>
          <ActivityIndicator size="large" color="#EF4444" />
        </View>
      </View>
    );
  }

  if (!hasData) return null;

  return (
    <View className={containerClassName} style={{ height: itemHeight }}>
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
            accessibilityLabel={banner.title}
            style={{width: itemWidth, height: itemHeight}}
            className={slidePaddingXClassName}
          >
            <View className={imageWrapperClassName}>
              <Image
                source={{uri: banner.image}}
                style={{width: "100%", height: "100%"}}
                resizeMode="cover"
              />

              {(banner.title || banner.subtitle) && (
                <View className={`absolute left-3 right-3 bottom-3 ${overlayClassName}`}>
                  {!!banner.title && (
                    <Text className="text-white font-semibold text-base" numberOfLines={1}>
                      {banner.title
                      }
                    </Text>
                  )}

                  {!!banner.subtitle && (
                    <Text className="text-white text-xs mt-0.5" numberOfLines={1}>
                      {banner.subtitle}
                    </Text>
                  )}
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {banners.length > 1 && (
        <View className="absolute bottom-2 left-0 right-0 flex-row justify-center gap-2">
          {banners.map((_, i) => (
            <View key={i} className={i === activeIndex ? dotActiveClassName : dotInactiveClassName} />
          ))}
        </View>
      )}
    </View>
  );
}
