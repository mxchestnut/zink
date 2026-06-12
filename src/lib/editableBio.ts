import { useEffect, useState } from "react";
import { closingQuote, dossier, profile } from "../data/backstory";

export interface EditableBio {
  profile: string;
  dossierHtml: string;
  closingQuote: string;
}

const STORAGE_KEY = "zink.onee.cloud.editableBio";

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

export function useEditableBio() {
  const [bio, setBio] = useState<EditableBio>(defaultBio);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EditableBio;
        if (parsed.profile && parsed.dossierHtml && parsed.closingQuote) {
          setBio(parsed);
        }
      }
    } catch {
      // ignore malformed stored content
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bio));
  }, [bio]);

  const resetBio = () => setBio(defaultBio);

  return { bio, setBio, resetBio };
}
