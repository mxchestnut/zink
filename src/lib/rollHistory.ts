import { useCallback, useEffect, useState } from "react";
import type { RollEntry } from "../types";

// Roll history persists per-alias in the browser and auto-expires after 30 days.
const TTL_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_ENTRIES = 50;

function storageKey(alias?: string): string {
  return `onee.cloud.rolls.${alias || "default"}`;
}

function prune(entries: RollEntry[]): RollEntry[] {
  const now = Date.now();
  return entries.filter((entry) => typeof entry.at === "number" && now - entry.at < TTL_MS).slice(0, MAX_ENTRIES);
}

function load(alias?: string): RollEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey(alias));
    if (!raw) return [];
    return prune(JSON.parse(raw) as RollEntry[]);
  } catch {
    return [];
  }
}

/**
 * Keeps a character's dice-roll history in localStorage so it survives page
 * refreshes. Entries older than 30 days are dropped automatically, and the
 * log is scoped per alias (e.g. /zink keeps its own history).
 */
export function useRollHistory(alias?: string) {
  const [rolls, setRolls] = useState<RollEntry[]>(() => load(alias));

  // Reload when the alias resolves/changes so each sheet shows its own log.
  useEffect(() => {
    setRolls(load(alias));
  }, [alias]);

  // Persist (pruned) on every change.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(storageKey(alias), JSON.stringify(prune(rolls)));
    } catch {
      // ignore quota / serialization errors
    }
  }, [rolls, alias]);

  const addRoll = useCallback((label: string, die: string, modifier: number, note?: string): RollEntry => {
    const natural = Math.floor(Math.random() * 20) + 1;
    const entry: RollEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      at: Date.now(),
      label,
      die,
      modifier,
      roll: natural,
      total: natural + modifier,
      note,
      natural,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    setRolls((current) => [entry, ...current].slice(0, MAX_ENTRIES));
    return entry;
  }, []);

  const clearRollHistory = useCallback(() => setRolls([]), []);

  return { rolls, addRoll, clearRollHistory };
}
