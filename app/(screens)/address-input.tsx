import AddressInputScreen from '@/components/location/AddressInputScreen';
import { Stack } from 'expo-router';

export default function AddressInput() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <AddressInputScreen />
    </>
  );
}
