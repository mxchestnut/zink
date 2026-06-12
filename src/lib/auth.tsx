import { createContext, useContext, useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const parseHashParams = (value: string) => {
      const trimmed = value.replace(/^#/, "").replace(/^\?/, "");
      return Object.fromEntries(new URLSearchParams(trimmed));
    };

    const restoreSessionFromCallbackUrl = async () => {
      if (typeof window === "undefined") return null;

      const hashParams = parseHashParams(window.location.hash);
      const searchParams = parseHashParams(window.location.search);
      const params = { ...searchParams, ...hashParams };

      if (!params.access_token || !params.refresh_token) {
        return null;
      }

      const { data, error } = await supabase.auth.setSession({
        access_token: params.access_token,
        refresh_token: params.refresh_token,
      });

      if (error) {
        console.error("Failed to restore session from auth callback:", error.message);
        return null;
      }

      const url = new URL(window.location.href);
      url.hash = "";
      url.search = "";
      window.history.replaceState({}, document.title, url.toString());

      return data.session;
    };

    const restoreSession = async () => {
      if (typeof window === "undefined") return;

      const session = await restoreSessionFromCallbackUrl();
      if (session) {
        setUser(session.user ?? null);
        setLoading(false);
        return;
      }

      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setUser(currentSession?.user ?? null);
      setLoading(false);
    };

    restoreSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim();
      const { error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
        },
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const normalizedEmail = email.trim();
      const { error } = await supabase.auth.signInWithPassword({
        email: normalizedEmail,
        password,
      });
      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
