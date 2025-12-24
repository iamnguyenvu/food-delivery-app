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
import {
    getDishToRestaurantMapping,
    getFlashSaleToDishMapping,
    trackBannerClick,
    useBanners
} from "@/src/hooks";
import { useCartStore } from "@/src/store/cartStore";
import { useLocationStore } from "@/src/store/locationStore";
import { Banner } from "@/src/types";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { Alert, Animated, Linking, ScrollView } from "react-native";

export default function HomeScreen() {
  const { address, location, setAll } = useLocationStore();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;

  const label = useMemo(
    () => address?.formatted || "Chọn vị trí giao hàng",
    [address]
  );

  const openPicker = () => router.push("/(screens)/address-input" as any);
  const { banners, isLoading } = useBanners();

  // Show permission modal whenever location is not set
  useEffect(() => {
    if (!location || !address?.formatted) {
      setShowPermissionModal(true);
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
  };

  const handleManualInput = () => {
    // Don't hide modal, keep it visible in background
    // User must complete address selection to proceed
    router.push("/(screens)/address-input" as any);
  };

  const handleBannerPress = (banner: Banner) => {
    trackBannerClick(banner.id);

    switch (banner.actionType) {
      case "restaurant":
        // Navigate to restaurant detail
        const restaurantId = banner.actionValue || banner.restaurantId;
        if (restaurantId) {
          router.push(`/(screens)/restaurant-detail/${restaurantId}` as any);
        } else {
          console.warn("Banner missing restaurant ID");
        }
        break;

      case "dish":
        // Navigate to dish detail
        if (banner.actionValue) {
          router.push(`/(screens)/dish-detail/${banner.actionValue}` as any);
        } else {
          console.warn("Banner missing dish ID");
        }
        break;

      case "coupon":
        // Apply coupon - navigate to checkout with coupon pre-filled
        if (banner.actionValue) {
          // If user has items in cart, go to checkout
          const cartStore = useCartStore.getState();
          if (cartStore.items.length > 0) {
            router.push({
              pathname: "/(screens)/checkout",
              params: { couponCode: banner.actionValue },
            } as any);
          } else {
            Alert.alert(
              "Mã giảm giá",
              `Mã: ${banner.actionValue}\n\nVui lòng thêm món vào giỏ hàng để sử dụng mã này.`,
              [
                { text: "OK" },
                {
                  text: "Xem vouchers",
                  onPress: () => router.push("/(screens)/voucher/vouchers" as any),
                },
              ]
            );
          }
        }
        break;

      case "url":
        // Open external URL
        if (banner.actionValue) {
          Linking.canOpenURL(banner.actionValue).then((supported) => {
            if (supported) {
              Linking.openURL(banner.actionValue!);
            } else {
              Alert.alert("Lỗi", "Không thể mở liên kết này");
            }
          });
        }
        break;

      default:
        // Default: just show banner info
        console.log("Banner clicked:", banner.title);
        Alert.alert(banner.title, banner.subtitle || "");
    }
  };

  const handleSearchPress = () => {
    router.push("/(screens)/search" as any);
  };

  const handleFlashSaleSelect = (id: string) => {
    // Flash sale items navigate to dish detail
    const flashSaleMapping = getFlashSaleToDishMapping();
    const dishId = flashSaleMapping[id] || 'dish-1';
    router.push(`/(screens)/dish-detail/${dishId}` as any);
  };

  const handleRecentlyViewedSelect = (id: string) => {
    // Recently viewed items navigate to restaurant (not dish detail)
    const dishToRestaurantMapping = getDishToRestaurantMapping();
    const restaurantId = dishToRestaurantMapping[id] || 'sample-restaurant-1';
    router.push(`/(screens)/restaurant-detail/${restaurantId}` as any);
  };

  const handleRestaurantSelect = (id: string) => {
    // Navigate to restaurant detail
    router.push(`/(screens)/restaurant-detail/${id}` as any);
  };

  const handleDealSelect = (id: string) => {
    // Navigate to deals list page instead of dish detail
    router.push("/(screens)/deals" as any);
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
          onSearchPress={handleSearchPress}
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

          <CategoryGrid />

          <TrumDealNgon
            onViewMore={() => console.log("View more deals")}
            onSelectDeal={handleDealSelect}
          />

          <CollectionsSection maxItems={6} />

          <FlashSale 
            onViewMore={() => console.log("View more flash sales")}
            onSelectItem={handleFlashSaleSelect}
          />

          <RecentlyViewed 
            onSelectItem={handleRecentlyViewedSelect}
          />

          <SecondaryBannerCarousel
            onBannerPress={handleBannerPress}
          />

          <TopRatedRestaurants
            onViewMore={() => console.log("View more top rated restaurants")}
            onSelectRestaurant={handleRestaurantSelect}
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
