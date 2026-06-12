import { FaDiceD20 } from "react-icons/fa";
import {
  LuBrain,
  LuEye,
  LuFootprints,
  LuHeart,
  LuHeartPulse,
  LuShield,
  LuShieldCheck,
  LuZap,
} from "react-icons/lu";
import type { Character, RollEntry } from "../types";
import { signed } from "../lib/format";
import { GeometricOwl } from "./GeometricOwl";
import { Label } from "./Section";
import { CharacterKeyForm } from "./CharacterKeyForm";
import { RollHistory } from "./RollHistory";

const ABILITY_ORDER = ["str", "dex", "con", "int", "wis", "cha"] as const;

export function Sidebar({
  character,
  rolls,
  onRoll,
  onClearRollHistory,
  characterKey,
  activeAlias,
  onCharacterKeySave,
  onCharacterKeyClear,
}: {
  character: Character;
  rolls: RollEntry[];
  onRoll: (label: string, die: string, modifier: number, note?: string) => void;
  onClearRollHistory: () => void;
  characterKey?: string;
  activeAlias?: string;
  onCharacterKeySave: (key: string, alias?: string) => void;
  onCharacterKeyClear: () => void;
}) {
  const { abilities, vitals, saves } = character;
  const lastRoll = rolls[0];

  return (
    <aside className="space-y-9 lg:sticky lg:top-10 lg:self-start">
      <CharacterKeyForm
        keyValue={characterKey}
        aliasValue={activeAlias}
        onSave={onCharacterKeySave}
        onClear={onCharacterKeyClear}
      />
      {/* Vitals */}
      <div>
        <Label>Vitals</Label>
        <div className="flex items-end justify-between">
          <div className="flex items-center gap-2.5">
            <LuHeart className="size-4 text-amber-300/80" aria-hidden="true" />
            <span className="text-sm text-zinc-400">Hit Points</span>
          </div>
          <span className="font-display text-4xl leading-none font-medium text-zinc-100">
            {vitals.hpMax}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-3 divide-x divide-zinc-800 border-y border-zinc-800 py-3 text-center">
          {(
            [
              ["AC", vitals.ac.total],
              ["Touch", vitals.ac.touch],
              ["Flat", vitals.ac.flatFooted],
            ] as const
          ).map(([label, value]) => (
            <div key={label}>
              <div className="text-lg font-semibold text-zinc-100">{value}</div>
              <div className="text-[10px] tracking-[0.2em] text-zinc-500 uppercase">{label}</div>
            </div>
          ))}
        </div>
        {vitals.ac.note && <p className="mt-2 text-right text-xs text-zinc-500">{vitals.ac.note}</p>}

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2.5 text-zinc-400">
              <LuZap className="size-3.5 text-zinc-500" aria-hidden="true" /> Initiative
            </dt>
            <dd>
            <button
              type="button"
              onClick={() => onRoll("Initiative", "d20", vitals.init, "Initiative roll")}
              className="font-medium text-zinc-100 rounded-md border border-zinc-700/80 bg-zinc-900/70 px-2 py-1 text-sm transition hover:border-amber-300/60 hover:bg-zinc-800"
              aria-label={`Roll d20 ${signed(vitals.init)} for initiative`}
            >
              {signed(vitals.init)}
            </button>
          </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex items-center gap-2.5 text-zinc-400">
              <LuFootprints className="size-3.5 text-zinc-500" aria-hidden="true" /> Speed
            </dt>
            <dd className="font-medium text-zinc-100">{vitals.speed}</dd>
          </div>
        </dl>
      </div>

      {/* Ability scores */}
      <div>
        <Label>Ability Scores</Label>
        <div className="grid grid-cols-3 gap-2">
          {ABILITY_ORDER.map((key) => {
            const { score, mod } = abilities[key];
            return (
              <div
                key={key}
                className="rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-2 py-3 text-center"
              >
                <div className="text-[10px] tracking-[0.25em] text-zinc-500 uppercase">{key}</div>
                <div
                  className={`font-display mt-1 text-2xl leading-none font-medium ${
                    mod >= 4 ? "text-amber-300" : "text-zinc-100"
                  }`}
                >
                  {signed(mod)}
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">{score}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Saving throws */}
      <div>
        <Label>Saving Throws</Label>
        <dl className="space-y-2.5 text-sm">
          {(
            [
              ["Fortitude", saves.fort, LuHeartPulse],
              ["Reflex", saves.ref, LuShield],
              ["Will", saves.will, LuBrain],
            ] as const
          ).map(([name, value, Icon]) => (
            <div key={name} className="flex items-center justify-between">
              <dt className="flex items-center gap-2.5 text-zinc-400">
                <Icon className="size-3.5 text-zinc-500" aria-hidden="true" /> {name}
              </dt>
              <dd>
                <button
                  type="button"
                  onClick={() => onRoll(name, "d20", value, `${name} save`)}
                  className="font-medium text-zinc-100 rounded-md border border-zinc-700/80 bg-zinc-900/70 px-2 py-1 text-sm transition hover:border-amber-300/60 hover:bg-zinc-800"
                  aria-label={`Roll d20 ${signed(value)} for ${name} save`}
                >
                  {signed(value)}
                </button>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <Label>Dice Roller</Label>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
          <div className="flex items-center gap-2 text-zinc-100">
            <FaDiceD20 className="size-5 text-amber-300" aria-hidden="true" />
            <span className="font-semibold">Quick rolls</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-zinc-500">
            Click any attack, save, or skill button to roll. Use these quick rolls to test the dice.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => onRoll("Quick d20", "d20", 0, "Quick roll")}
              className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-amber-300/60 hover:bg-zinc-800"
            >
              d20
            </button>
            <button
              type="button"
              onClick={() => onRoll("Quick d20+5", "d20", 5, "Quick roll")}
              className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-amber-300/60 hover:bg-zinc-800"
            >
              d20+5
            </button>
          </div>
          {lastRoll ? (
            <div className="mt-3 rounded-xl bg-zinc-950/80 p-3 text-xs text-zinc-400">
              <p className="text-zinc-100">Last roll</p>
              <p className="mt-1">
                {lastRoll.label}: {lastRoll.die} {signed(lastRoll.modifier)} =
                <span className="font-semibold text-amber-300"> {lastRoll.total}</span>
              </p>
              <p className="mt-1 text-zinc-500">
                natural {lastRoll.natural}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-zinc-500">No rolls yet — press a button above.</p>
          )}
        </div>
      </div>

      {/* Senses */}
      <div>
        <Label>Senses</Label>
        <ul className="space-y-1.5 text-sm text-zinc-400">
          {character.senses.map((sense) => (
            <li key={sense} className="flex gap-2.5">
              <LuEye className="mt-0.5 size-3.5 shrink-0 text-zinc-600" aria-hidden="true" />
              {sense}
            </li>
          ))}
        </ul>
      </div>

      {/* Android chassis + assassin instincts */}
      <div>
        <Label>Resilience</Label>
        <ul className="space-y-1.5 text-sm text-zinc-400">
          {character.resilience.map((line) => (
            <li key={line} className="flex gap-2.5">
              <LuShieldCheck
                className="mt-0.5 size-3.5 shrink-0 text-zinc-600"
                aria-hidden="true"
              />
              {line}
            </li>
          ))}
        </ul>
      </div>

      <RollHistory rolls={rolls} onClear={onClearRollHistory} />

      {/* the owl keeps watch from the bottom of the rail */}
      <div className="hidden pt-2 lg:block">
        <GeometricOwl className="mx-auto w-44 text-zinc-700" />
        <p className="mt-3 text-center text-[10px] tracking-[0.3em] text-zinc-600 uppercase">
          The owl was here first
        </p>
      </div>
    </aside>
  );
}
