import { LuTrash2 } from "react-icons/lu";
import type { RollEntry } from "../types";
import { signed } from "../lib/format";

export function RollHistory({
  rolls,
  onClear,
}: {
  rolls: RollEntry[];
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="text-[10px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
          Roll History
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-md px-2.5 py-1 text-xs font-semibold text-zinc-400 transition hover:text-amber-300"
        >
          <LuTrash2 className="size-4" aria-hidden="true" />
          Clear
        </button>
      </div>

      {rolls.length === 0 ? (
        <p className="text-sm leading-6 text-zinc-500">
          Roll an attack or skill to see it appear here.
        </p>
      ) : (
        <ul className="space-y-2">
          {rolls.map((roll) => (
            <li
              key={roll.id}
              className="rounded-xl border border-zinc-800 bg-zinc-900/80 px-3 py-2"
            >
              <div className="flex items-center justify-between gap-2 text-sm text-zinc-300">
                <span className="font-medium text-zinc-100">{roll.label}</span>
                <span className="text-[11px] text-zinc-500">{roll.time}</span>
              </div>
              <div className="mt-1 flex items-center justify-between gap-2 text-xs text-zinc-400">
                <span>
                  {roll.die} {signed(roll.modifier)}
                  {roll.natural === 20 ? " · Nat 20" : roll.natural === 1 ? " · Nat 1" : ""}
                </span>
                <span className="font-semibold text-zinc-100">{roll.total}</span>
              </div>
              {roll.note && <div className="mt-1 text-[11px] text-amber-300">{roll.note}</div>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
