import { useCallback, useEffect, useState } from "react";
import { closingQuote, dossier, profile } from "../data/backstory";
import { supabase } from "./supabase";

export interface EditableBio {
  profile: string;
  dossierHtml: string;
  closingQuote: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dossierToHtml(sections: typeof dossier): string {
  return sections
    .map((section) => {
      const heading = section.heading
        ? `<h3 class=\"mb-3 text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase\">${escapeHtml(
            section.heading,
          )}</h3>`
        : "";
      const body = section.body
        .map((paragraph) => `<p class=\"mb-5 leading-relaxed text-zinc-400\">${escapeHtml(paragraph)}</p>`)
        .join("");
      return `<div class=\"mb-10\">${heading}${body}</div>`;
    })
    .join("");
}

const defaultBio: EditableBio = {
  profile,
  dossierHtml: dossierToHtml(dossier),
  closingQuote,
};

interface BioRow {
  profile: string;
  dossier_html: string;
  closing_quote: string;
}

function rowToBio(row: BioRow): EditableBio {
  return {
    profile: row.profile,
    dossierHtml: row.dossier_html,
    closingQuote: row.closing_quote,
  };
}

/**
 * Loads a character's bio from Supabase (public, read-only) so every visitor
 * sees the owner's saved content. When `canEdit` is true, `setBio`/`resetBio`
 * persist back to the `character_bios` table; otherwise they only update the
 * local view. With no alias or no saved row, the built-in Zink bio is shown.
 */
export function useEditableBio(alias?: string, canEdit = false) {
  const [bio, setBioState] = useState<EditableBio>(defaultBio);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setError(null);

    if (!alias) {
      setBioState(defaultBio);
      return;
    }

    void (async () => {
      const { data, error: loadError } = await supabase
        .from("character_bios")
        .select("profile, dossier_html, closing_quote")
        .eq("alias", alias)
        .maybeSingle();

      if (cancelled) return;

      if (loadError) {
        // Table missing or unreadable — fall back to the built-in bio.
        setBioState(defaultBio);
        setError(loadError.message);
      } else {
        setBioState(data ? rowToBio(data as BioRow) : defaultBio);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [alias]);

  const setBio = useCallback(
    (next: EditableBio) => {
      setBioState(next);
      if (!canEdit || !alias) return;

      void (async () => {
        const { data: userData } = await supabase.auth.getUser();
        const { error: saveError } = await supabase.from("character_bios").upsert(
          {
            alias,
            profile: next.profile,
            dossier_html: next.dossierHtml,
            closing_quote: next.closingQuote,
            user_id: userData.user?.id ?? null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "alias" },
        );
        setError(saveError ? saveError.message : null);
      })();
    },
    [alias, canEdit],
  );

  const resetBio = useCallback(() => {
    setBioState(defaultBio);
    if (!canEdit || !alias) return;

    void (async () => {
      const { error: deleteError } = await supabase
        .from("character_bios")
        .delete()
        .eq("alias", alias);
      setError(deleteError ? deleteError.message : null);
    })();
  }, [alias, canEdit]);

  return { bio, setBio, resetBio, error };
}
