import { supabase } from "@/src/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Platform } from "react-native";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

// Helper to extract URL parameters from hash or query string
const extractUrlParams = (): URLSearchParams => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    // On web, check both hash and query string
    const hash = window.location.hash.substring(1); // Remove #
    const search = window.location.search.substring(1); // Remove ?
    
    // Supabase PKCE flow typically uses hash fragments
    if (hash) {
      return new URLSearchParams(hash);
    }
    if (search) {
      return new URLSearchParams(search);
    }
  }
  return new URLSearchParams();
};

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;
    let timeoutId: NodeJS.Timeout | null = null;

    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback params:", params);

        // Extract parameters from URL (handles both hash and query params)
        const urlParams = extractUrlParams();
        
        // Also check params from expo-router
        const allParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (typeof value === "string") {
            allParams.set(key, value);
          }
        });
        
        // Merge URL params (priority) with router params
        urlParams.forEach((value, key) => {
          allParams.set(key, value);
        });

        const accessToken = allParams.get("access_token") || urlParams.get("access_token");
        const refreshToken = allParams.get("refresh_token") || urlParams.get("refresh_token");
        const code = allParams.get("code") || urlParams.get("code");
        const errorParam = allParams.get("error") || urlParams.get("error");
        const errorDescription = allParams.get("error_description") || urlParams.get("error_description");

        // Check for OAuth errors
        if (errorParam) {
          throw new Error(errorDescription || errorParam || "OAuth authentication failed");
        }

        // If we have access_token and refresh_token, set session directly
        if (accessToken && refreshToken) {
          console.log("Setting session from URL tokens");
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) {
            console.error("Error setting session:", setSessionError);
            throw setSessionError;
          }

          if (data.session && mounted) {
            console.log("Session set successfully, redirecting to home");
            router.replace("/(tabs)");
            return;
          }
        }

        // If we have a code, Supabase should handle it automatically with detectSessionInUrl
        // But we can also try to exchange it manually if needed
        if (code) {
          console.log("OAuth code received, waiting for Supabase to process...");
        }

        // Let Supabase handle the URL automatically (detectSessionInUrl is enabled)
        // This should work for PKCE flow
        await new Promise(resolve => setTimeout(resolve, 500));

        // Try to get existing session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
        }

        if (session && mounted) {
          console.log("Session found, redirecting to home");
          router.replace("/(tabs)");
          return;
        }

        // Listen for auth state changes as fallback
        const { data: { subscription: sub } } = supabase.auth.onAuthStateChange(
          async (event, session) => {
            console.log("Auth state changed:", event, session?.user?.id);
            
            if (event === "SIGNED_IN" && session && mounted) {
              console.log("Signed in event received, redirecting to home");
              router.replace("/(tabs)");
            }
          }
        );

        subscription = sub;

        // If no session after 5 seconds, redirect to login
        timeoutId = setTimeout(() => {
          if (mounted) {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (!session) {
                console.log("No session found after timeout, redirecting to login");
                setError("Không thể xác thực. Vui lòng thử lại.");
                setTimeout(() => {
                  router.replace("/login");
                }, 2000);
              }
            });
          }
        }, 5000);

      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (mounted) {
          setError(err.message || "Authentication failed");
          timeoutId = setTimeout(() => {
            router.replace("/login");
          }, 2000);
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
      if (subscription) {
        subscription.unsubscribe();
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [params, router]);

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 text-center px-4">{error}</Text>
        <Text className="text-gray-500 text-sm mt-2">Redirecting to login...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" color="#26C6DA" />
      <Text className="text-gray-600 mt-4">Đang xác thực...</Text>
    </View>
  );
}