import { LuArrowRight, LuInfo, LuShieldCheck } from "react-icons/lu";
import { CharacterKeyForm } from "./CharacterKeyForm";

export function Landing({
  characterKey,
  alias,
  onCharacterKeySave,
  onCharacterKeyClear,
}: {
  characterKey?: string;
  alias?: string;
  onCharacterKeySave: (key: string, alias?: string) => void;
  onCharacterKeyClear: () => void;
}) {
  return (
    <div className="mx-auto max-w-4xl space-y-10 rounded-3xl border border-zinc-800 bg-zinc-950/60 p-8 text-zinc-300 shadow-xl shadow-black/20">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/5 px-4 py-2 text-sm text-amber-200">
          <LuInfo className="size-4 text-amber-300" aria-hidden="true" />
          onee.cloud is your PathCompanion landing page
        </div>
        <div>
          <h1 className="text-4xl font-display font-semibold tracking-tight text-zinc-100 sm:text-5xl">
            Load your PathCompanion character into onee.cloud
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-zinc-400">
            Paste the character key from your PathCompanion account and the app will render your sheet using the same portfolio-style layout. The default Zink profile lives on <strong>onee.cloud/zink</strong>.
          </p>
          {alias ? (
            <div className="mt-4 rounded-2xl border border-amber-300/20 bg-amber-300/5 px-4 py-3 text-sm text-amber-100">
              Your alias <strong>{alias}</strong> can be used as a permanent link: <code className="text-amber-300">onee.cloud/{alias}</code>
            </div>
          ) : null}
        </div>
      </div>

      <CharacterKeyForm
        keyValue={characterKey}
        aliasValue={alias}
        onSave={onCharacterKeySave}
        onClear={onCharacterKeyClear}
      />

      <div className="grid gap-3 rounded-2xl border border-zinc-800 bg-zinc-900/70 p-5 text-sm text-zinc-400">
        <div className="flex items-start gap-3">
          <LuShieldCheck className="size-5 text-amber-300" aria-hidden="true" />
          <div>
            <p className="font-semibold text-zinc-100">No login required</p>
            <p className="mt-1 text-zinc-400">
              You do not sign in to onee.cloud. Use PathCompanion’s own login flow to copy your character key, then paste it here.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-zinc-500">
          <LuArrowRight className="size-4" />
          <span>Need help? Open PathCompanion, copy your character key, and paste it in the form.</span>
        </div>
      </div>
    </div>
  );
}
