import { LuFeather } from "react-icons/lu";
import { Backstory } from "./components/Backstory";
import { Combat } from "./components/Combat";
import { Equipment } from "./components/Equipment";
import { Familiar } from "./components/Familiar";
import { Footer } from "./components/Footer";
import { GeometricOwl } from "./components/GeometricOwl";
import { Hero } from "./components/Hero";
import { FeatsTraits, Hexes } from "./components/HexesFeats";
import { Journal } from "./components/Journal";
import { Section } from "./components/Section";
import { Sidebar } from "./components/Sidebar";
import { Skills } from "./components/Skills";
import { Spellcraft } from "./components/Spellcraft";
import { profile } from "./data/backstory";
import { useCharacter } from "./lib/pathcompanion";

export default function App() {
  const { character, source } = useCharacter();

  return (
    <div className="relative min-h-screen overflow-clip">
      {/* faint candlelight at the top of the page */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(60%_55%_at_50%_0%,rgba(251,191,36,0.06),transparent)]"
        aria-hidden="true"
      />
      {/* Vesper, watermarked into the margin */}
      <GeometricOwl
        className="pointer-events-none fixed -right-24 top-28 hidden w-[30rem] rotate-6 text-zinc-800/60 xl:block"
        accentClassName="text-zinc-700"
        still
      />

      <div className="relative mx-auto max-w-6xl px-6 lg:px-10">
        <Hero character={character} />

        <div className="grid grid-cols-1 gap-12 pb-4 lg:grid-cols-[19rem_minmax(0,1fr)] lg:gap-16">
          <Sidebar character={character} />

          <main>
            <Section icon={LuFeather} title="Profile">
              <p className="max-w-prose leading-relaxed text-zinc-400">{profile}</p>
            </Section>

            <Combat character={character} />
            <Hexes character={character} />
            <FeatsTraits character={character} />
            <Spellcraft character={character} />
            <Skills character={character} />
            <Equipment character={character} />
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
