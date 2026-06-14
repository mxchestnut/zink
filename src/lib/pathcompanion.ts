import { useEffect, useState } from "react";
import snapshotJson from "../data/character.json";
import type {
  AbilityKey,
  Character,
  CharacterClass,
  CharacterSource,
  NamedNote,
  Skill,
  SpellBlock,
} from "../types";

/**
 * PathCompanion (pathcompanion.com) integration.
 *
 * PathCompanion is a PlayFab-backed app. A "character key" is base64 JSON
 * naming the PlayFab account + character slot. Zink's key decodes to:
 *   { account: "27C7B3F64FD85592", character: "character13" }
 * The account is the owner's PlayFab ID; the sheet lives in PlayFab UserData
 * (Permission "Public"), stored as a base64'd, zlib-compressed character JSON.
 *
 * Data reaches this app two ways, both funnelling through harvest():
 *  1. Build time — `npm run sync` saves the decoded sheet to
 *     src/data/pathcompanion-raw.json, picked up automatically.
 *  2. Runtime  — if VITE_PC_PLAYFAB_TITLE is set, the browser logs into
 *     PlayFab and re-reads the sheet live on every visit (source "live").
 *
 * The hand-written snapshot (src/data/character.json) supplies the curated
 * narrative — titles, taglines, lore — and is the floor every map merges onto.
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

export function normalizeCharacterKey(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function isCharacterKey(value?: string): boolean {
  if (!value) return false;
  try {
    const decoded = decodeCharacterKey(value.trim());
    return typeof decoded.account === "string" && typeof decoded.character === "string";
  } catch {
    return false;
  }
}

const snapshot = snapshotJson as unknown as Character;

// ---------------------------------------------------------------------------
// Shared helpers
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

const str = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() && v.length < 80 ? v.trim() : undefined;

const ABILITY_KEYS: AbilityKey[] = ["str", "dex", "con", "int", "wis", "cha"];

// ---------------------------------------------------------------------------
// Native PathCompanion mapper: PathCompanion's own export schema is known, so
// map its rich, list-shaped sections (feats, traits, skills, spells) explicitly
// instead of guessing. Curated snapshot prose is preserved for everything the
// export doesn't carry cleanly (titles, lore, attacks, equipment, specials).
// ---------------------------------------------------------------------------

/* eslint-disable @typescript-eslint/no-explicit-any */
function isPathCompanionNative(raw: unknown): boolean {
  if (!isObj(raw)) return false;
  const r = raw as any;
  return isObj(r.characterInfo) && isObj(r.abilities) &&
    typeof (r.abilities.str?.total ?? r.abilities.dex?.total) === "number";
}

function mapClasses(levelInfo: any, deity: any): CharacterClass[] {
  const counts: Record<string, number> = {};
  for (const v of Object.values(levelInfo ?? {})) {
    const cl = (v as any)?.class;
    if (typeof cl === "string") counts[cl] = (counts[cl] ?? 0) + 1;
  }
  return Object.entries(counts).map(([name, level]) =>
    name === "Warpriest" && deity?.name ? { name, level, detail: `of ${deity.name}` } : { name, level },
  );
}

function mapFeats(levelInfo: any, snapFeats: NamedNote[]): NamedNote[] {
  const noteFor = new Map(snapFeats.map((f) => [f.name.toLowerCase().replace(/\s*\(.*\)$/, ""), f.note]));
  const seen = new Set<string>();
  const out: NamedNote[] = [];
  for (const info of Object.values(levelInfo ?? {})) {
    for (const f of ((info as any)?.Feats ?? []) as any[]) {
      if (!f?.name || f.source === "class" || f.hidden) continue;
      const key = String(f.name).toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      const note = noteFor.get(key) ?? noteFor.get(key.replace(/\s*\(.*\)$/, ""));
      out.push(note ? { name: f.name, note } : { name: f.name });
    }
  }
  return out;
}

function mapTraits(traits: any): NamedNote[] {
  if (!Array.isArray(traits)) return [];
  return traits.map((t) => ({ name: String(t?.name ?? "") })).filter((t) => t.name);
}

