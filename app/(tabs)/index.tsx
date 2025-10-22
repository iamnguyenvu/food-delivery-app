import BannerCarousel from '@/components/index/BannerCarousel';
import Header from '@/components/index/Header';
import { useBanners, trackBannerClick } from '@/src/hooks';
import { Banner } from '@/src/types';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  const { banners, isLoading } = useBanners();

  const handleBannerPress = (banner: Banner) => {
    // Track click for analytics
    trackBannerClick(banner.id);

    // Handle navigation based on action type
    switch (banner.actionType) {
      case 'restaurant':
        console.log('Navigate to restaurant:', banner.actionValue || banner.restaurantId);
        // TODO: Navigate to restaurant detail screen
        break;
      case 'dish':
        console.log('Navigate to dish:', banner.actionValue);
        // TODO: Navigate to dish detail screen
        break;
      case 'coupon':
        console.log('Apply coupon:', banner.actionValue);
        // TODO: Apply coupon code
        break;
      case 'url':
        console.log('Open URL:', banner.actionValue);
        // TODO: Open external URL
        break;
      default:
        console.log('Banner clicked:', banner.title);
    }
  };

  return (
    <ScrollView className="flex-1 bg-slate-50"
    stickyHeaderIndices={[1]}
    keyboardShouldPersistTaps="handled">
      <Header location="1 Quang Trung" mode="full" />
      <Header location="1 Quang Trung" mode="searchOnly" />

      <BannerCarousel 
        banners={banners}
        isLoading={isLoading}
        onBannerPress={handleBannerPress}
      />
    </ScrollView>
  );
}

