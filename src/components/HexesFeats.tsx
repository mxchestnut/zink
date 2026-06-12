import { LuAward, LuSkull } from "react-icons/lu";
import type { Character } from "../types";
import { Section } from "./Section";

export function SignatureAbilities({ character }: { character: Character }) {
  return (
    <Section icon={LuSkull} title="Signature Abilities">
      <div className="grid gap-3 sm:grid-cols-2">
        {character.specials.map((ability) => (
          <div
            key={ability.name}
            className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-4 transition-colors hover:border-amber-300/30"
          >
            <h3 className="font-display text-lg text-zinc-100">{ability.name}</h3>
            {ability.note && (
              <p className="mt-1 text-sm leading-relaxed text-zinc-400">{ability.note}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FeatsTraits({ character }: { character: Character }) {
  return (
    <Section icon={LuAward} title="Feats & Traits">
      <div className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
        <ul className="space-y-3">
          {character.feats.map((feat) => (
            <li key={feat.name} className="flex gap-3 text-sm">
              <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-amber-300/80" />
              <span>
                <span className="text-zinc-200">{feat.name}</span>
                {feat.note && <span className="text-zinc-500"> — {feat.note}</span>}
              </span>
            </li>
          ))}
        </ul>
        <div>
          <div className="mb-3 text-[10px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
            Traits
          </div>
          <ul className="space-y-3">
            {character.traits.map((trait) => (
              <li key={trait.name} className="flex gap-3 text-sm">
                <span className="mt-[7px] size-1.5 shrink-0 rounded-full bg-zinc-600" />
                <span>
                  <span className="text-zinc-200">{trait.name}</span>
                  {trait.note && <span className="text-zinc-500"> — {trait.note}</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