function mapSkills(skills: any, snapSkills: Skill[]): Skill[] {
  if (!isObj(skills)) return [];
  const noteFor = new Map(snapSkills.map((s) => [s.name.toLowerCase(), s.note]));
  const out: Skill[] = [];
  for (const [name, s] of Object.entries(skills as Record<string, any>)) {
    if (!isObj(s) || typeof s.ranks !== "number" || s.ranks <= 0) continue;
    const ability = s.ability as AbilityKey;
    if (!ABILITY_KEYS.includes(ability)) continue;
    const note = noteFor.get(name.toLowerCase());
    out.push({
      name,
      total: typeof s.total === "number" ? s.total : 0,
      ranks: s.ranks,
      ability,
      classSkill: !!s.classSkill,
      ...(note ? { note } : {}),
    });
  }
  return out.sort((a, b) => b.total - a.total);
}

const PARTICLES = /\b(of|the|from|and|on|in|to)\b/gi;
function cleanSpellName(name: string): string {
  return name
    .replace(/,\s*(Greater|Lesser|Mass|Communal)\b/i, " ($1)")
    .replace(/\s*\((PotN|PFRPG|APG|UM|UC|ACG|UI|OA)\)\s*$/i, "")
    .replace(PARTICLES, (m) => m.toLowerCase())
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

function mapSpells(spells: any, abilities: any, snapSC: SpellBlock[]): SpellBlock[] {
  if (!isObj(spells)) return [];
  const blocks: SpellBlock[] = [];
  for (const [cls, b] of Object.entries(spells as Record<string, any>)) {
    const blk = b as any;
    if (!blk || typeof blk !== "object" || !blk.preparedSpells) continue;
    const mod = asNumber((abilities ?? {})[blk.ability]?.check) ?? 0;
    const baseDC = typeof blk.baseSaveDC === "number" ? blk.baseSaveDC : 10;
    const levels = Object.keys(blk.preparedSpells)
      .sort((a, c) => Number(a) - Number(c))
      .map((lvl) => {
        const L = Number(lvl);
        const names = [
          ...new Set((blk.preparedSpells[lvl] as any[]).map((s: any) => cleanSpellName(String(s?.name ?? ""))).filter(Boolean)),
        ].sort();
        return { level: L, perDay: L === 0 ? "at will" : `DC ${baseDC + L + mod}`, spells: names };
      });
    if (!levels.length) continue;
    const curated = snapSC.find((x) => x.tradition.toLowerCase().includes(cls.toLowerCase()));
    blocks.push({
      tradition: curated?.tradition ?? cls,
      note: curated?.note ?? `CL ${blk.casterLevel ?? "?"} · concentration +${blk.concentration?.total ?? "?"}`,
      levels,
    });
  }
  return blocks;
}

/** Map PathCompanion's native export onto the snapshot, section by section. */
function mapNative(raw: any): { character: Character; found: number } {
  const c: Character = structuredClone(snapshot);
  let found = 0;
  const take = <T>(value: T | undefined, apply: (v: T) => void) => {
    if (value !== undefined && value !== null) {
      apply(value);
      found++;
    }
  };
  const ci = raw.characterInfo ?? {};

  // Identity
  take(str(ci.characterName), (v) => (c.identity.name = v));
  take(str(ci.race?.race ?? ci.race?.name ?? ci.race), (v) => (c.identity.race = v));
  take(str(ci.alignment), (v) => (c.identity.alignment = v));
  take(str(ci.deity?.name ?? ci.deity), (v) => (c.identity.deity = v));
  take(str(ci.size?.baseSize ?? ci.size), (v) => (c.identity.size = v));
  take(Object.keys(ci.favoredClass ?? {})[0], (v) => (c.identity.favoredClass = v));
  const classes = mapClasses(ci.levelInfo, ci.deity);
  if (classes.length) take(classes, (v) => (c.identity.classes = v));

  // Abilities
  for (const k of ABILITY_KEYS) {
    const score = asNumber(raw.abilities?.[k]?.total);
    if (score !== undefined && score >= 6) {
      c.abilities[k] = { score, mod: Math.floor((score - 10) / 2) };
      found++;
    }
  }

  // Vitals
  take(asNumber(raw.defense?.hp), (v) => (c.vitals.hpMax = v));
  take(asNumber(raw.offense?.initiative), (v) => (c.vitals.init = v));
  take(asNumber(raw.offense?.bab), (v) => (c.vitals.bab = v));
  take(asNumber(raw.offense?.cmb), (v) => (c.vitals.cmb = v));
  take(asNumber(raw.defense?.cmd), (v) => (c.vitals.cmd = v));
  take(asNumber(raw.defense?.ac), (v) => (c.vitals.ac.total = v));
  take(asNumber(raw.defense?.ac?.touch), (v) => (c.vitals.ac.touch = v));
  take(asNumber(raw.defense?.ac?.flatFooted), (v) => (c.vitals.ac.flatFooted = v));

  // Saves
  take(asNumber(raw.defense?.saves?.fort), (v) => (c.saves.fort = v));
  take(asNumber(raw.defense?.saves?.reflex), (v) => (c.saves.ref = v));
  take(asNumber(raw.defense?.saves?.will), (v) => (c.saves.will = v));

  // Rich sections
  const feats = mapFeats(ci.levelInfo, snapshot.feats);
  if (feats.length) take(feats, (v) => (c.feats = v));
  const traits = mapTraits(ci.traits);
  if (traits.length) take(traits, (v) => (c.traits = v));
  const skills = mapSkills(raw.skills, snapshot.skills);
  if (skills.length) take(skills, (v) => (c.skills = v));
  const spellcasting = mapSpells(raw.spells, raw.abilities, snapshot.spellcasting);
  if (spellcasting.length) take(spellcasting, (v) => (c.spellcasting = v));

  return { character: c, found };
}

// ---------------------------------------------------------------------------
// Generic fallback: tolerant DFS for arbitrary exported JSON that isn't in
// PathCompanion's native shape. Anything it can't confidently find stays on
// snapshot values, so a partial match never breaks the page.
// ---------------------------------------------------------------------------

/** Depth-first search for the first key matching `names` whose value passes `pick`. */
function dig<T>(root: unknown, names: string[], pick: (v: unknown) => T | undefined, maxDepth = 6): T | undefined {
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

const ABILITY_NAMES: Record<AbilityKey, string[]> = {
  str: ["str", "strength"],
  dex: ["dex", "dexterity"],
  con: ["con", "constitution"],
  int: ["int", "intelligence"],
  wis: ["wis", "wisdom"],
  cha: ["cha", "charisma"],
};

function harvestGeneric(raw: unknown): { character: Character; found: number } {
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
      if (score >= 6) c.abilities[key] = { score, mod: Math.floor((score - 10) / 2) };
    });
  }

  take(dig(raw, ["hp", "hitpoints", "maxhp", "hp_max"], asNumber), (v) => (c.vitals.hpMax = v));
  take(dig(raw, ["init", "initiative"], asNumber), (v) => (c.vitals.init = v));
  take(dig(raw, ["bab", "baseattackbonus", "base_attack"], asNumber), (v) => (c.vitals.bab = v));
  take(dig(raw, ["cmb"], asNumber), (v) => (c.vitals.cmb = v));
  take(dig(raw, ["cmd"], asNumber), (v) => (c.vitals.cmd = v));
  take(dig(raw, ["ac", "armorclass", "armor_class"], asNumber), (v) => (c.vitals.ac.total = v));
  take(dig(raw, ["touch", "touchac", "touch_ac"], asNumber), (v) => (c.vitals.ac.touch = v));
  take(dig(raw, ["flatfooted", "flat_footed", "ffac", "flatfootedac"], asNumber), (v) => (c.vitals.ac.flatFooted = v));
  take(dig(raw, ["fort", "fortitude"], asNumber), (v) => (c.saves.fort = v));
  take(dig(raw, ["ref", "reflex"], asNumber), (v) => (c.saves.ref = v));
  take(dig(raw, ["will"], asNumber), (v) => (c.saves.will = v));

  return { character: c, found };
}

