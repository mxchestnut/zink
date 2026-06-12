import { LuArrowUpRight, LuBookOpen } from "react-icons/lu";
import { useJournal } from "../lib/ghost";
import { Section } from "./Section";

export function Journal() {
  const { entries, source } = useJournal();

  return (
    <Section
      icon={LuBookOpen}
      title="Field Journal"
      meta={source === "ghost" ? "via Ghost" : "local entries"}
    >
      <div className="grid gap-4 md:grid-cols-3">
        {entries.map((entry) => {
          const card = (
            <article
              key={entry.title}
              className="flex h-full flex-col rounded-lg border border-zinc-800/80 bg-zinc-900/40 p-5 transition-colors group-hover:border-amber-300/30"
            >
              <p className="text-[10px] font-semibold tracking-[0.25em] text-amber-300/80 uppercase">
                {entry.date}
              </p>
              <h3 className="font-display mt-2 text-xl leading-snug text-zinc-100">
                {entry.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{entry.excerpt}</p>
              {entry.url && (
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-300/90">
                  Read entry <LuArrowUpRight className="size-3" aria-hidden="true" />
                </span>
              )}
            </article>
          );

          return entry.url ? (
            <a
              key={entry.title}
              href={entry.url}
              target="_blank"
              rel="noreferrer"
              className="group"
            >
              {card}
            </a>
          ) : (
            <div key={entry.title} className="group">
              {card}
            </div>
          );
        })}
      </div>
      {source === "local" && (
        <p className="mt-4 text-xs text-zinc-600">
          Wire a Ghost blog in <code className="text-zinc-500">.env</code> and entries publish here
          automatically — see the README.
        </p>
      )}
    </Section>
  );
}
