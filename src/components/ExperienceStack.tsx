import ScrollStack, { ScrollStackItem } from "@/components/ScrollStack";
import { ExperienceCard } from "@/components/ExperienceCard";
import type { ExperienceItem } from "@/types/portfolio";

type Props = {
  experiences: ExperienceItem[];
};

export default function ExperienceStack({ experiences }: Props) {
  return (
    <ScrollStack
      useWindowScroll={true}
      innerClassName="scroll-stack-inner--compact"
      itemDistance={40}
      itemScale={0.03}
      itemStackDistance={22}
      stackPosition="18%"
      scaleEndPosition="8%"
      baseScale={0.88}
      rotationAmount={0}
      blurAmount={0}
    >
      {experiences.slice(0, 3).map((exp, index) => (
        <ScrollStackItem key={index} itemClassName="scroll-stack-card--experience">
          <ExperienceCard exp={exp} index={index} className="border-0 shadow-none rounded-none bg-transparent hover:shadow-none" />
        </ScrollStackItem>
      ))}
    </ScrollStack>
  );
}
