import { gsap } from "gsap";
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type RefObject,
} from "react";
import "./Masonry.css";

export type MasonryItem = {
  id: string;
  img: string;
  url?: string;
  height: number;
  title?: string;
};

type MasonryProps = {
  items: MasonryItem[];
  ease?: string;
  duration?: number;
  stagger?: number;
  animateFrom?: "top" | "bottom" | "left" | "right" | "center" | "random";
  scaleOnHover?: boolean;
  hoverScale?: number;
  blurToFocus?: boolean;
  colorShiftOnHover?: boolean;
};

type GridItem = MasonryItem & { x: number; y: number; w: number; h: number };

const useMedia = (queries: string[], values: number[], defaultValue: number) => {
  const get = () => values[queries.findIndex((q) => matchMedia(q).matches)] ?? defaultValue;

  const [value, setValue] = useState(get);

  useEffect(() => {
    const handler = () => setValue(get);
    queries.forEach((q) => matchMedia(q).addEventListener("change", handler));
    return () => queries.forEach((q) => matchMedia(q).removeEventListener("change", handler));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queries]);

  return value;
};

const useMeasure = (): [RefObject<HTMLDivElement>, { width: number; height: number }] => {
  const ref = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const update = () => {
      setSize({ width: node.offsetWidth, height: node.offsetHeight });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
};

const preloadImages = async (urls: string[]) => {
  await Promise.all(
    urls.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.src = src;
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
};

export default function Masonry({
  items,
  ease = "power3.out",
  duration = 0.5,
  stagger = 0.04,
  animateFrom = "center",
  scaleOnHover = true,
  hoverScale = 0.97,
  blurToFocus = false,
  colorShiftOnHover = false,
}: MasonryProps) {
  const columns = useMedia(
    ["(min-width:1280px)", "(min-width:900px)", "(min-width:640px)"],
    [4, 3, 2],
    2
  );

  const [containerRef, { width }] = useMeasure();
  const [imagesReady, setImagesReady] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    hasAnimated.current = false;
    setImagesReady(false);
    preloadImages(items.map((i) => i.img)).then(() => setImagesReady(true));
  }, [items]);

  const grid = useMemo<GridItem[]>(() => {
    if (!width) return [];

    const gap = 12;
    const columnWidth = (width - gap * (columns - 1)) / columns;
    const colHeights = new Array(columns).fill(0);

    return items.map((child) => {
      const col = colHeights.indexOf(Math.min(...colHeights));
      const x = col * (columnWidth + gap);
      const h = child.height;
      const y = colHeights[col];

      colHeights[col] += h + gap;

      return { ...child, x, y, w: columnWidth, h };
    });
  }, [columns, items, width]);

  const containerHeight = useMemo(() => {
    if (!grid.length) return 420;
    return Math.max(...grid.map((item) => item.y + item.h)) + 8;
  }, [grid]);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !imagesReady || !grid.length || !width) return;

    const ctx = gsap.context(() => {
      grid.forEach((item, index) => {
        const el = container.querySelector<HTMLElement>(`[data-key="${item.id}"]`);
        if (!el) return;

        const target = {
          x: item.x,
          y: item.y,
          width: item.w,
          height: item.h,
          opacity: 1,
          filter: "blur(0px)",
        };

        if (!hasAnimated.current) {
          gsap.fromTo(
            el,
            {
              opacity: 0,
              x: item.x,
              y: item.y + (animateFrom === "bottom" ? 80 : animateFrom === "top" ? -80 : 24),
              width: item.w,
              height: item.h,
              ...(blurToFocus && { filter: "blur(8px)" }),
            },
            {
              ...target,
              duration: 0.55,
              ease: "power2.out",
              delay: index * stagger,
            }
          );
        } else {
          gsap.to(el, {
            ...target,
            duration,
            ease,
            overwrite: "auto",
          });
        }
      });
    }, container);

    hasAnimated.current = true;
    return () => ctx.revert();
  }, [
    grid,
    imagesReady,
    width,
    stagger,
    animateFrom,
    blurToFocus,
    duration,
    ease,
    containerRef,
  ]);

  if (!width || !imagesReady) {
    return (
      <div ref={containerRef} className="list list--loading" style={{ minHeight: 420 }}>
        <div className="masonry-loader" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className="list" style={{ height: containerHeight }}>
      {grid.map((item) => (
        <div
          key={item.id}
          data-key={item.id}
          className={`item-wrapper${item.url ? " item-wrapper--link" : ""}`}
          style={{ width: item.w, height: item.h, opacity: 0 }}
          onClick={() => {
            if (item.url) window.open(item.url, "_blank", "noopener");
          }}
          onMouseEnter={() => {
            if (!scaleOnHover) return;
            const el = containerRef.current?.querySelector(`[data-key="${item.id}"]`);
            if (el) gsap.to(el, { scale: hoverScale, duration: 0.25, ease: "power2.out" });
          }}
          onMouseLeave={() => {
            if (!scaleOnHover) return;
            const el = containerRef.current?.querySelector(`[data-key="${item.id}"]`);
            if (el) gsap.to(el, { scale: 1, duration: 0.25, ease: "power2.out" });
          }}
          aria-label={item.title}
        >
          <div className="item-img" style={{ backgroundImage: `url(${item.img})` }}>
            {item.title && <span className="item-title">{item.title}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}
