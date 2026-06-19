import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { ExperienceCard } from "@/components/ExperienceCard";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { ExperienceItem } from "@/types/portfolio";
import { useMemo } from "react";

type Props = {
  experiences: ExperienceItem[];
};

export default function ExperienceStack({ experiences }: Props) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const endSpacerHeight = useMemo(() => {
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const count = Math.max(experiences.length, 1);
    return Math.max(120, (count - 1) * 56 + vh * 0.06);
  }, [experiences.length]);

  if (isMobile) {
    return (
      <div className="space-y-4 pb-2">
        {experiences.map((exp, index) => (
          <ExperienceCard key={`${exp.title}-${index}`} exp={exp} index={index} />
        ))}
      </div>
    );
  }

  return (
    <ScrollStack
      useWindowScroll={true}
      smoothScroll={true}
      innerClassName="scroll-stack-inner--compact"
      endSpacerHeight={endSpacerHeight}
      itemDistance={28}
      itemScale={0.02}
      itemStackDistance={14}
      stackPosition="16%"
      scaleEndPosition="8%"
      baseScale={0.9}
      rotationAmount={0}
      blurAmount={0}
    >
      {experiences.map((exp, index) => (
        <ScrollStackItem key={`${exp.title}-${index}`} itemClassName="scroll-stack-card--experience">
          <ExperienceCard
            exp={exp}
            index={index}
            className="border-0 shadow-none rounded-none bg-transparent hover:shadow-none"
          />
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
