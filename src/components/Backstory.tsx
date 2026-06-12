import { LuScrollText } from "react-icons/lu";
import { closingQuote, dossier } from "../data/backstory";
import { Section } from "./Section";

export function Backstory() {
  return (
    <Section icon={LuScrollText} title="Dossier">
      <div className="max-w-prose space-y-5 leading-relaxed text-zinc-400">
        {dossier.map((section, sectionIndex) => (
          <div key={section.heading ?? sectionIndex} className="space-y-5">
            {section.heading && (
              <h3 className="pt-3 text-[11px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
                {section.heading}
              </h3>
            )}
            {section.body.map((paragraph, paragraphIndex) => (
              <p
                key={paragraph.slice(0, 24)}
                className={
                  sectionIndex === 0 && paragraphIndex === 0
                    ? "first-letter:font-display first-letter:float-left first-letter:mt-1 first-letter:mr-3 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-amber-300"
                    : undefined
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
        ))}
        <blockquote className="font-display border-l-2 border-amber-300/50 py-1 pl-5 text-xl text-zinc-200 italic">
          “{closingQuote}”
        </blockquote>
      </div>
    </Section>
  );
}
