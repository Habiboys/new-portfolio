import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { SplitText } from "gsap/SplitText";
import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import "./ScrambledText.css";

gsap.registerPlugin(SplitText, ScrambleTextPlugin);

type ScrambledTextProps = {
  radius?: number;
  duration?: number;
  speed?: number;
  scrambleChars?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = ".:",
  className = "",
  style = {},
  children,
}: ScrambledTextProps) => {
  const rootRef = useRef<HTMLDivElement>(null);
  const charsRef = useRef<Element[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const paragraph = root?.querySelector("p");
    if (!root || !paragraph) return;

    const split = SplitText.create(paragraph, {
      type: "chars",
      charsClass: "char",
    });
    charsRef.current = split.chars;

    charsRef.current.forEach((char) => {
      gsap.set(char, {
        display: "inline-block",
        attr: { "data-content": char.innerHTML },
      });
    });

    const handleMove = (e: PointerEvent) => {
      charsRef.current.forEach((char) => {
        const el = char as HTMLElement;
        const { left, top, width, height } = el.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          gsap.to(char, {
            overwrite: true,
            duration: duration * (1 - dist / radius),
            scrambleText: {
              text: el.dataset.content || "",
              chars: scrambleChars,
              speed,
            },
            ease: "none",
          });
        }
      });
    };

    root.addEventListener("pointermove", handleMove);

    return () => {
      root.removeEventListener("pointermove", handleMove);
      split.revert();
    };
  }, [radius, duration, speed, scrambleChars, children]);

  return (
    <div ref={rootRef} className={`text-block ${className}`.trim()} style={style}>
      <p>{children}</p>
    </div>
  );
};

export default ScrambledText;
