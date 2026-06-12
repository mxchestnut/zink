import { GiPlainDagger } from "react-icons/gi";
import type { Character } from "../types";
import { Section } from "./Section";

/** Spotlight card for the sentient dagger — teal-tinged, like its gem. */
export function BlackBlade({ character }: { character: Character }) {
  const blade = character.signatureWeapon;

  return (
    <Section icon={GiPlainDagger} title="The Black Blade">
      <div className="overflow-hidden rounded-xl border border-teal-300/15 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30">
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h3 className="font-display text-3xl text-zinc-50">{blade.name}</h3>
            <span className="text-[11px] tracking-[0.3em] text-teal-300/80 uppercase">
              {blade.subtitle}
            </span>
          </div>
          <p className="font-display mt-2 max-w-prose text-zinc-400 italic">{blade.lore}</p>

          <div className="mt-5 flex flex-wrap gap-2">
            {blade.stats.map((stat) => (
              <span
                key={stat.label}
                className="rounded-md border border-zinc-700/80 px-2.5 py-1 text-sm"
              >
                <span className="text-zinc-500">{stat.label}&ensp;</span>
                <span className="font-medium text-zinc-100">{stat.value}</span>
              </span>
            ))}
          </div>

          <ul className="mt-5 grid gap-x-8 gap-y-2 text-sm text-zinc-400 sm:grid-cols-2">
            {blade.abilities.map((ability) => (
              <li key={ability} className="flex gap-2.5">
                <span className="mt-[7px] size-1 shrink-0 rounded-full bg-teal-300/70" />
                {ability}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
