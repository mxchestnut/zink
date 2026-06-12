import { useEffect, useState } from "react";
import { LuKey } from "react-icons/lu";
import { Label } from "./Section";

export function CharacterKeyForm({
  keyValue,
  aliasValue,
  onSave,
  onClear,
}: {
  keyValue?: string;
  aliasValue?: string;
  onSave: (key: string, alias?: string) => void;
  onClear: () => void;
}) {
  const [draftKey, setDraftKey] = useState(keyValue ?? "");
  const [draftAlias, setDraftAlias] = useState(aliasValue ?? "");

  useEffect(() => {
    setDraftKey(keyValue ?? "");
    setDraftAlias(aliasValue ?? "");
  }, [keyValue, aliasValue]);

  const hasKey = draftKey.trim().length > 0;

  return (
    <div>
      <Label>PathCompanion key</Label>
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
        <div className="flex items-center gap-2 text-zinc-100">
          <LuKey className="size-5 text-amber-300" aria-hidden="true" />
          <span className="font-semibold">Load your character</span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Log into onee.cloud and paste the PathCompanion character key here. The page will keep Zink’s portfolio bio and styling while showing your own character values.
        </p>

        <textarea
          className="mt-3 min-h-[5rem] w-full resize-none rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
          value={draftKey}
          placeholder="Paste character key from onee.cloud"
          onChange={(event) => setDraftKey(event.target.value)}
          rows={4}
        />
        <input
          className="mt-3 w-full rounded-xl border border-zinc-700/80 bg-zinc-950/60 px-3 py-2 text-xs text-zinc-100 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
          value={draftAlias}
          placeholder="Optional alias for this character (example: zink)"
          onChange={(event) => setDraftAlias(event.target.value)}
        />

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => onSave(draftKey.trim(), draftAlias.trim())}
            disabled={!hasKey}
            className="rounded-md border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:border-amber-300 hover:bg-amber-300/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Load character
          </button>
          <button
            type="button"
            onClick={() => {
              setDraftKey("");
              onClear();
            }}
            className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-zinc-800"
          >
            Clear key
          </button>
          {keyValue && (
            <span className="text-xs text-zinc-500">
              Saved key active in this browser{draftAlias ? ` for /${draftAlias}` : ""}.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
