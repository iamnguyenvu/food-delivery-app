import LocationPickerScreen from '@/components/location/picker';
import { Stack } from 'expo-router';

export default function LocationPicker() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LocationPickerScreen />
    </>
  );
}
