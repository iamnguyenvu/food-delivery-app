import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getAuthRedirectUrl, getSupabaseRedirectUrl } from "../lib/authRedirect";
import { supabase } from "../lib/supabase";

type OAuthResponse = Awaited<ReturnType<typeof supabase.auth.signInWithOAuth>>;
type OAuthData = OAuthResponse["data"];

type AuthContextType = {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<OAuthData>;
  signInWithGithub: () => Promise<OAuthData>;
  // Phone + Password authentication (recommended)
  signUpWithPhone: (phone: string, password: string, fullName?: string) => Promise<void>;
  signInWithPhone: (phone: string, password: string) => Promise<void>;
  // Deprecated: Phone OTP removed (Twilio blocked VN numbers)
  // sendOtpToPhone: (phone: string) => Promise<{ user: null; session: null; messageId?: string | null; }>;
  // verifyOtp: (phone: string, token: string) => Promise<void>;
  updatePassword: (newPassword: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      // Ensure profile exists when user signs in
      if (event === "SIGNED_IN" && session?.user) {
        await ensureProfile(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const validatePhone = (phone: string): boolean => {
    // Validate Vietnam phone format: 0[35789]XXXXXXXX (10 digits)
    const phoneRegex = /^0[35789]\d{8}$/;
    return phoneRegex.test(phone);
  };

  const ensureProfile = async (u: User | null) => {
    if (!u) return;
    try {
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", u.id)
        .single();

      if (!data) {
        await supabase.from("profiles").insert({
          id: u.id,
          email: u.email ?? null,
          phone: (u as any).phone ?? null,
        });
      }
    } catch (_e) {}
  };

  const signInWithGoogle = async () => {
    try {
      // Use Site URL for redirect - Supabase will accept this
      // Then we'll extract tokens from the redirect result
      const redirectUrl = getSupabaseRedirectUrl();
      console.log("Google OAuth redirect URL (for Supabase):", redirectUrl);
      console.log("App deep link URL:", getAuthRedirectUrl());

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: false,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("OAuth error:", error);
        throw error;
      }
      
      console.log("OAuth data:", data);
      return data;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      // Use Site URL for redirect - Supabase will accept this
      const redirectUrl = getSupabaseRedirectUrl();
      console.log("Github OAuth redirect URL (for Supabase):", redirectUrl);
      console.log("App deep link URL:", getAuthRedirectUrl());

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Github sign in error:", error);
      throw error;
    }
  };

  // ============================================
  // PHONE + PASSWORD AUTHENTICATION
  // ============================================
  
  const signUpWithPhone = async (
    phone: string,
    password: string,
    fullName?: string
  ) => {
    // Validate phone number (VN format)
    if (!validatePhone(phone)) {
      throw new Error(
        "Số điện thoại không hợp lệ. Vui lòng nhập số VN (10 số, bắt đầu 0)"
      );
    }

    // Check if phone already exists
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("phone")
      .eq("phone", phone)
      .single();

    if (existingProfile) {
      throw new Error("Số điện thoại đã được đăng ký");
    }

    // Create valid dummy email from phone
    // Use phone.app.fooddelivery.vn format (Supabase requires valid email format)
    const email = `phone.${phone}@gmail.com`;

    // Sign up with Supabase
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          phone,
          full_name: fullName,
        },
      },
    });

    if (signUpError) throw signUpError;

    // Update profile with actual phone
    if (authData.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone,
          name: fullName || "User",
          email, // Keep dummy email for auth
        })
        .eq("id", authData.user.id);

      if (profileError) {
        console.error("Failed to update profile:", profileError);
      }
    }
  };

  const signInWithPhone = async (phone: string, password: string) => {
    // Validate phone number
    if (!validatePhone(phone)) {
      throw new Error("Số điện thoại không hợp lệ");
    }

    // Find user by phone
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("phone", phone)
      .single();

    if (profileError || !profile) {
      throw new Error("Số điện thoại chưa được đăng ký");
    }

    // Sign in with stored email (or construct from phone)
    const email = profile.email || `phone.${phone}@app.fooddelivery.vn`;
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes("invalid login credentials")) {
        throw new Error("Số điện thoại hoặc mật khẩu không đúng");
      }
      throw error;
    }
  };

  const updatePassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signIn,
        signUp,
        signOut,
        signInWithGoogle,
        signInWithGithub,
        signUpWithPhone,
        signInWithPhone,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth muse be used within AuthProvider");
  return context;
}
