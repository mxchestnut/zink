import { LuCompass, LuFingerprint, LuScale, LuSearch } from "react-icons/lu";
import type { Character } from "../types";

export function Hero({ character }: { character: Character }) {
  const { identity } = character;
  const totalLevel = identity.classes.reduce((sum, c) => sum + c.level, 0);
  const classLine = identity.classes
    .map((c) => `${c.name}${c.detail ? ` ${c.detail}` : ""} ${c.level}`)
    .join(" / ");

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
            {identity.race} {classLine}
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
              <LuScale className="size-3.5 text-zinc-500" aria-hidden="true" />
              {identity.deity}
            </li>
            <li className="flex items-center gap-2">
              <LuSearch className="size-3.5 text-zinc-500" aria-hidden="true" />
              {identity.occupation}
            </li>
            {identity.formerName && (
              <li className="flex items-center gap-2">
                <LuFingerprint className="size-3.5 text-zinc-500" aria-hidden="true" />
                formerly designated {identity.formerName}
              </li>
            )}
          </ul>
        </div>

        <div className="w-full max-w-xs shrink-0">
          <div className="flex items-end justify-between">
            <span className="text-[10px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
              Level
            </span>
            <span className="font-display text-6xl leading-none font-medium text-amber-300">
              {totalLevel}
            </span>
          </div>
          <div className="mt-3 flex h-1 gap-1 overflow-hidden rounded-full">
            {identity.classes.map((cls) => (
              <div
                key={cls.name}
                className="h-full rounded-full first:bg-gradient-to-r first:from-amber-400/70 first:to-amber-300 [&:not(:first-child)]:bg-zinc-600"
                style={{ width: `${(cls.level / totalLevel) * 100}%` }}
              />
            ))}
          </div>
          <p className="mt-2 text-right text-xs text-zinc-500">
            {identity.classes.map((c) => `${c.name} ${c.level}`).join(" · ")}
            {identity.favoredClass && (
              <span className="text-zinc-600"> · favored: {identity.favoredClass}</span>
            )}
          </p>
        </div>
      </div>

      <div className="mt-10 h-px bg-gradient-to-r from-amber-300/60 via-zinc-700 to-transparent" />
    </header>
  );
}
