import * as Linking from "expo-linking";
import { Platform } from "react-native";

const CALLBACK_PATH = "auth/callback";

export const getAuthRedirectUrl = () => {
  // For web, use the current origin
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/${CALLBACK_PATH}`;
  }

  // For mobile, use Linking.createURL() which handles Expo Go URLs automatically
  // This will create exp:// URLs for Expo Go and custom scheme for production
  return Linking.createURL(CALLBACK_PATH);
};

// Get the redirect URL that Supabase will accept (must be in whitelist)
// For Expo Go, we need to use a web URL that Supabase accepts, then extract tokens
export const getSupabaseRedirectUrl = () => {
  // For Expo Go, Supabase doesn't accept exp:// URLs in whitelist
  // So we use the Site URL (https://example.com) which is always in whitelist
  // Then we extract tokens from the redirect result
  if (Platform.OS === "web" && typeof window !== "undefined") {
    return `${window.location.origin}/${CALLBACK_PATH}`;
  }
  
  // Use Site URL for mobile - Supabase will redirect here, then we extract tokens
  return "https://example.com";
};
