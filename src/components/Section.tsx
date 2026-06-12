import type { IconType } from "react-icons";
import type { ReactNode } from "react";

interface SectionProps {
  icon: IconType;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
}

/** Resume-style section: icon, small-caps title, hairline rule, optional meta. */
export function Section({ icon: Icon, title, meta, children }: SectionProps) {
  return (
    <section className="pt-12 first:pt-0">
      <div className="mb-6 flex items-center gap-3">
        <Icon className="size-4 shrink-0 text-amber-300/90" aria-hidden="true" />
        <h2 className="text-[13px] font-semibold tracking-[0.25em] text-zinc-100 uppercase">
          {title}
        </h2>
        <div className="h-px flex-1 bg-zinc-800" />
        {meta && <div className="text-xs text-zinc-500">{meta}</div>}
      </div>
      {children}
    </section>
  );
}

/** Tiny small-caps label used inside sidebar cards. */
export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="mb-3 text-[10px] font-semibold tracking-[0.3em] text-zinc-500 uppercase">
      {children}
    </div>
  );
}
