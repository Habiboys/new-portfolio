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
    if (isMobile) {
      return Math.max(96, (count - 1) * 40 + vh * 0.045);
    }
    return Math.max(120, (count - 1) * 56 + vh * 0.06);
  }, [experiences.length, isMobile]);

  return (
    <ScrollStack
      useWindowScroll={true}
      smoothScroll={!isMobile}
      performanceMode={isMobile}
      innerClassName="scroll-stack-inner--compact"
      endSpacerHeight={endSpacerHeight}
      itemDistance={isMobile ? 20 : 28}
      itemScale={isMobile ? 0.012 : 0.02}
      itemStackDistance={isMobile ? 10 : 14}
      stackPosition={isMobile ? "12%" : "16%"}
      scaleEndPosition={isMobile ? "6%" : "8%"}
      baseScale={isMobile ? 0.94 : 0.9}
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
