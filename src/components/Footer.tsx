import { LuRefreshCw } from "react-icons/lu";
import {
  CHARACTER_KEY,
  decodeCharacterKey,
  normalizeCharacterKey,
} from "../lib/pathcompanion";
import type { CharacterSource } from "../types";

const SOURCE_LABEL: Record<CharacterSource, string> = {
  snapshot: "local snapshot",
  imported: "synced via npm run sync",
  live: "live from PathCompanion",
};

export function Footer({
  source,
  characterKey,
}: {
  source: CharacterSource;
  characterKey?: string;
}) {
  const keyToShow = normalizeCharacterKey(characterKey) ?? CHARACTER_KEY;
  const { account, character } = decodeCharacterKey(keyToShow);

  return (
    <footer className="mt-20 border-t border-zinc-800 py-8 text-xs text-zinc-600">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-center gap-2">
          <LuRefreshCw
            className={`size-3 ${source === "live" ? "text-amber-300/80" : ""}`}
            aria-hidden="true"
          />
          Sheet data: {SOURCE_LABEL[source]} · PathCompanion key …{account.slice(-4)}/{character}
        </p>
        <p>
          Zink · Pathfinder 1e character portfolio · stats live at{" "}
          <a
            href="https://pathcompanion.com/"
            target="_blank"
            rel="noreferrer"
            className="text-zinc-500 underline decoration-zinc-700 underline-offset-2 hover:text-amber-300/90"
          >
            pathcompanion.com
          </a>
        </p>
      </div>
    </footer>
  );
}
