import { LuScrollText } from "react-icons/lu";
import { backstory, pullQuote } from "../data/backstory";
import { Section } from "./Section";

export function Backstory() {
  const [first, second, ...rest] = backstory;

  return (
    <Section icon={LuScrollText} title="Backstory">
      <div className="max-w-prose space-y-5 leading-relaxed text-zinc-400">
        <p className="first-letter:font-display first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:leading-[0.8] first-letter:text-amber-300">
          {first}
        </p>
        <p>{second}</p>
        <blockquote className="font-display border-l-2 border-amber-300/50 py-1 pl-5 text-xl text-zinc-200 italic">
          {pullQuote}
        </blockquote>
        {rest.map((paragraph) => (
          <p key={paragraph.slice(0, 24)}>{paragraph}</p>
        ))}
      </div>
    </Section>
  );
}