/** Merge a raw export onto the snapshot, using the native mapper when recognised. */
export function harvest(raw: unknown): { character: Character; found: number } {
  return isPathCompanionNative(raw) ? mapNative(raw as any) : harvestGeneric(raw);
}

// ---------------------------------------------------------------------------
// Data sources
// ---------------------------------------------------------------------------

/** Synced JSON saved by `npm run sync`, if present (optional file). */
function importedRaw(): unknown {
  const mods = import.meta.glob<{ default: unknown }>("../data/pathcompanion-raw.json", { eager: true });
  return Object.values(mods)[0]?.default;
}

// --- Live PlayFab sync (PathCompanion's real backend) ----------------------
// The Title ID is public (it rides every PlayFab request). Set it via
// VITE_PC_PLAYFAB_TITLE to enable live in-browser sync; empty disables it.
const PLAYFAB_TITLE_ID: string = (import.meta.env.VITE_PC_PLAYFAB_TITLE as string | undefined) ?? "";

/** Stable per-browser anonymous id so we reuse one throwaway PlayFab account. */
function anonPlayFabId(): string {
  const KEY = "onee.cloud.pfAnonId";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id = `onee-${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

async function playfabPost(method: string, body: object, ticket: string | undefined, signal: AbortSignal): Promise<any> {
  const res = await fetch(`https://${PLAYFAB_TITLE_ID}.playfabapi.com/Client/${method}`, {
    method: "POST",
    signal,
    headers: { "content-type": "application/json", ...(ticket ? { "X-Authorization": ticket } : {}) },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${method} ${res.status}`);
  return res.json();
}

/** base64 → zlib-inflate → JSON, in the browser (no dependency). */
async function inflateZlibBase64(b64: string): Promise<unknown> {
  if (typeof DecompressionStream === "undefined") throw new Error("DecompressionStream unsupported");
  const bytes = Uint8Array.from(atob(b64), (ch) => ch.charCodeAt(0));
  const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("deflate"));
  return JSON.parse(await new Response(stream).text());
}

/** Log into PlayFab anonymously, read the shared character's Public UserData. */
async function fetchLivePlayFab(key: string, signal: AbortSignal): Promise<unknown | undefined> {
  if (!PLAYFAB_TITLE_ID) return undefined;
  const { account, character } = decodeCharacterKey(key);
  const login = await playfabPost(
    "LoginWithCustomID",
    { TitleId: PLAYFAB_TITLE_ID, CustomId: anonPlayFabId(), CreateAccount: true },
    undefined,
    signal,
  );
  const ticket: string | undefined = login?.data?.SessionTicket;
  if (!ticket) return undefined;

  const env = await playfabPost("GetUserData", { PlayFabId: account, Keys: [character] }, ticket, signal);
  const store = (env?.data?.Data ?? {}) as Record<string, any>;
  const valueStr: unknown = store[character]?.Value ?? Object.values(store)[0]?.Value;
  if (typeof valueStr !== "string") return undefined;
  const inner = JSON.parse(valueStr);
  if (typeof inner?.Data !== "string") return undefined;
  return inflateZlibBase64(inner.Data);
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Optional plain-URL endpoint, e.g. "https://host/character?key={key}". */
const LIVE_API: string = import.meta.env.VITE_PC_API || "";

function liveUrl(template: string, key: string): string {
  const { account, character } = decodeCharacterKey(key);
  return template
    .replaceAll("{key}", encodeURIComponent(key))
    .replaceAll("{account}", account)
    .replaceAll("{character}", character);
}

function initialCharacterState(): { character: Character; source: CharacterSource } {
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
}

export function useCharacter(characterKey?: string): { character: Character; source: CharacterSource } {
  const [state, setState] = useState<{ character: Character; source: CharacterSource }>(initialCharacterState);

  useEffect(() => {
    const normalizedKey = normalizeCharacterKey(characterKey);
    if (!normalizedKey) {
      setState(initialCharacterState());
      return;
    }

    const controller = new AbortController();
    (async () => {
      // 1. Live from PlayFab (PathCompanion's backend), if a Title ID is set.
      try {
        const raw = await fetchLivePlayFab(normalizedKey, controller.signal);
        if (raw) {
          const { character, found } = harvest(raw);
          if (found > 0) {
            setState({ character, source: "live" });
            return;
          }
        }
      } catch {
        // Offline, unsupported, or endpoint moved — fall through.
      }
      // 2. Optional plain-URL endpoint fallback.
      if (!LIVE_API) return;
      try {
        const res = await fetch(liveUrl(LIVE_API, normalizedKey), {
          signal: controller.signal,
          headers: { accept: "application/json" },
        });
        if (!res.ok) return;
        const { character, found } = harvest(await res.json());
        if (found > 0) setState({ character, source: "live" });
      } catch {
        // The imported/snapshot data stays on screen.
      }
    })();
    return () => controller.abort();
  }, [characterKey]);

  return state;
}
