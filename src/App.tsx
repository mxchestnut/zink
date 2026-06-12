import { useState } from "react";
import { useAuth } from "./lib/auth";
import { supabase } from "./lib/supabase";
import { CharacterView } from "./components/CharacterView";
import { Login } from "./components/Login";
import { Signup } from "./components/Signup";
import { CharacterDashboard } from "./components/CharacterDashboard";
import { LuLoader } from "react-icons/lu";

type AuthPage = "login" | "signup";

export default function App() {
  const { user, loading: authLoading, signOut } = useAuth();
  const [authPage, setAuthPage] = useState<AuthPage>("login");
  const [selectedCharacter, setSelectedCharacter] = useState<{
    key: string;
    alias?: string;
  } | null>(null);

  const handleMigrateLocalStorage = async (key: string, alias?: string) => {
    if (!user) return;

    try {
      await supabase.from("characters").insert([
        {
          character_key: key,
          alias: alias || null,
        },
      ]);
    } catch (err) {
      console.error("Failed to migrate character:", err);
    }
  };

  const handleCharacterSelect = (key: string, alias?: string) => {
    setSelectedCharacter({ key, alias });
  };

  const handleLogout = async () => {
    await signOut();
    setSelectedCharacter(null);
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <LuLoader className="animate-spin size-8 text-amber-300" />
          <p className="text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Not logged in - show auth pages
  if (!user) {
    return (
      <div className="relative min-h-screen overflow-clip">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(251,191,36,0.06),transparent)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-16">
          {authPage === "login" ? (
            <Login onSwitchToSignup={() => setAuthPage("signup")} />
          ) : (
            <Signup onSwitchToLogin={() => setAuthPage("login")} />
          )}
        </div>
      </div>
    );
  }

  // Logged in but viewing a character
  if (selectedCharacter) {
    return (
      <CharacterView
        characterKey={selectedCharacter.key}
        onCharacterChange={(key, alias) => {
          if (key) {
            handleMigrateLocalStorage(key, alias);
            setSelectedCharacter({ key, alias });
          } else {
            setSelectedCharacter(null);
          }
        }}
      />
    );
  }

  // Logged in and on dashboard
  return (
    <div className="relative min-h-screen overflow-clip">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(251,191,36,0.06),transparent)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-16">
        <CharacterDashboard
          onCharacterSelect={handleCharacterSelect}
          onLogout={handleLogout}
        />
      </div>
    </div>
  );
}

