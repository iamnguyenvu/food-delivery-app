import { useAuth } from "@/src/contexts/AuthContext";
import { getAuthRedirectUrl } from "@/src/lib/authRedirect";
import { supabase } from "@/src/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Required for OAuth to work properly
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { signInWithGoogle, signInWithGithub, signUp, signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSignUpMode, setIsSignUpMode] = useState(false); // Toggle between login/signup
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  
  const isValidEmail = (e: string) => {
    // Basic email validation
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const isEmailValid = isValidEmail(email);
  const isPasswordValid = password.length >= 6;
  const canContinue = isSignUpMode
    ? isEmailValid && isPasswordValid && fullName.trim().length > 0
    : isEmailValid && isPasswordValid;

  const handleEmailAuth = async () => {
    if (!canContinue) return;

    try {
      setIsLoading(true);
      
      if (isSignUpMode) {
        // Sign up new user
        setLoadingMessage("Đang tạo tài khoản...");
        await signUp(email, password, fullName);
        // No alert - just redirect
        router.replace("/(tabs)");
      } else {
        // Sign in existing user
        setLoadingMessage("Đang đăng nhập...");
        await signIn(email, password);
        // No alert - just redirect
        router.replace("/(tabs)");
      }
    } catch (error: any) {
      console.error("Email auth error:", error);
      Alert.alert(
        isSignUpMode ? "Lỗi đăng ký" : "Lỗi đăng nhập",
        error.message || (isSignUpMode ? "Không thể tạo tài khoản" : "Sai email hoặc mật khẩu")
      );
    } finally {
      setIsLoading(false);
      setLoadingMessage("");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const { url } = await signInWithGoogle();
      if (!url) throw new Error("No OAuth URL returned");
      const redirectUrl = getAuthRedirectUrl();
      
      console.log("Opening OAuth URL:", url);
      console.log("Redirect URL:", redirectUrl);
      
      // Set up deep link listener before opening browser
      let deepLinkSubscription: any = null;
      let sessionFound = false;
      
      const handleDeepLink = async (event: { url: string }) => {
        console.log("Deep link received:", event.url);
        
        if (event.url.includes("auth/callback") && !sessionFound) {
          sessionFound = true;
          
          // Unsubscribe immediately to prevent multiple calls
          if (deepLinkSubscription) {
            deepLinkSubscription.remove();
            deepLinkSubscription = null;
          }
          
          try {
            await WebBrowser.dismissBrowser();
          } catch (e) {
            // Ignore if browser already closed
          }
          
          // Extract tokens from the deep link URL
          await handleOAuthCallback(event.url);
        }
      };
      
      // Listen for deep links
      deepLinkSubscription = Linking.addEventListener("url", handleDeepLink);
      
      // Use openAuthSessionAsync with Site URL (https://example.com)
      // Supabase will redirect there, and we can extract tokens from the result
      const supabaseRedirectUrl = "https://example.com";
      const result = await WebBrowser.openAuthSessionAsync(url, supabaseRedirectUrl);
      
      console.log("OAuth result:", result);
      
      // Check if we got a redirect with tokens
      if (result.type === "success" && result.url) {
        console.log("OAuth redirect successful, URL:", result.url);
        // Extract tokens from the redirect URL
        await handleOAuthCallback(result.url);
        if (deepLinkSubscription) {
          deepLinkSubscription.remove();
        }
        return;
      } else if (result.type === "cancel") {
        console.log("OAuth cancelled by user");
        if (deepLinkSubscription) {
          deepLinkSubscription.remove();
        }
        return;
      } else if (result.type === "dismiss") {
        console.log("Browser dismissed, polling for session...");
        // Browser was dismissed, poll for session as fallback
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout
        
        const pollSession = async () => {
          while (attempts < maxAttempts && !sessionFound) {
            attempts++;
            console.log(`Polling session attempt ${attempts}/${maxAttempts}`);
            
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error("Session error:", sessionError);
            }
            
            if (session) {
              console.log("Session found!", session.user.id);
              sessionFound = true;
              if (deepLinkSubscription) {
                deepLinkSubscription.remove();
              }
              router.replace("/(tabs)");
              return true;
            }
            
            // Wait 1 second before next attempt
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          // Clean up
          if (deepLinkSubscription) {
            deepLinkSubscription.remove();
          }
          
          return false;
        };
        
        const success = await pollSession();
        
        if (!success && !sessionFound) {
          Alert.alert(
            "Timeout",
            "Không thể xác thực sau khi đăng nhập. Vui lòng thử lại."
          );
        }
      }
    } catch (error: any) {
      console.error("Google login error:", error);
      Alert.alert(
        "Lỗi đăng nhập",
        error.message || "Không thể đăng nhập bằng Google"
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOAuthCallback = async (callbackUrl: string) => {
    try {
      console.log("Processing OAuth callback URL:", callbackUrl);
      
      // Extract tokens from the callback URL
      // Handle exp://, fooddelivery://, and https:// URLs
      let urlObj: URL;
      try {
        // Try parsing as standard URL first
        urlObj = new URL(callbackUrl);
      } catch {
        // If that fails, it might be a custom scheme, convert it
        const normalizedUrl = callbackUrl
          .replace(/^fooddelivery:\/\//, "https://")
          .replace(/^exp:\/\//, "https://");
        urlObj = new URL(normalizedUrl);
      }
      
      const hash = urlObj.hash.substring(1); // Remove #
      const search = urlObj.search.substring(1); // Remove ?
      
      // Also check if tokens are in the path for custom schemes
      const pathParts = urlObj.pathname.split("?");
      const pathQuery = pathParts.length > 1 ? pathParts[1] : "";
      
      const params = new URLSearchParams(hash || search || pathQuery);
      const accessToken = params.get("access_token");
      const refreshToken = params.get("refresh_token");
      const error = params.get("error");
      
      if (error) {
        const errorDescription = params.get("error_description");
        throw new Error(errorDescription || error);
      }
      
      // If we have tokens, set the session directly
      if (accessToken && refreshToken) {
        console.log("Setting session from callback URL");
        const { data, error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (setSessionError) throw setSessionError;
        
        if (data.session) {
          console.log("Session set successfully!");
          router.replace("/(tabs)");
          return;
        }
      } else {
        // If no tokens in URL, Supabase might have handled it via detectSessionInUrl
        // Wait a bit and check session
        await new Promise(resolve => setTimeout(resolve, 1000));
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log("Session found after callback!");
          router.replace("/(tabs)");
          return;
        }
      }
    } catch (error: any) {
      console.error("OAuth callback error:", error);
      Alert.alert(
        "Lỗi xác thực",
        error.message || "Không thể xác thực. Vui lòng thử lại."
      );
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      const { url } = await signInWithGithub();
      if (!url) throw new Error("No OAuth URL returned");
      const redirectUrl = getAuthRedirectUrl();
      
      console.log("Opening OAuth URL:", url);
      console.log("Redirect URL:", redirectUrl);
      
      // Set up deep link listener before opening browser
      let deepLinkSubscription: any = null;
      let sessionFound = false;
      
      const handleDeepLink = async (event: { url: string }) => {
        console.log("Deep link received:", event.url);
        
        if (event.url.includes("auth/callback") && !sessionFound) {
          sessionFound = true;
          
          // Unsubscribe immediately to prevent multiple calls
          if (deepLinkSubscription) {
            deepLinkSubscription.remove();
            deepLinkSubscription = null;
          }
          
          try {
            await WebBrowser.dismissBrowser();
          } catch (e) {
            // Ignore if browser already closed
          }
          
          // Extract tokens from the deep link URL
          await handleOAuthCallback(event.url);
        }
      };
      
      // Listen for deep links
      deepLinkSubscription = Linking.addEventListener("url", handleDeepLink);
      
      // Use openAuthSessionAsync with Site URL (https://example.com)
      const supabaseRedirectUrl = "https://example.com";
      const result = await WebBrowser.openAuthSessionAsync(url, supabaseRedirectUrl);
      
      console.log("OAuth result:", result);
      
      // Check if we got a redirect with tokens
      if (result.type === "success" && result.url) {
        console.log("OAuth redirect successful, URL:", result.url);
        // Extract tokens from the redirect URL
        await handleOAuthCallback(result.url);
        if (deepLinkSubscription) {
          deepLinkSubscription.remove();
        }
        return;
      } else if (result.type === "cancel") {
        console.log("OAuth cancelled by user");
        if (deepLinkSubscription) {
          deepLinkSubscription.remove();
        }
        return;
      } else if (result.type === "dismiss") {
        console.log("Browser dismissed, polling for session...");
        // Browser was dismissed, poll for session as fallback
        let attempts = 0;
        const maxAttempts = 30; // 30 seconds timeout
        
        const pollSession = async () => {
          while (attempts < maxAttempts && !sessionFound) {
            attempts++;
            console.log(`Polling session attempt ${attempts}/${maxAttempts}`);
            
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error("Session error:", sessionError);
            }
            
            if (session) {
              console.log("Session found!", session.user.id);
              sessionFound = true;
              if (deepLinkSubscription) {
                deepLinkSubscription.remove();
              }
              router.replace("/(tabs)");
              return true;
            }
            
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
          
          // Clean up
          if (deepLinkSubscription) {
            deepLinkSubscription.remove();
          }
          
          return false;
        };
        
        const success = await pollSession();
        
        if (!success && !sessionFound) {
          Alert.alert(
            "Timeout",
            "Không thể xác thực sau khi đăng nhập. Vui lòng thử lại."
          );
        }
      }
    } catch (error: any) {
      console.error("Github login error:", error);
      Alert.alert(
        "Lỗi đăng nhập",
        error.message || "Không thể đăng nhập bằng Github"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center justify-between px-2 pt-3 pb-2 border-b border-gray-200">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="p-2">
            <Ionicons name="arrow-back" size={24} color="#26C6DA" />
          </Pressable>

          <Text className="text-lg font-semibold">Đăng nhập / Đăng ký</Text>
        </View>

        <Pressable
          onPress={() => router.push("/(screens)/help-center" as any)}
          className="p-2"
        >
          <Ionicons name="help-circle-outline" size={24} color="#26C6DA" />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* App Icon */}
          <View className="items-center mt-12 mb-8">
            <Image
              source={require("@/assets/images/adaptive-icon.png")}
              className="w-24 h-24 rounded-3xl"
              style={{ width: 96, height: 96 }}
            />
          </View>

          {/* Form */}
          <View className="px-6">
            {/* Full Name Input (sign up only) */}
            {isSignUpMode && (
              <View className="mb-4">
                <Text className="text-gray-700 mb-2 font-medium">
                  Họ và tên
                </Text>
                <View className="flex-row items-center border border-gray-300 rounded-md px-4 py-1 bg-gray-50">
                  <Ionicons name="person-outline" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-3 text-sm"
                    placeholder="Nhập họ và tên"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>
              </View>
            )}
            
            {/* Email Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                Email
              </Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-4 py-1 bg-gray-50">
                <Ionicons name="mail-outline" size={20} color="#6B7280" />
                <TextInput
                  className="flex-1 ml-3 text-sm"
                  placeholder="Nhập địa chỉ email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
                {email.length > 0 && (
                  <Pressable onPress={() => setEmail("")}>
                    <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                  </Pressable>
                )}
              </View>
            </View>

            {/* Password Input */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Mật khẩu</Text>
              <View className="flex-row items-center border border-gray-300 rounded-md px-4 py-1 bg-gray-50">
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                />
                <TextInput
                  className="flex-1 ml-3 text-sm"
                  placeholder={isSignUpMode ? "Tạo mật khẩu (tối thiểu 6 ký tự)" : "Nhập mật khẩu"}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              {isSignUpMode && password.length > 0 && password.length < 6 && (
                <Text className="text-red-500 text-xs mt-1">
                  Mật khẩu phải có ít nhất 6 ký tự
                </Text>
              )}
            </View>

            {/* Continue Button */}
            <Pressable
              onPress={handleEmailAuth}
              disabled={!canContinue || isLoading}
              className={`py-4 rounded-md items-center mb-3 ${
                canContinue && !isLoading ? "bg-primary-400" : "bg-gray-300"
              }`}
            >
              <Text
                className={`font-semibold text-base ${
                  canContinue && !isLoading ? "text-white" : "text-gray-500"
                }`}
              >
                {isLoading
                  ? loadingMessage || "Đang xử lý..."
                  : isSignUpMode
                  ? "Đăng ký"
                  : "Đăng nhập"}
              </Text>
            </Pressable>

            {/* Toggle Sign Up/Login */}
            <Pressable
              onPress={() => {
                setIsSignUpMode(!isSignUpMode);
                setPassword("");
                setFullName("");
              }}
              className="items-center py-2"
            >
              <Text className="text-primary-400 font-medium">
                {isSignUpMode
                  ? "Đã có tài khoản? Đăng nhập"
                  : "Chưa có tài khoản? Đăng ký"}
              </Text>
            </Pressable>

            {/* Divider */}
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="mx-4 text-gray-500">hoặc</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>

            {/* Social Login Buttons */}
            <View className="gap-3">
              {/* Google */}
              <Pressable
                onPress={handleGoogleLogin}
                disabled={isLoading}
                className={`flex-row items-center justify-center border border-gray-300 rounded-md py-3 ${
                  isLoading ? "bg-gray-100" : "bg-white active:bg-gray-50"
                }`}
              >
                <Ionicons name="logo-google" size={20} color="#DB4437" />
                <Text className="ml-3 font-medium text-gray-700 text-base">
                  Đăng nhập bằng Google
                </Text>
              </Pressable>

              {/* Github */}
              <Pressable
                onPress={handleGithubLogin}
                disabled={isLoading}
                className={`flex-row items-center justify-center border border-gray-300 rounded-md py-3 ${
                  isLoading ? "bg-gray-100" : "bg-white active:bg-gray-50"
                }`}
              >
                <Ionicons name="logo-github" size={20} color="black" />
                <Text className="ml-3 font-medium text-gray-700 text-base">
                  Đăng nhập bằng Github
                </Text>
              </Pressable>
            </View>

            {/* Terms */}
            <Text className="text-xs text-gray-500 text-center mt-8 px-4">
              Bằng cách tiếp tục, bạn đồng ý với{" "}
              <Text className="text-primary-400">Điều khoản sử dụng</Text> và{" "}
              <Text className="text-primary-400">Chính sách bảo mật</Text> của
              chúng tôi
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
