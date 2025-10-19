import Header from '@/components/index/Header';
import { ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-slate-50">
      <Header />
    </ScrollView>
  );
}

