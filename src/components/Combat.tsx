import { Fragment } from "react";
import { GiCrossedSwords } from "react-icons/gi";
import type { Character } from "../types";
import { signed } from "../lib/format";
import { Section } from "./Section";

export function Combat({
  character,
  onRoll,
}: {
  character: Character;
  onRoll: (label: string, die: string, modifier: number, note?: string) => void;
}) {
  const { vitals, attacks } = character;

  const parseBonuses = (bonus: string) =>
    Array.from(bonus.matchAll(/[+-]?\d+/g), (match) => Number(match[0]));

  return (
    <Section icon={GiCrossedSwords} title="Combat">
      <div className="grid grid-cols-3 gap-px overflow-hidden rounded-lg border border-zinc-800 bg-zinc-800">
        {(
          [
            ["Base Attack", signed(vitals.bab)],
            ["CMB", signed(vitals.cmb)],
            ["CMD", String(vitals.cmd)],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="bg-zinc-900/60 px-4 py-3 text-center">
            <div className="font-display text-2xl font-medium text-zinc-100">{value}</div>
            <div className="mt-0.5 text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
              {label}
            </div>
          </div>
        ))}
      </div>

      <table className="mt-5 w-full text-sm">
        <thead>
          <tr className="text-left text-[10px] tracking-[0.2em] text-zinc-500 uppercase">
            <th className="pb-2 font-semibold">Weapon</th>
            <th className="pb-2 font-semibold">Attack</th>
            <th className="pb-2 font-semibold">Damage</th>
            <th className="hidden pb-2 font-semibold sm:table-cell">Notes</th>
          </tr>
        </thead>
        <tbody>
          {attacks.map((attack) => {
            const bonuses = parseBonuses(attack.bonus);
            return (
              <tr key={attack.name} className="border-t border-zinc-800/80">
                <td className="py-2.5 pr-4 text-zinc-200">{attack.name}</td>
                <td className="py-2.5 pr-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {bonuses.map((bonus, index) => (
                      <Fragment key={`${attack.name}-${bonus}-${index}`}>
                        <button
                          type="button"
                          onClick={() =>
                            onRoll(
                              `${attack.name} attack`,
                              "d20",
                              bonus,
                              "Attack roll"
                            )
                          }
                          className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-2.5 py-1 text-sm font-semibold text-amber-300 transition hover:border-amber-300/60 hover:bg-zinc-800"
                          aria-label={`Roll d20 ${signed(bonus)} for ${attack.name}`}
                        >
                          Roll {signed(bonus)}
                        </button>
                        {index < bonuses.length - 1 && (
                          <span className="text-zinc-500">/</span>
                        )}
                      </Fragment>
                    ))}
                  </div>
                </td>
                <td className="py-2.5 pr-4 text-zinc-300">{attack.damage}</td>
                <td className="hidden py-2.5 text-zinc-500 sm:table-cell">{attack.notes}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {character.attacksNote && (
        <p className="mt-4 text-xs leading-relaxed text-zinc-600">{character.attacksNote}</p>
      )}
    </Section>
  );
}
