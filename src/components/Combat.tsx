import { GiCrossedSwords } from "react-icons/gi";
import type { Character } from "../types";
import { signed } from "../lib/format";
import { Section } from "./Section";

export function Combat({ character }: { character: Character }) {
  const { vitals, attacks } = character;

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
          {attacks.map((attack) => (
            <tr key={attack.name} className="border-t border-zinc-800/80">
              <td className="py-2.5 pr-4 text-zinc-200">{attack.name}</td>
              <td className="py-2.5 pr-4 font-medium text-amber-300">{attack.bonus}</td>
              <td className="py-2.5 pr-4 text-zinc-300">{attack.damage}</td>
              <td className="hidden py-2.5 text-zinc-500 sm:table-cell">{attack.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {character.attacksNote && (
        <p className="mt-4 text-xs leading-relaxed text-zinc-600">{character.attacksNote}</p>
      )}
    </Section>
  );
}
