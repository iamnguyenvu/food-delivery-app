import type { Session, User } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "../lib/supabase";
import { getAuthRedirectUrl } from "../lib/authRedirect";

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
  sendOtpToPhone: (phone: string) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  signInWithPhonePassword: (phone: string, password: string) => Promise<void>;
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
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
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

  const formatPhoneE164 = (raw: string) => {
    let digits = (raw || "").replace(/\D/g, "");
    if (!digits) return "";
    if (digits.startsWith("0")) return "+84" + digits.slice(1);
    if (digits.startsWith("+")) return digits;
    return "+84" + digits;
  };

  const mapPhoneAuthError = (error: unknown) => {
    const message =
      typeof error === "object" && error && "message" in error
        ? String((error as any).message ?? "")
        : "";

    if (message.toLowerCase().includes("unsupported phone provider")) {
      return new Error(
        [
          "Supabase project chưa cấu hình SMS provider nên không thể gửi OTP.",
          "Mở Supabase Dashboard → Authentication → Phone và làm theo docs/PHONE_AUTH_SETUP.md.",
        ].join(" ")
      );
    }

    if (error instanceof Error) return error;
    return new Error("Không thể thực hiện xác thực bằng số điện thoại");
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
      const redirectUrl = getAuthRedirectUrl();
      console.log("Google OAuth redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // We handle browser manually
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) throw error;
      // Profile will be ensured on auth state change
      return data;
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const redirectUrl = getAuthRedirectUrl();
      console.log("Github OAuth redirect URL:", redirectUrl);

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true, // We handle browser manually
        },
      });

      if (error) throw error;
      // Profile will be ensured on auth state change
      return data;
    } catch (error) {
      console.error("Github sign in error:", error);
      throw error;
    }
  };

  const sendOtpToPhone = async (phone: string) => {
    const normalized = formatPhoneE164(phone);
    if (!normalized) throw new Error("Invalid phone number");
    const { error } = await supabase.auth.signInWithOtp({
      phone: normalized,
      options: { channel: "sms" },
    });
    if (error) throw mapPhoneAuthError(error);
  };

  const verifyOtp = async (phone: string, token: string) => {
    const normalized = formatPhoneE164(phone);
    const { data, error } = await supabase.auth.verifyOtp({
      phone: normalized,
      token,
      type: "sms",
    });
    if (error) throw mapPhoneAuthError(error);
    await ensureProfile(data.session?.user ?? null);
  };

  const signInWithPhonePassword = async (phone: string, password: string) => {
    const normalized = formatPhoneE164(phone);
    const { data, error } = await supabase.auth.signInWithPassword({
      phone: normalized,
      password,
    });
    if (error) throw error;
    await ensureProfile(data.user ?? null);
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
        sendOtpToPhone,
        verifyOtp,
        signInWithPhonePassword,
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
