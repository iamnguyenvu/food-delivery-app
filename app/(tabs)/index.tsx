import Header from '@/components/index/Header';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50"
    stickyHeaderIndices={[1]}
    keyboardShouldPersistTaps="handled">
      <Header location="1 Quang Trung" mode="full" />
      <Header location="1 Quang Trung" mode="searchOnly" />
    </ScrollView>
  );
}

