import { GiTwoCoins } from "react-icons/gi";
import { LuBackpack } from "react-icons/lu";
import type { Character } from "../types";
import { Section } from "./Section";

export function Equipment({ character }: { character: Character }) {
  return (
    <Section icon={LuBackpack} title="Equipment">
      <ul className="grid gap-x-10 sm:grid-cols-2">
        {character.equipment.map((item) => (
          <li
            key={item.name}
            className="flex items-baseline justify-between gap-4 border-b border-zinc-800/60 py-2.5 text-sm"
          >
            <span className="text-zinc-300">{item.name}</span>
            {item.note && <span className="shrink-0 text-xs text-zinc-500">{item.note}</span>}
          </li>
        ))}
      </ul>
      <p className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
        <GiTwoCoins className="size-4 text-amber-300/80" aria-hidden="true" />
        {character.coin}
      </p>
    </Section>
  );
}
