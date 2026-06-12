import { LuTrendingUp } from "react-icons/lu";
import type { Character } from "../types";
import { signed } from "../lib/format";
import { Section } from "./Section";

export function Skills({ character }: { character: Character }) {
  const max = Math.max(...character.skills.map((s) => s.total)) || 1;

  return (
    <Section
      icon={LuTrendingUp}
      title="Skills"
      meta={
        <span className="flex items-center gap-1.5">
          <span className="inline-block size-1.5 rounded-full bg-amber-300" /> class skill
        </span>
      }
    >
      <div className="grid gap-x-10 gap-y-4 sm:grid-cols-2">
        {character.skills.map((skill) => (
          <div key={skill.name}>
            <div className="flex items-baseline justify-between gap-3 text-sm">
              <span className="flex items-center gap-2 text-zinc-300">
                {skill.classSkill && (
                  <span className="inline-block size-1.5 shrink-0 rounded-full bg-amber-300" />
                )}
                {skill.name}
                {skill.note && <span className="text-xs text-zinc-600">{skill.note}</span>}
              </span>
              <span className="font-medium text-zinc-100">{signed(skill.total)}</span>
            </div>
            <div className="mt-1.5 h-[3px] overflow-hidden rounded-full bg-zinc-800/80">
              <div
                className="h-full rounded-full bg-gradient-to-r from-zinc-500 to-amber-300/90"
                style={{ width: `${Math.max(8, (skill.total / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
