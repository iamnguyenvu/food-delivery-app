import { supabase } from "@/src/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function AuthCallback() {
    const router = useRouter();

    useEffect(() => {
        supabase.auth.onAuthStateChange((event, session) => {
            if(event === "SIGNED_IN" && session) {
                router.replace("/(tabs)")
            }
        })
    }, [])

    return null;
}