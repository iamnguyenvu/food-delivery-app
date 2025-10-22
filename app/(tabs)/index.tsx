import BannerCarousel from '@/components/index/BannerCarousel';
import Header from '@/components/index/Header';
import { trackBannerClick, useBanners } from '@/src/hooks';
import { Banner } from '@/src/types';
import { ScrollView, View } from 'react-native';

export default function HomeScreen() {
  const { banners, isLoading } = useBanners();

  const handleBannerPress = (banner: Banner) => {
    trackBannerClick(banner.id);

    switch (banner.actionType) {
      case 'restaurant':
        console.log('Navigate to restaurant:', banner.actionValue || banner.restaurantId);
        break;
      case 'dish':
        console.log('Navigate to dish:', banner.actionValue);
        break;
      case 'coupon':
        console.log('Apply coupon:', banner.actionValue);
        break;
      case 'url':
        console.log('Open URL:', banner.actionValue);
        break;
      default:
        console.log('Banner clicked:', banner.title);
    }
  };

  return (
    <ScrollView 
      className="flex-1 bg-slate-50"
      stickyHeaderIndices={[1]}
      keyboardShouldPersistTaps="handled"
    >
      <Header location="1 Quang Trung" mode="full" />
      <Header location="1 Quang Trung" mode="searchOnly" />

      <View className="flex-1 py-2">
        <BannerCarousel 
          banners={banners}
          isLoading={isLoading}
          onBannerPress={handleBannerPress}
        />
      </View>
    </ScrollView>
  );
}

