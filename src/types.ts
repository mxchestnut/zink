/** Pathfinder 1e character model — the single shape every component reads. */

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScore {
  score: number;
  mod: number;
}

export interface CharacterClass {
  name: string;
  level: number;
  detail?: string; // "of Yaezhing", archetype, patron…
}

export interface Attack {
  name: string;
  bonus: string;
  damage: string;
  notes?: string;
}

export interface Skill {
  name: string;
  total: number;
  ranks: number;
  ability: AbilityKey;
  classSkill?: boolean;
  note?: string;
}

export interface SpellLevel {
  level: number;
  perDay: string; // shown under the level badge — uses/day or save DC
  spells: string[];
}

export interface SpellBlock {
  tradition: string;
  note: string;
  levels: SpellLevel[];
}

export interface NamedNote {
  name: string;
  note?: string;
}

export interface Character {
  identity: {
    name: string;
    formerName?: string;
    pronouns: string;
    gender: string;
    race: string;
    classes: CharacterClass[];
    favoredClass?: string;
    alignment: string;
    deity: string;
    occupation: string;
    titles: string[];
    size: string;
    tagline: string;
  };
  vitals: {
    hpMax: number;
    init: number;
    speed: string;
    bab: number;
    cmb: number;
    cmd: number;
    ac: { total: number; touch: number; flatFooted: number; note?: string };
  };
  abilities: Record<AbilityKey, AbilityScore>;
  saves: { fort: number; ref: number; will: number };
  senses: string[];
  /** Immunities and standing defensive bonuses (android chassis, class). */
  resilience: string[];
  attacks: Attack[];
  attacksNote?: string;
  skills: Skill[];
  /** Signature class abilities — death attack, fervor, nanite surge… */
  specials: NamedNote[];
  feats: NamedNote[];
  traits: NamedNote[];
  spellcasting: SpellBlock[];
  equipment: NamedNote[];
  load: string;
  signatureWeapon: {
    name: string;
    subtitle: string;
    lore: string;
    stats: { label: string; value: string }[];
    abilities: string[];
  };
  familiar: {
    name: string;
    species: string;
    bond: string;
    stats: { label: string; value: string }[];
    perks: string[];
  };
}

/** Where the displayed numbers came from, shown in the footer. */
export type CharacterSource = "snapshot" | "imported" | "live";

export interface JournalEntry {
  title: string;
  date: string;
  excerpt: string;
  url?: string;
}

export type JournalSource = "ghost" | "local";

export interface RollEntry {
  id: string;
  /** Epoch ms when rolled — used for 30-day expiry of persisted history. */
  at: number;
  label: string;
  die: string;
  modifier: number;
  roll: number;
  total: number;
  note?: string;
  time: string;
  natural: number;
}
