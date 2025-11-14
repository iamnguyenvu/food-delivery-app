import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const handleAuthCallback = async () => {
      try {
        // Get the current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        if (session && mounted) {
          console.log("Session found, redirecting to home");
          router.replace("/(tabs)");
        } else {
          // Listen for auth state changes
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
              console.log("Auth state changed:", event, session?.user?.id);
              
              if (event === "SIGNED_IN" && session && mounted) {
                router.replace("/(tabs)");
              } else if (event === "SIGNED_OUT" && mounted) {
                router.replace("/login");
              }
            }
          );

          return () => {
            subscription.unsubscribe();
          };
        }
      } catch (err: any) {
        console.error("Auth callback error:", err);
        if (mounted) {
          setError(err.message || "Authentication failed");
          // Redirect back to login after error
          setTimeout(() => {
            router.replace("/login");
          }, 2000);
        }
      }
    };

    handleAuthCallback();

    return () => {
      mounted = false;
    };
  }, []);

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