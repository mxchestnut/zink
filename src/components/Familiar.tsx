import { GiOwl } from "react-icons/gi";
import type { Character } from "../types";
import { GeometricOwl } from "./GeometricOwl";
import { Section } from "./Section";

export function Familiar({ character }: { character: Character }) {
  const { familiar } = character;

  return (
    <Section icon={GiOwl} title="The Familiar">
      <div className="overflow-hidden rounded-xl border border-amber-300/15 bg-gradient-to-br from-zinc-900/80 to-zinc-900/30">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8">
          <div className="shrink-0 self-center sm:self-start">
            <GeometricOwl className="w-32 text-zinc-500" />
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-3xl text-zinc-50">{familiar.name}</h3>
              <span className="text-[11px] tracking-[0.3em] text-amber-300/80 uppercase">
                {familiar.species} familiar
              </span>
            </div>
            <p className="font-display mt-2 text-zinc-400 italic">{familiar.bond}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {familiar.stats.map((stat) => (
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
              {familiar.perks.map((perk) => (
                <li key={perk} className="flex gap-2.5">
                  <span className="mt-[7px] size-1 shrink-0 rounded-full bg-amber-300/70" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
