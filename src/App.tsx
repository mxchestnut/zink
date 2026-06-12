import { useState } from "react";
import { LuFeather } from "react-icons/lu";
import { Backstory } from "./components/Backstory";
import { BlackBlade } from "./components/BlackBlade";
import { Combat } from "./components/Combat";
import { Equipment } from "./components/Equipment";
import { Familiar } from "./components/Familiar";
import { Footer } from "./components/Footer";
import { GeometricOwl } from "./components/GeometricOwl";
import { Hero } from "./components/Hero";
import { FeatsTraits, SignatureAbilities } from "./components/HexesFeats";
import { Journal } from "./components/Journal";
import { Section } from "./components/Section";
import { Sidebar } from "./components/Sidebar";
import { Skills } from "./components/Skills";
import { Spellcraft } from "./components/Spellcraft";
import { profile } from "./data/backstory";
import { useCharacter } from "./lib/pathcompanion";
import type { RollEntry } from "./types";

export default function App() {
  const { character, source } = useCharacter();
  const [rolls, setRolls] = useState<RollEntry[]>([]);

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
          />

          <main>
            <Section icon={LuFeather} title="Profile">
              <p className="max-w-prose leading-relaxed text-zinc-400">{profile}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {character.identity.titles.map((title) => (
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
            <Backstory />
            <Journal />
          </main>
        </div>

        <Footer source={source} />
      </div>
    </div>
  );
}
