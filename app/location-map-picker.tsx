import LocationPickerScreen from '@/components/location/picker';
import { Stack } from 'expo-router';

export default function LocationMapPicker() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <LocationPickerScreen />
    </>
  );
}
