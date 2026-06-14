import { useRef, useState } from "react";
import { LuCamera, LuCompass, LuFingerprint, LuScale, LuSearch } from "react-icons/lu";
import type { Character } from "../types";
import { uploadAvatar } from "../lib/avatar";

export function Hero({
  character,
  canEdit = false,
  alias,
  avatarUrl,
  onAvatarChange,
}: {
  character: Character;
  canEdit?: boolean;
  alias?: string;
  avatarUrl?: string;
  onAvatarChange?: (url: string) => void;
}) {
  const { identity } = character;
  const totalLevel = identity.classes.reduce((sum, c) => sum + c.level, 0);
  const classLine = identity.classes
    .map((c) => `${c.name}${c.detail ? ` ${c.detail}` : ""} ${c.level}`)
    .join(" / ");

  const [avatarError, setAvatarError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !alias) return;
    setUploading(true);
    try {
      const url = await uploadAvatar(alias, file);
      setAvatarError(false);
      onAvatarChange?.(url);
    } catch {
      // silently ignore upload errors
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const showAvatar = avatarUrl && !avatarError;

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

          <p className="font-display mt-3 text-xl text-zinc-400 italic">"{identity.tagline}"</p>

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

        <div className="flex flex-col items-end gap-4 shrink-0">
          {/* Avatar portrait */}
          <div className="relative group">
            {showAvatar ? (
              <img
                src={avatarUrl}
                alt={`${identity.name} portrait`}
                onError={() => setAvatarError(true)}
                className="size-32 rounded-2xl object-cover border border-zinc-700 shadow-lg shadow-black/40"
              />
            ) : (
              <div className="size-32 rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/60 flex items-center justify-center">
                <LuCamera className="size-8 text-zinc-600" aria-hidden="true" />
              </div>
            )}

            {canEdit && (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                aria-label="Upload character portrait"
                className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity disabled:cursor-wait"
              >
                <LuCamera className="size-6 text-white" aria-hidden="true" />
              </button>
            )}

            {canEdit && (
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileChange}
              />
            )}
          </div>

          {/* Level display */}
          <div className="w-full max-w-xs">
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
      </div>

      <div className="mt-10 h-px bg-gradient-to-r from-amber-300/60 via-zinc-700 to-transparent" />
    </header>
  );
}
