import { useEffect, useState } from "react";
import snapshotJson from "../data/character.json";
import type { AbilityKey, Character, CharacterSource } from "../types";

/**
 * PathCompanion (pathcompanion.com) integration.
 *
 * A PathCompanion "character key" is base64-encoded JSON naming an account
 * and a character slot. Zink's key decodes to:
 *   { account: "27C7B3F64FD85592", character: "character13" }
 *
 * PathCompanion doesn't publish API docs, so character data arrives one of
 * two ways — both feed the same tolerant mapper below:
 *
 *  1. `npm run sync` (scripts/sync-pathcompanion.mjs) probes likely API
 *     endpoints with the key and saves whatever JSON it gets to
 *     src/data/pathcompanion-raw.json. The app picks that file up at build
 *     time automatically. (Or save the JSON there by hand from DevTools.)
 *  2. Set VITE_PC_API to a known endpoint template and the deployed site
 *     fetches live in the browser on every visit.
 *
 * Until real data lands, the hand-written snapshot in src/data/character.json
 * is the source of truth.
 */

export const CHARACTER_KEY =
  "eyJhY2NvdW50IjoiMjdDN0IzRjY0RkQ4NTU5MiIsImNoYXJhY3RlciI6ImNoYXJhY3RlcjEzIn0=";

export interface DecodedKey {
  account: string;
  character: string;
}

export function decodeCharacterKey(key: string = CHARACTER_KEY): DecodedKey {
  return JSON.parse(atob(key)) as DecodedKey;
}

const snapshot = snapshotJson as unknown as Character;

// ---------------------------------------------------------------------------
// Tolerant mapper: digs through arbitrary exported JSON for the fields the
// portfolio renders. Anything it can't confidently find stays on snapshot
// values, so a partial match never breaks the page.
// ---------------------------------------------------------------------------

type Json = Record<string, unknown>;

function isObj(v: unknown): v is Json {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Accepts 14, "14", { total: 14 }, { value: 14 }, { score: 14 }. */
function asNumber(v: unknown): number | undefined {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && /^[+−-]?\d+$/.test(v.trim()))
    return parseInt(v.replace("−", "-"), 10);
  if (isObj(v)) {
    for (const k of ["total", "value", "score", "max", "current"]) {
      const n = asNumber(v[k]);
      if (n !== undefined) return n;
    }
  }
  return undefined;
}

/** Depth-first search for the first key matching `names` whose value passes `pick`. */
function dig<T>(
  root: unknown,
  names: string[],
  pick: (v: unknown) => T | undefined,
  maxDepth = 6,
): T | undefined {
  const wanted = new Set(names.map((n) => n.toLowerCase()));
  const queue: { node: unknown; depth: number }[] = [{ node: root, depth: 0 }];
  while (queue.length) {
    const { node, depth } = queue.shift()!;
    if (!isObj(node) || depth > maxDepth) continue;
    for (const [k, v] of Object.entries(node)) {
      if (wanted.has(k.toLowerCase())) {
        const got = pick(v);
        if (got !== undefined) return got;
      }
    }
    for (const v of Object.values(node)) {
      if (isObj(v)) queue.push({ node: v, depth: depth + 1 });
    }
  }
  return undefined;
}

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() && v.length < 80 ? v.trim() : undefined;

const ABILITY_NAMES: Record<AbilityKey, string[]> = {
  str: ["str", "strength"],
  dex: ["dex", "dexterity"],
  con: ["con", "constitution"],
  int: ["int", "intelligence"],
  wis: ["wis", "wisdom"],
  cha: ["cha", "charisma"],
};

/** Merge whatever the raw export yields onto the snapshot. */
export function harvest(raw: unknown): { character: Character; found: number } {
  const c: Character = structuredClone(snapshot);
  let found = 0;
  const take = <T>(value: T | undefined, apply: (v: T) => void) => {
    if (value !== undefined) {
      apply(value);
      found++;
    }
  };

  take(dig(raw, ["name", "charactername", "char_name"], str, 2), (v) => (c.identity.name = v));
  take(dig(raw, ["race"], str), (v) => (c.identity.race = v));
  take(dig(raw, ["alignment"], str), (v) => (c.identity.alignment = v));
  take(dig(raw, ["deity"], str), (v) => (c.identity.deity = v));
  take(dig(raw, ["occupation"], str), (v) => (c.identity.occupation = v));

  for (const key of Object.keys(ABILITY_NAMES) as AbilityKey[]) {
    take(dig(raw, ABILITY_NAMES[key], asNumber), (score) => {
      // Tools export either the score (8–30ish) or sometimes just the mod.
      if (score >= 6) {
        c.abilities[key] = { score, mod: Math.floor((score - 10) / 2) };
      }
    });
  }

  take(dig(raw, ["hp", "hitpoints", "maxhp", "hp_max"], asNumber), (v) => (c.vitals.hpMax = v));
  take(dig(raw, ["init", "initiative"], asNumber), (v) => (c.vitals.init = v));
  take(dig(raw, ["bab", "baseattackbonus", "base_attack"], asNumber), (v) => (c.vitals.bab = v));
  take(dig(raw, ["cmb"], asNumber), (v) => (c.vitals.cmb = v));
  take(dig(raw, ["cmd"], asNumber), (v) => (c.vitals.cmd = v));
  take(dig(raw, ["ac", "armorclass", "armor_class"], asNumber), (v) => (c.vitals.ac.total = v));
  take(dig(raw, ["touch", "touchac", "touch_ac"], asNumber), (v) => (c.vitals.ac.touch = v));
  take(
    dig(raw, ["flatfooted", "flat_footed", "ffac", "flatfootedac"], asNumber),
    (v) => (c.vitals.ac.flatFooted = v),
  );
  take(dig(raw, ["fort", "fortitude"], asNumber), (v) => (c.saves.fort = v));
  take(dig(raw, ["ref", "reflex"], asNumber), (v) => (c.saves.ref = v));
  take(dig(raw, ["will"], asNumber), (v) => (c.saves.will = v));

  return { character: c, found };
}

// ---------------------------------------------------------------------------
// Data sources
// ---------------------------------------------------------------------------

/** Synced JSON saved by `npm run sync`, if present (optional file). */
function importedRaw(): unknown {
  const mods = import.meta.glob<{ default: unknown }>("../data/pathcompanion-raw.json", {
    eager: true,
  });
  return Object.values(mods)[0]?.default;
}

/** e.g. "https://pathcompanion.com/api/character?key={key}" */
const LIVE_API: string | undefined = import.meta.env.VITE_PC_API;

function liveUrl(template: string): string {
  const { account, character } = decodeCharacterKey();
  return template
    .replaceAll("{key}", encodeURIComponent(CHARACTER_KEY))
    .replaceAll("{account}", account)
    .replaceAll("{character}", character);
}

export function useCharacter(): { character: Character; source: CharacterSource } {
  const [state, setState] = useState<{ character: Character; source: CharacterSource }>(() => {
    try {
      const raw = importedRaw();
      if (raw) {
        const { character, found } = harvest(raw);
        if (found > 0) return { character, source: "imported" };
      }
    } catch {
      // A malformed sync file must never take the page down.
    }
    return { character: snapshot, source: "snapshot" };
  });

  useEffect(() => {
    if (!LIVE_API) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await fetch(liveUrl(LIVE_API), {
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;
        const { character, found } = harvest(await res.json());
        if (found > 0) setState({ character, source: "live" });
      } catch {
        // Offline, CORS, or endpoint moved — the snapshot stays on screen.
      }
    })();
    return () => controller.abort();
  }, []);

  return state;
}
