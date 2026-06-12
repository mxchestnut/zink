/** Pathfinder 1e character model — the single shape every component reads. */

export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export interface AbilityScore {
  score: number;
  mod: number;
}

export interface CharacterClass {
  name: string;
  level: number;
  detail?: string; // archetype, patron, school…
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
  perDay: string;
  spells: string[];
}

export interface NamedNote {
  name: string;
  note?: string;
}

export interface Character {
  identity: {
    name: string;
    pronouns: string;
    gender: string;
    race: string;
    classes: CharacterClass[];
    alignment: string;
    deity: string;
    homeland: string;
    size: string;
    age: string;
    xp: number;
    xpNext: number;
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
  languages: string[];
  attacks: Attack[];
  skills: Skill[];
  hexes: NamedNote[];
  feats: NamedNote[];
  traits: NamedNote[];
  spellcasting: {
    tradition: string;
    note: string;
    levels: SpellLevel[];
  };
  equipment: NamedNote[];
  coin: string;
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
