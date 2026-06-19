import type { ExperienceItem } from "@/types/portfolio";
import { cn } from "@/lib/utils";

type Props = {
  exp: ExperienceItem;
  index: number;
  className?: string;
};

export function ExperienceCard({ exp, index, className }: Props) {
  const num = String(index + 1).padStart(2, "0");

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-gray-200/90 bg-white",
        "shadow-[0_1px_0_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.05)]",
        "transition-shadow duration-300 hover:shadow-[0_1px_0_rgba(0,0,0,0.06),0_16px_40px_rgba(0,0,0,0.08)]",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(209 213 219) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gray-900/25 to-transparent"
      />
      <div
        aria-hidden
        className="absolute left-0 top-5 bottom-5 w-[3px] rounded-full bg-gradient-to-b from-gray-900 via-gray-500 to-gray-200"
      />

      <span
        aria-hidden
        className="absolute right-4 sm:right-6 bottom-0 text-[5rem] sm:text-[6.5rem] md:text-[7rem] font-bold leading-none text-gray-100 select-none tabular-nums z-0 pointer-events-none"
      >
        {num}
      </span>

      <div className="relative z-10 pl-7 sm:pl-9 pr-6 sm:pr-8 py-6 sm:py-8 space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4 gap-y-2">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] uppercase tracking-[0.18em] text-gray-400 mb-2">
              Role
            </p>
            <h3 className="text-xl sm:text-2xl font-medium text-gray-900 group-hover:text-gray-700 transition-colors">
              {exp.title}
            </h3>
            <p className="mt-1.5 text-base sm:text-lg text-gray-600 font-medium">
              {exp.organization}
            </p>
          </div>
          <span className="relative z-10 shrink-0 rounded-full border border-gray-200 bg-white/90 px-3.5 py-1.5 text-sm text-gray-600 backdrop-blur-sm">
            {exp.period}
          </span>
        </div>

        <p className="text-base text-gray-600 leading-relaxed pr-16 sm:pr-24 pb-2">
          {exp.description}
        </p>
      </div>
    </article>
  );
}
