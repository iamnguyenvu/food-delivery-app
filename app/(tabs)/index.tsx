import BannerCarousel from "@/components/index/BannerCarousel";
import CategoryGrid from "@/components/index/CategoryGrid";
import CategoryList from "@/components/index/CategoryList";
import Header from "@/components/index/Header";
import TrumDealNgon from "@/components/index/TrumDealNgon";
import LocationPermissionModal from "@/components/location/LocationPermissionModal";
import { trackBannerClick, useBanners } from "@/src/hooks";
import { useLocationStore } from "@/src/store/locationStore";
import { Banner } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { address, location, setAll } = useLocationStore();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [headerMode, setHeaderMode] = useState<"full" | "searchOnly">("full");

  const label = useMemo(
    () => address?.formatted || "Chọn vị trí giao hàng",
    [address]
  );

  const openPicker = () => router.push("/(screens)/address-input" as any);
  const { banners, isLoading } = useBanners();
  const [selectedCategory, setSelectedCategory] = useState("1");

  // Show permission modal whenever location is not set
  useEffect(() => {
    if (!location || !address?.formatted) {
      setShowPermissionModal(true);
    }
  }, [location, address]);

  // Handle scroll for header mode change
  useEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      // Switch to searchOnly when scrolled down more than 50px
      // Switch back to full when scrolled to top (< 20px)
      if (value > 50 && headerMode === "full") {
        setHeaderMode("searchOnly");
      } else if (value < 20 && headerMode === "searchOnly") {
        setHeaderMode("full");
      }
    });

    return () => {
      scrollY.removeListener(listenerId);
    };
  }, [scrollY, headerMode]);

  const handleLocationGranted = (
    loc: { latitude: number; longitude: number },
    addressText: string
  ) => {
    setAll({
      location: loc,
      address: {
        formatted: addressText,
      },
    });
    setShowPermissionModal(false);
  };

  const handleManualInput = () => {
    setShowPermissionModal(false);
    router.push("/(screens)/address-input" as any);
  };

  const handleBannerPress = (banner: Banner) => {
    trackBannerClick(banner.id);

    switch (banner.actionType) {
      case "restaurant":
        console.log(
          "Navigate to restaurant:",
          banner.actionValue || banner.restaurantId
        );
        break;
      case "dish":
        console.log("Navigate to dish:", banner.actionValue);
        break;
      case "coupon":
        console.log("Apply coupon:", banner.actionValue);
        break;
      case "url":
        console.log("Open URL:", banner.actionValue);
        break;
      default:
        console.log("Banner clicked:", banner.title);
    }
  };

  const handleCategorySelect = (id: string) => {
    setSelectedCategory(id);
    console.log("Category selected:", id);
  };

  return (
    <>
      <LocationPermissionModal
        visible={showPermissionModal}
        onLocationGranted={handleLocationGranted}
        onManualInput={handleManualInput}
      />
      <SafeAreaProvider>
        <ScrollView
          className="flex-1 bg-gray-100"
          stickyHeaderIndices={[1]}
          keyboardShouldPersistTaps="handled"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          <Header location={label} mode={headerMode} onPressLocation={openPicker} />
          <Header
            location={label}
            mode="searchOnly"
            onPressLocation={openPicker}
          />

          <LinearGradient
            colors={["#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#F3F4F6"]}
            locations={[0, 0.15, 0.3, 0.5, 0.8]}
            className="flex-1"
          >
            <BannerCarousel
              banners={banners}
              isLoading={isLoading}
              onBannerPress={handleBannerPress}
            />

            <CategoryGrid onSelectCategory={handleCategorySelect} />

            <TrumDealNgon
              onViewMore={() => console.log("View more deals")}
              onSelectDeal={(id) => console.log("Selected deal:", id)}
            />

            <CategoryList
              selectedId={selectedCategory}
              onSelectCategory={handleCategorySelect}
            />
          </LinearGradient>
        </ScrollView>
      </SafeAreaProvider>
    </>
  );
}
