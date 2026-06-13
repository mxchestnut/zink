import { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { LuPencil, LuSave, LuX, LuTrash2 } from "react-icons/lu";
import { closingQuote as defaultQuote, dossier } from "../data/backstory";
import { Section } from "./Section";
import type { EditableBio } from "../lib/editableBio";

const defaultDossierHtml = dossier
  .map((section) => {
    const heading = section.heading
      ? `<h3 class=\"mb-3 text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase\">${section.heading}</h3>`
      : "";
    const body = section.body
      .map((paragraph) => `<p class=\"mb-5 leading-relaxed text-zinc-400\">${paragraph}</p>`)
      .join("");
    return `<div class=\"mb-10\">${heading}${body}</div>`;
  })
  .join("");

export function Backstory({
  bio,
  onBioChange,
  onReset,
  canEdit = false,
  bioError,
}: {
  bio: EditableBio;
  onBioChange: (bio: EditableBio) => void;
  onReset: () => void;
  canEdit?: boolean;
  bioError?: string | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileText, setProfileText] = useState(bio.profile);
  const [quoteText, setQuoteText] = useState(bio.closingQuote);

  const editor = useEditor({
    extensions: [StarterKit],
    content: bio.dossierHtml || defaultDossierHtml,
    editable: isEditing && canEdit,
    editorProps: {
      attributes: {
        class:
          "prose prose-invert prose-sm max-w-none focus:outline-none prose-p:text-zinc-400 prose-h3:text-zinc-500 prose-h3:uppercase prose-h3:tracking-[0.3em] prose-blockquote:border-l-2 prose-blockquote:border-amber-300/50 prose-blockquote:px-5 prose-blockquote:text-xl prose-blockquote:text-zinc-200 prose-blockquote:italic",
      },
    },
  });

  useEffect(() => {
    setProfileText(bio.profile);
    setQuoteText(bio.closingQuote);
    editor?.commands.setContent(bio.dossierHtml || defaultDossierHtml);
  }, [bio, editor]);

  const saveBio = () => {
    if (!editor) return;
    onBioChange({
      profile: profileText,
      dossierHtml: editor.getHTML(),
      closingQuote: quoteText,
    });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setProfileText(bio.profile);
    setQuoteText(bio.closingQuote);
    editor?.commands.setContent(bio.dossierHtml || defaultDossierHtml);
    setIsEditing(false);
  };

  const resetDefaults = () => {
    onReset();
    setIsEditing(false);
  };

  return (
    <Section icon={LuPencil} title="Dossier">
      {canEdit && (
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">Edits save to your account and appear for everyone who visits this page.</p>
        <div className="flex flex-wrap gap-2">
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={saveBio}
                className="rounded-md bg-amber-300/10 px-3 py-2 text-xs font-semibold text-amber-200 transition hover:bg-amber-300/20"
              >
                <LuSave className="inline size-4 mr-1" aria-hidden="true" /> Save
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-zinc-800"
              >
                <LuX className="inline size-4 mr-1" aria-hidden="true" /> Cancel
              </button>
              <button
                type="button"
                onClick={resetDefaults}
                className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-200 transition hover:bg-red-500/20"
              >
                <LuTrash2 className="inline size-4 mr-1" aria-hidden="true" /> Reset
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-zinc-700/80 bg-zinc-900/70 px-3 py-2 text-xs font-semibold text-zinc-100 transition hover:border-amber-300 hover:bg-zinc-800"
            >
              <LuPencil className="inline size-4 mr-1" aria-hidden="true" /> Edit bio
            </button>
          )}
        </div>
        {bioError && (
          <p className="w-full text-xs text-red-300">
            Couldn’t sync this bio with the database: {bioError}
          </p>
        )}
      </div>
      )}

      {isEditing && canEdit ? (
        <div className="space-y-6">
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">Profile summary</label>
            <textarea
              value={profileText}
              onChange={(event) => setProfileText(event.target.value)}
              className="w-full rounded-2xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
              rows={3}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">Dossier content</label>
            <div className="rounded-2xl border border-zinc-700/80 bg-zinc-950/60 p-4">
              {editor ? <EditorContent editor={editor} /> : null}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-zinc-300">Closing quote</label>
            <textarea
              value={quoteText}
              onChange={(event) => setQuoteText(event.target.value)}
              className="w-full rounded-2xl border border-zinc-700/80 bg-zinc-950/60 px-4 py-3 text-sm text-zinc-100 outline-none transition focus:border-amber-300/70 focus:ring-2 focus:ring-amber-300/10"
              rows={2}
            />
          </div>
        </div>
      ) : (
        <div className="prose prose-invert prose-sm max-w-prose space-y-5 text-zinc-400">
          <div dangerouslySetInnerHTML={{ __html: bio.dossierHtml || defaultDossierHtml }} />
          <blockquote className="font-display border-l-2 border-amber-300/50 py-1 pl-5 text-xl text-zinc-200 italic">
            “{bio.closingQuote || defaultQuote}”
          </blockquote>
        </div>
      )}
    </Section>
  );
}
