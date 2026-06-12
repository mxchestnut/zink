import { LuCompass, LuMapPin, LuMoon, LuSparkles } from "react-icons/lu";
import type { Character } from "../types";
import { comma } from "../lib/format";

export function Hero({ character }: { character: Character }) {
  const { identity } = character;
  const cls = identity.classes[0];
  const xpPct = Math.min(100, Math.round((identity.xp / identity.xpNext) * 100));

  return (
    <header className="pt-14 pb-10 lg:pt-20">
      <p className="mb-5 text-[11px] font-medium tracking-[0.35em] text-zinc-500 uppercase">
        Pathfinder First Edition · Character Portfolio
      </p>

      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-baseline gap-x-5 gap-y-2">
            <h1 className="font-display text-7xl font-medium tracking-tight text-zinc-50 md:text-8xl">
              {identity.name}
            </h1>
            <span className="rounded-full border border-zinc-700 px-3 py-1 text-xs tracking-wide text-zinc-400">
              {identity.pronouns}
            </span>
          </div>

          <p className="mt-4 text-lg text-zinc-300">
            {identity.race} {cls.name}
            {cls.detail ? ` · ${cls.detail}` : ""}
            <span className="text-zinc-600"> — </span>
            <span className="text-zinc-400">{identity.gender}</span>
          </p>

          <p className="font-display mt-3 text-xl text-zinc-400 italic">“{identity.tagline}”</p>

          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <LuCompass className="size-3.5 text-zinc-500" aria-hidden="true" />
              {identity.alignment}
            </li>
            <li className="flex items-center gap-2">
              <LuSparkles className="size-3.5 text-zinc-500" aria-hidden="true" />
              {identity.deity}
            </li>
            <li className="flex items-center gap-2">
              <LuMapPin className="size-3.5 text-zinc-500" aria-hidden="true" />
              {identity.homeland}
            </li>
            <li className="flex items-center gap-2">
              <LuMoon className="size-3.5 text-zinc-500" aria-hidden="true" />
              {identity.size} · {identity.age} years
            </li>
          </ul>
        </div>

        <div className="w-full max-w-xs shrink-0">
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
              Level
            </span>
            <span className="font-display text-6xl leading-none font-medium text-amber-300">
              {cls.level}
            </span>
          </div>
          <div className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400/70 to-amber-300"
              style={{ width: `${xpPct}%` }}
            />
          </div>
          <p className="mt-2 text-right text-xs text-zinc-500">
            {comma(identity.xp)} / {comma(identity.xpNext)} XP
          </p>
        </div>
      </div>

      <div className="mt-10 h-px bg-gradient-to-r from-amber-300/60 via-zinc-700 to-transparent" />
    </header>
  );
}
