import { ExperienceCard } from "@/components/ExperienceCard";
import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
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
    if (isMobile) {
      return Math.max(140, (count - 1) * 52 + vh * 0.08);
    }
    return Math.max(120, (count - 1) * 56 + vh * 0.06);
  }, [experiences.length, isMobile]);

  return (
    <ScrollStack
      useWindowScroll
      smoothScroll={!isMobile}
      performanceMode={isMobile}
      innerClassName="scroll-stack-inner--compact"
      endSpacerHeight={endSpacerHeight}
      itemDistance={isMobile ? 24 : 28}
      itemScale={isMobile ? 0.015 : 0.02}
      itemStackDistance={isMobile ? 12 : 14}
      stackPosition={isMobile ? "14%" : "16%"}
      scaleEndPosition="8%"
      baseScale={isMobile ? 0.93 : 0.9}
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
