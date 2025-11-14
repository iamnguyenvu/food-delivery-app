import { supabase } from "@/src/lib/supabase";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";

export default function AuthCallback() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback params:", params);

        // If we have access_token or code in URL, let Supabase handle it
        const urlParams = new URLSearchParams(params as any);
        const accessToken = urlParams.get("access_token");
        const refreshToken = urlParams.get("refresh_token");
        const code = urlParams.get("code");

        if (accessToken && refreshToken) {
          // Set session from URL tokens
          const { data, error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (setSessionError) throw setSessionError;

          if (data.session && mounted) {
            console.log("Session set from tokens, redirecting to home");
            router.replace("/(tabs)");
            return;
          }
        }

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
              router.replace("/(tabs)");
            }
          }
        );

        subscription = sub;

        // If no session after 3 seconds, redirect to login
        setTimeout(() => {
          if (mounted) {
            supabase.auth.getSession().then(({ data: { session } }) => {
              if (!session) {
                console.log("No session found after timeout, redirecting to login");
                router.replace("/login");
              }
            });
          }
        }, 3000);

      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (mounted) {
          setError(err.message || "Authentication failed");
          setTimeout(() => {
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
    };
  }, [params]);

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