import { useEffect, useState } from "react";
import { useAuth } from "../lib/auth";
import { supabase } from "../lib/supabase";
import { CHARACTER_KEY } from "../lib/pathcompanion";
import { LuPlus, LuTrash2, LuLoader } from "react-icons/lu";

interface SavedCharacter {
  id: string;
  character_key: string;
  alias: string | null;
  created_at: string;
  user_id?: string | null;
}

export function CharacterDashboard({
  onCharacterSelect,
  onLogout,
}: {
  onCharacterSelect: (key: string, alias?: string) => void;
  onLogout: () => void;
}) {
  const { user } = useAuth();
  const [characters, setCharacters] = useState<SavedCharacter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [characterKey, setCharacterKey] = useState("");
  const [alias, setAlias] = useState("");
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      let query = supabase.from("characters").select("*").order("created_at", { ascending: false });
      if (user?.id) {
        query = query.eq("user_id", user.id);
      }

      const { data, error } = await query;
      if (error) {
        if (error.message?.includes("user_id")) {
          const fallback = await supabase.from("characters").select("*").order("created_at", { ascending: false });
          if (fallback.error) throw fallback.error;
          setCharacters(fallback.data || []);
        } else {
          throw error;
        }
      } else {
        setCharacters(data || []);
      }
    } catch (err) {
      console.error("Failed to load characters:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaimZink = async () => {
    if (!user) return;
    if (characters.some((char) => char.alias?.toLowerCase() === "zink")) return;

    setFormLoading(true);
    try {
      const payload: Record<string, unknown> = {
        character_key: CHARACTER_KEY,
        alias: "zink",
      };
      if (user?.id) {
        payload.user_id = user.id;
      }

      const { error } = await supabase.from("characters").insert([payload]);
      if (error) {
        if (error.message?.includes("user_id")) {
          const fallback = await supabase.from("characters").insert([
            {
              character_key: CHARACTER_KEY,
              alias: "zink",
            },
          ]);
          if (fallback.error) throw fallback.error;
        } else {
          throw error;
        }
      }

      await loadCharacters();
    } catch (err: any) {
      console.error("Failed to claim Zink:", err);
    } finally {
      setFormLoading(false);
    }
  };

  const handleAddCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!characterKey.trim()) {
      setFormError("Character key is required");
      return;
    }

    setFormLoading(true);

    try {
      const payload: Record<string, unknown> = {
        character_key: characterKey.trim(),
        alias: alias.trim() || null,
      };
      if (user?.id) {
        payload.user_id = user.id;
      }

      const { error } = await supabase.from("characters").insert([payload]);

      if (error) {
        if (error.message?.includes("user_id")) {
          const fallback = await supabase.from("characters").insert([
            {
              character_key: characterKey.trim(),
              alias: alias.trim() || null,
            },
          ]);
          if (fallback.error) throw fallback.error;
        } else {
          throw error;
        }
      }

      await loadCharacters();
      setCharacterKey("");
      setAlias("");
      setShowForm(false);
    } catch (err: any) {
      setFormError(err.message || "Failed to add character");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this character?")) return;

    try {
      let response = supabase.from("characters").delete().eq("id", id);
      if (user?.id) {
        response = response.eq("user_id", user.id);
      }

      let result = await response;
      if (result.error && result.error.message?.includes("user_id")) {
        result = await supabase.from("characters").delete().eq("id", id);
      }
      if (result.error) throw result.error;
      await loadCharacters();
    } catch (err) {
      console.error("Failed to delete character:", err);
    }
  };

  const canClaimZink =
    user?.email?.toLowerCase() === "mxchestnut@gmail.com" &&
    !characters.some((char) => char.alias?.toLowerCase() === "zink");

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-display font-semibold tracking-tight text-zinc-100">
            Your Characters
          </h1>
          {canClaimZink && (
            <div className="mt-3 rounded-2xl border border-amber-300/20 bg-amber-300/5 p-4 text-sm text-amber-100">
              <p className="mb-2 text-amber-200">
                This account can claim Zink as your saved character.
              </p>
              <button
                type="button"
                onClick={handleClaimZink}
                disabled={formLoading}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <LuPlus className="size-4" />
                Claim Zink
              </button>
            </div>
          )}
        </div>

        <button
          onClick={onLogout}
          className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-sm font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
        >
          Sign out
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <LuLoader className="animate-spin size-6 text-amber-300" />
        </div>
      ) : characters.length === 0 && !showForm ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-8 text-center">
          <p className="text-zinc-400 mb-4">No characters saved yet</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/30 bg-amber-300/10 px-4 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/15"
          >
            <LuPlus className="size-4" />
            Add your first character
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {characters.map((char) => (
            <div
              key={char.id}
              className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 flex items-center justify-between"
            >
              <div
                className="flex-1 cursor-pointer"
                onClick={() => onCharacterSelect(char.character_key, char.alias || undefined)}
              >
                <p className="text-sm font-semibold text-zinc-100">
                  {char.alias || "Unnamed character"}
                </p>
                <p className="text-xs text-zinc-500 font-mono">
                  Key: …{char.character_key.slice(-8)}
                </p>
                <p className="text-xs text-zinc-600">
                  {new Date(char.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDeleteCharacter(char.id)}
                className="ml-4 p-2 rounded-md border border-zinc-700/80 bg-zinc-900/70 text-zinc-400 transition hover:border-red-900/60 hover:bg-red-950/40 hover:text-red-300"
              >
                <LuTrash2 className="size-4" />
              </button>
            </div>
          ))}

          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-amber-300/60 hover:bg-zinc-800 flex items-center justify-center gap-2"
            >
              <LuPlus className="size-4" />
              Add another character
            </button>
          )}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAddCharacter} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100">Add a character</h2>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Character Key
            </label>
            <textarea
              value={characterKey}
              onChange={(e) => setCharacterKey(e.target.value)}
              placeholder="Paste your PathCompanion character key"
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">
              Character Alias (optional)
            </label>
            <input
              type="text"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g., zink, archer, wizard"
              className="w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
            />
          </div>

          {formError && (
            <div className="rounded-xl bg-red-950/40 border border-red-900/40 p-3 text-sm text-red-200">
              {formError}
            </div>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={formLoading}
              className="flex-1 rounded-xl border border-amber-300/30 bg-amber-300/10 px-3 py-2.5 text-sm font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {formLoading ? "Saving..." : "Save character"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormError("");
              }}
              className="rounded-xl border border-zinc-700/80 bg-zinc-900/70 px-3 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-zinc-600 hover:bg-zinc-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
