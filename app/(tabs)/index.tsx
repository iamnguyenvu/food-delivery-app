import BannerCarousel from "@/components/index/BannerCarousel";
import CategoryList from "@/components/index/CategoryList";
import Header from "@/components/index/Header";
import LocationPermissionModal from "@/components/location/LocationPermissionModal";
import { trackBannerClick, useBanners } from "@/src/hooks";
import { useLocationStore } from "@/src/store/locationStore";
import { Banner } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { address, location, setAll } = useLocationStore();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const label = useMemo(
    () => address?.formatted || "Chọn vị trí giao hàng",
    [address]
  );

  const openPicker = () => router.push("/address-input" as any);
  const { banners, isLoading } = useBanners();
  const [selectedCategory, setSelectedCategory] = useState("1");

  // Show permission modal whenever location is not set
  useEffect(() => {
    if (!location || !address?.formatted) {
      setShowPermissionModal(true);
    }
  }, [location, address]);

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
    router.push("/address-input" as any);
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
          className="flex-1 bg-white"
          stickyHeaderIndices={[1]}
          keyboardShouldPersistTaps="handled"
        >
          <Header location={label} mode="full" onPressLocation={openPicker} />
          <Header
            location={label}
            mode="searchOnly"
            onPressLocation={openPicker}
          />

          <LinearGradient
            colors={["#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#FFFFFF"]}
            locations={[0, 0.15, 0.3, 0.5, 0.8]}
            className="flex-1"
          >
            <BannerCarousel
              banners={banners}
              isLoading={isLoading}
              onBannerPress={handleBannerPress}
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
