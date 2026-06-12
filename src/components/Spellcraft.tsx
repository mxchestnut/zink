import { GiSpellBook } from "react-icons/gi";
import type { Character } from "../types";
import { Section } from "./Section";

export function Spellcraft({ character }: { character: Character }) {
  return (
    <Section icon={GiSpellBook} title="Spellcraft" meta="two traditions, one verdict">
      <div className="space-y-10">
        {character.spellcasting.map((block) => (
          <div key={block.tradition}>
            <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h3 className="font-display text-xl text-zinc-100">{block.tradition}</h3>
              <span className="text-xs text-zinc-500">{block.note}</span>
            </div>
            <div className="space-y-5">
              {block.levels.map((lvl) => (
                <div key={lvl.level} className="flex gap-4">
                  <div className="flex w-14 shrink-0 flex-col items-center pt-0.5">
                    <span className="font-display flex size-9 items-center justify-center rounded-full border border-zinc-700 text-base text-zinc-100">
                      {lvl.level}
                    </span>
                    <span className="mt-1.5 text-center text-[10px] leading-tight text-zinc-600">
                      {lvl.perDay}
                    </span>
                  </div>
                  <div className="flex flex-wrap content-start items-start gap-2 pt-1">
                    {lvl.spells.map((spell) => (
                      <span
                        key={spell}
                        className="rounded-md border border-zinc-800 bg-zinc-900/50 px-2.5 py-1 text-sm text-zinc-300"
                      >
                        {spell}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
