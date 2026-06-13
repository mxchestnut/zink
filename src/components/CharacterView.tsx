import { useEffect, useState } from "react";
import { LuFeather } from "react-icons/lu";
import { Backstory } from "./Backstory";
import { BlackBlade } from "./BlackBlade";
import { Combat } from "./Combat";
import { Equipment } from "./Equipment";
import { Familiar } from "./Familiar";
import { Footer } from "./Footer";
import { GeometricOwl } from "./GeometricOwl";
import { Hero } from "./Hero";
import { Landing } from "./Landing";
import { FeatsTraits, SignatureAbilities } from "./HexesFeats";
import { Journal } from "./Journal";
import { Section } from "./Section";
import { Sidebar } from "./Sidebar";
import { Skills } from "./Skills";
import { Spellcraft } from "./Spellcraft";
import { useEditableBio } from "../lib/editableBio";
import { CHARACTER_KEY, useCharacter } from "../lib/pathcompanion";
import { detectAlias, normalizeAlias } from "../lib/alias";
import type { RollEntry } from "../types";

export function CharacterView({
  characterKey: initialKey,
  alias: initialAlias,
  canEdit = false,
  onCharacterChange,
}: {
  characterKey?: string;
  alias?: string;
  canEdit?: boolean;
  onCharacterChange?: (key?: string, alias?: string) => void;
}) {
  const [characterKey, setCharacterKey] = useState<string | undefined>(initialKey);
  const [activeAlias, setActiveAlias] = useState<string | undefined>(undefined);
  const [aliases, setAliases] = useState<Record<string, string>>({});
  const [hasLoadedKey, setHasLoadedKey] = useState(false);
  const [host, setHost] = useState<string>("");

  const loadAliases = () => {
    try {
      return JSON.parse(window.localStorage.getItem("onee.cloud.aliases") || "{}") as Record<string, string>;
    } catch {
      return {};
    }
  };

  const saveAliases = (value: Record<string, string>) => {
    window.localStorage.setItem("onee.cloud.aliases", JSON.stringify(value));
  };

  useEffect(() => {
    setHost(window.location.host);
    const savedKey = window.localStorage.getItem("onee.cloud.characterKey");
    const savedAlias = window.localStorage.getItem("onee.cloud.activeAlias");
    const storedAliases = loadAliases();

    if (initialKey) {
      setCharacterKey(initialKey);
    } else if (savedKey) {
      setCharacterKey(savedKey);
    }
    if (savedAlias) {
      setActiveAlias(normalizeAlias(savedAlias));
    }
    setAliases(storedAliases);
    setHasLoadedKey(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedKey) return;
    if (characterKey) {
      window.localStorage.setItem("onee.cloud.characterKey", characterKey);
    } else {
      window.localStorage.removeItem("onee.cloud.characterKey");
    }
  }, [characterKey, hasLoadedKey]);

  useEffect(() => {
    if (!host) return;
    const path = window.location.pathname.replace(/^\/+|\/+$/g, "");
    const pathAlias = normalizeAlias(path);
    const hostParts = host.toLowerCase().split(".");
    const hostAlias =
      hostParts.length === 3 && hostParts[1] === "onee" && hostParts[2] === "cloud" && hostParts[0] !== "www"
        ? hostParts[0]
        : undefined;
    const alias = pathAlias || hostAlias;
    const searchKey = new URLSearchParams(window.location.search).get("key");

    if (!alias) return;

    const storedAliases = loadAliases();
    if (searchKey) {
      const cleanedKey = searchKey.trim();
      if (cleanedKey) {
        const saved = { ...storedAliases, [alias]: cleanedKey };
        saveAliases(saved);
        setAliases(saved);
        setCharacterKey(cleanedKey);
        setActiveAlias(alias);
        window.localStorage.setItem("onee.cloud.activeAlias", alias);
        window.history.replaceState({}, "", `/${alias}`);
      }
      return;
    }

    if (storedAliases[alias]) {
      setCharacterKey(storedAliases[alias]);
      setActiveAlias(alias);
      window.localStorage.setItem("onee.cloud.activeAlias", alias);
    } else if (alias === "zink") {
      setCharacterKey(CHARACTER_KEY);
      setActiveAlias(alias);
      window.localStorage.setItem("onee.cloud.activeAlias", alias);
    } else {
      setCharacterKey(undefined);
      setActiveAlias(alias);
    }
  }, [host]);

  // The bio is keyed by alias so every visitor to /<alias> reads the same
  // saved content; persistence is enabled only when the viewer owns it.
  const bioAlias = initialAlias ?? activeAlias;
  const { bio, setBio, resetBio, error: bioError } = useEditableBio(bioAlias, canEdit);
  const { character, source } = useCharacter(characterKey);
  const [rolls, setRolls] = useState<RollEntry[]>([]);

  // Recomputed from the live URL each render (host is read on mount, which
  // re-renders), and shares detectAlias() with App so both agree on routing.
  const alias = detectAlias() ?? "";
  const isRootLandingPage = alias === "";
  const hasAliasPath = Boolean(alias);
  const showLanding = !characterKey && (isRootLandingPage || (hasAliasPath && !aliases[alias]));

  const addRoll = (label: string, die: string, modifier: number, note?: string) => {
    const roll = Math.floor(Math.random() * 20) + 1;
    const total = roll + modifier;
    const entry: RollEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      label,
      die,
      modifier,
      roll,
      total,
      note,
      natural: roll,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setRolls((current) => [entry, ...current].slice(0, 20));
  };

  const clearRollHistory = () => setRolls([]);

  if (showLanding) {
    return (
      <div className="relative min-h-screen overflow-clip">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(251,191,36,0.06),transparent)]"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-6 lg:px-10 py-16">
          <Landing
            characterKey={characterKey}
            alias={alias || undefined}
            onCharacterKeySave={(key: string, alias?: string) => {
              setCharacterKey(key);
              const normalizedAlias = normalizeAlias(alias);
              if (normalizedAlias) {
                const saved = { ...aliases, [normalizedAlias]: key };
                saveAliases(saved);
                setAliases(saved);
                setActiveAlias(normalizedAlias);
                window.localStorage.setItem("onee.cloud.activeAlias", normalizedAlias);
                window.history.replaceState({}, "", `/${normalizedAlias}`);
              }
              onCharacterChange?.(key, alias);
            }}
            onCharacterKeyClear={() => {
              setCharacterKey(undefined);
              setActiveAlias(undefined);
              window.localStorage.removeItem("onee.cloud.activeAlias");
              if (host === "onee.cloud" || host === "www.onee.cloud") {
                window.history.replaceState({}, "", "/");
              }
              onCharacterChange?.();
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-clip">
      {/* faint candlelight at the top of the page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(251,191,36,0.06),transparent)]"
        aria-hidden="true"
      />
      {/* the owl, watermarked into the margin */}
      <GeometricOwl
        className="pointer-events-none fixed top-28 -right-24 hidden w-[30rem] rotate-6 text-zinc-800/60 xl:block"
        accentClassName="text-zinc-700"
        still
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Hero character={character} />

        <div className="grid grid-cols-1 gap-12 pb-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-16">
          <Sidebar
            character={character}
            rolls={rolls}
            onRoll={addRoll}
            onClearRollHistory={clearRollHistory}
            canEdit={canEdit}
            characterKey={characterKey}
            activeAlias={activeAlias}
            onCharacterKeySave={(key: string, alias?: string) => {
              setCharacterKey(key);
              const normalizedAlias = normalizeAlias(alias);
              if (normalizedAlias) {
                const saved = { ...aliases, [normalizedAlias]: key };
                saveAliases(saved);
                setAliases(saved);
                setActiveAlias(normalizedAlias);
                window.localStorage.setItem("onee.cloud.activeAlias", normalizedAlias);
                if (host === "onee.cloud" || host === "www.onee.cloud") {
                  window.history.replaceState({}, "", `/${normalizedAlias}`);
                }
              }
              onCharacterChange?.(key, alias);
            }}
            onCharacterKeyClear={() => {
              setCharacterKey(undefined);
              setActiveAlias(undefined);
              window.localStorage.removeItem("onee.cloud.activeAlias");
              if (host === "onee.cloud" || host === "www.onee.cloud") {
                window.history.replaceState({}, "", "/");
              }
              onCharacterChange?.();
            }}
          />

          <main>
            <Section icon={LuFeather} title="Profile">
              <p className="max-w-prose leading-relaxed text-zinc-400">{bio.profile}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {character.identity.titles.map((title: string) => (
                  <span
                    key={title}
                    className="flex items-center gap-2 rounded-full border border-zinc-700 px-3 py-1 text-xs tracking-wide text-zinc-300"
                  >
                    <span className="size-1 rounded-full bg-amber-300/80" />
                    {title}
                  </span>
                ))}
              </div>
            </Section>

            <Combat character={character} onRoll={addRoll} />
            <SignatureAbilities character={character} />
            <Spellcraft character={character} />
            <Skills character={character} onRoll={addRoll} />
            <FeatsTraits character={character} />
            <Equipment character={character} />
            <BlackBlade character={character} />
            <Familiar character={character} />
            <Backstory bio={bio} onBioChange={setBio} onReset={resetBio} canEdit={canEdit} bioError={bioError} />
            <Journal />
          </main>
        </div>

        <Footer source={source} characterKey={characterKey} />
      </div>
    </div>
  );
}
