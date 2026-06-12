import { useEffect, useState } from "react";
import { localJournal } from "../data/journal";
import type { JournalEntry, JournalSource } from "../types";

/**
 * Ghost journal integration (Content API — read-only, safe to ship in a
 * static site). Configure via env, see .env.example:
 *
 *   VITE_GHOST_URL  e.g. https://zink.ghost.io  (or a self-hosted Ghost)
 *   VITE_GHOST_KEY  Content API key: Ghost admin → Settings → Integrations
 *   VITE_GHOST_TAG  optional tag filter, e.g. "journal"
 *
 * Without config — or if Ghost is unreachable — the local entries in
 * src/data/journal.ts render instead, so the journal never goes blank.
 */

const GHOST_URL: string = import.meta.env.VITE_GHOST_URL || "https://zink.ghost.io";
const GHOST_KEY: string = import.meta.env.VITE_GHOST_KEY || "9b6d23e26b14b83849c8b23027";
const GHOST_TAG: string | undefined = import.meta.env.VITE_GHOST_TAG;

interface GhostPost {
  title: string;
  url: string;
  published_at: string;
  custom_excerpt: string | null;
  excerpt: string | null;
}

function postsUrl(): string {
  const base = GHOST_URL!.replace(/\/+$/, "");
  const params = new URLSearchParams({
    key: GHOST_KEY!,
    limit: "6",
    fields: "title,url,published_at,custom_excerpt,excerpt",
    order: "published_at desc",
  });
  if (GHOST_TAG) params.set("filter", `tag:${GHOST_TAG}`);
  return `${base}/ghost/api/content/posts/?${params}`;
}

function toEntry(post: GhostPost): JournalEntry {
  const excerpt = (post.custom_excerpt ?? post.excerpt ?? "").trim();
  return {
    title: post.title,
    date: new Date(post.published_at).toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
    excerpt: excerpt.length > 260 ? `${excerpt.slice(0, 257)}…` : excerpt,
    url: post.url,
  };
}

export function useJournal(): { entries: JournalEntry[]; source: JournalSource } {
  const [state, setState] = useState<{ entries: JournalEntry[]; source: JournalSource }>({
    entries: localJournal,
    source: "local",
  });

  useEffect(() => {
    if (!GHOST_URL || !GHOST_KEY) {
      console.info(
        "[journal] Ghost not configured at build time — showing local entries. " +
          "Set VITE_GHOST_URL and VITE_GHOST_KEY (see README).",
      );
      return;
    }
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(postsUrl(), { signal: controller.signal });
        if (!res.ok) {
          console.warn(`[journal] Ghost responded ${res.status} — showing local entries.`);
          return;
        }
        const data = (await res.json()) as { posts?: GhostPost[] };
        if (data.posts?.length) {
          setState({ entries: data.posts.map(toEntry), source: "ghost" });
        } else {
          console.warn(
            `[journal] Ghost returned no posts${GHOST_TAG ? ` tagged "${GHOST_TAG}"` : ""} — ` +
              "showing local entries. Are the posts published (not drafts)?",
          );
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.warn("[journal] Ghost fetch failed — showing local entries.", err);
        }
      }
    })();
    return () => controller.abort();
  }, []);

  return state;
}
