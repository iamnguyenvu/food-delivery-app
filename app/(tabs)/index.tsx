import BannerCarousel from "@/components/index/BannerCarousel";
import CategoryGrid from "@/components/index/CategoryGrid";
import CollectionsSection from "@/components/index/CollectionsSection";
import FlashSale from "@/components/index/FlashSale";
import Header from "@/components/index/Header";
import RecentlyViewed from "@/components/index/RecentlyViewed";
import SecondaryBannerCarousel from "@/components/index/SecondaryBannerCarousel";
import TopRatedRestaurants from "@/components/index/TopRatedRestaurants";
import TrumDealNgon from "@/components/index/TrumDealNgon";
import LocationPermissionModal from "@/components/location/LocationPermissionModal";
import { trackBannerClick, useBanners } from "@/src/hooks";
import { useLocationStore } from "@/src/store/locationStore";
import { Banner } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, ScrollView } from "react-native";

export default function HomeScreen() {
  const { address, location, setAll } = useLocationStore();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [userDismissedModal, setUserDismissedModal] = useState(false);

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
      setUserDismissedModal(false);
    } else {
      setShowPermissionModal(false);
    }
  }, [location, address]);

  const handleLocationGranted = (grantedLocation: { latitude: number; longitude: number }, addr: string) => {
    setAll({ 
      location: grantedLocation, 
      address: { formatted: addr, street: addr } 
    });
    setShowPermissionModal(false);
    setUserDismissedModal(false);
  };

  const handleManualInput = () => {
    // Don't hide modal, keep it visible in background
    // User must complete address selection to proceed
    router.push("/(screens)/address-input" as any);
  };

  const handleModalDismiss = () => {
    // Don't allow dismissing - location is required
    // Modal will stay visible
    return;
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
      <ScrollView
        className="flex-1 bg-gray-100"
        stickyHeaderIndices={[0]}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <Header 
          location={label} 
          onPressLocation={openPicker}
          scrollY={scrollY}
        />

        <LinearGradient
          colors={["#26C6DA", "#4DD0E1", "#80DEEA", "#B2EBF2", "#F3F4F6"]}
          locations={[0, 0.02, 0.04, 0.06, 0.08]}
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

          <CollectionsSection maxItems={6} />

          <FlashSale 
            onViewMore={() => console.log("View more flash sales")}
            onSelectItem={(id) => console.log("Selected flash sale:", id)}
          />

          <RecentlyViewed 
            onSelectItem={(id) => console.log("Selected recently viewed:", id)}
          />

          <SecondaryBannerCarousel
            onBannerPress={handleBannerPress}
          />

          <TopRatedRestaurants
            onViewMore={() => console.log("View more top rated restaurants")}
            // onSelectRestaurant={(id) => console.log("Selected restaurant:", id)}
          />

          {/* <CategoryList
            selectedId={selectedCategory}
            onSelectCategory={handleCategorySelect}
          /> */}
        </LinearGradient>
      </ScrollView>
    </>
  );
}
