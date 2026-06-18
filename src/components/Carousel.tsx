import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { ExternalLink } from "lucide-react";
import type { ProjectItem } from "@/types/portfolio";
import "./Carousel.css";

const DRAG_BUFFER = 0;
const VELOCITY_THRESHOLD = 500;
const GAP = 16;
const SPRING_OPTIONS = { type: "spring", stiffness: 300, damping: 30 } as const;

type CarouselItemData = {
  project: ProjectItem;
};

function CarouselItem({
  item,
  index,
  itemWidth,
  trackItemOffset,
  x,
  transition,
  onSelectProject,
}: {
  item: CarouselItemData;
  index: number;
  itemWidth: number;
  trackItemOffset: number;
  x: any;
  transition: any;
  onSelectProject?: (project: ProjectItem) => void;
}) {
  const range = [
    -(index + 1) * trackItemOffset,
    -index * trackItemOffset,
    -(index - 1) * trackItemOffset,
  ];
  const outputRange = [90, 0, -90];
  const rotateY = useTransform(x, range, outputRange, { clamp: false });

  const p = item.project;
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      className="carousel-item"
      style={{
        width: itemWidth,
        height: "100%",
        rotateY,
      }}
      transition={transition}
      onClick={() => onSelectProject?.(p)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Background image */}
      <div className="carousel-item-bg">
        <img
          src={p.previewImage}
          alt={p.title}
          draggable={false}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/30 to-transparent" />
      </div>

      {/* Content overlay — slide up on hover */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 z-10 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={hovered ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Tech badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {p.tech.slice(0, 4).map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-900/10 text-gray-700 text-xs rounded-full"
              >
                {t}
              </span>
            ))}
            {p.tech.length > 4 && (
              <span className="px-3 py-1 bg-gray-900/5 text-gray-400 text-xs rounded-full">
                +{p.tech.length - 4}
              </span>
            )}
          </div>

          <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-1">
            {p.title}
          </h2>

          <p className="text-gray-500/70 text-xs md:text-sm font-medium max-w-xl leading-relaxed line-clamp-2">
            {p.description}
          </p>

          <div className="mt-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProject?.(p);
              }}
              className="inline-flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-full font-medium text-xs hover:bg-gray-800 hover:scale-105 active:scale-95 shadow-lg transition-all duration-200 pointer-events-auto"
            >
              View Details
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

type Props = {
  items: ProjectItem[];
  baseWidth?: number;
  autoplay?: boolean;
  autoplayDelay?: number;
  pauseOnHover?: boolean;
  loop?: boolean;
  onSelectProject?: (project: ProjectItem) => void;
};

export default function Carousel({
  items,
  baseWidth = 500,
  autoplay = true,
  autoplayDelay = 2500,
  pauseOnHover = true,
  loop = true,
  onSelectProject,
}: Props) {
  const containerPadding = 16;
  const itemWidth = baseWidth - containerPadding * 2;
  const trackItemOffset = itemWidth + GAP;

  const wrapped: CarouselItemData[] = useMemo(
    () => items.map((project) => ({ project })),
    [items]
  );

  const itemsForRender = useMemo(() => {
    if (!loop) return wrapped;
    if (wrapped.length === 0) return [];
    return [wrapped[wrapped.length - 1], ...wrapped, wrapped[0]];
  }, [wrapped, loop]);

  const [position, setPosition] = useState(loop ? 1 : 0);
  const x = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isJumping, setIsJumping] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pauseOnHover && containerRef.current) {
      const container = containerRef.current;
      const handleMouseEnter = () => setIsHovered(true);
      const handleMouseLeave = () => setIsHovered(false);
      container.addEventListener("mouseenter", handleMouseEnter);
      container.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        container.removeEventListener("mouseenter", handleMouseEnter);
        container.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay || itemsForRender.length <= 1) return;
    if (pauseOnHover && isHovered) return;
    const timer = setInterval(() => {
      setPosition((prev) => Math.min(prev + 1, itemsForRender.length - 1));
    }, autoplayDelay);
    return () => clearInterval(timer);
  }, [autoplay, autoplayDelay, isHovered, pauseOnHover, itemsForRender.length]);

  useEffect(() => {
    const startingPosition = loop ? 1 : 0;
    setPosition(startingPosition);
    x.set(-startingPosition * trackItemOffset);
  }, [items.length, loop, trackItemOffset, x]);

  useEffect(() => {
    if (!loop && position > itemsForRender.length - 1) {
      setPosition(Math.max(0, itemsForRender.length - 1));
    }
  }, [itemsForRender.length, loop, position]);

  const effectiveTransition = isJumping ? { duration: 0 } : SPRING_OPTIONS;

  const handleAnimationStart = () => setIsAnimating(true);

  const handleAnimationComplete = () => {
    if (!loop || itemsForRender.length <= 1) {
      setIsAnimating(false);
      return;
    }
    const lastCloneIndex = itemsForRender.length - 1;

    if (position === lastCloneIndex) {
      setIsJumping(true);
      const target = 1;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    if (position === 0) {
      setIsJumping(true);
      const target = wrapped.length;
      setPosition(target);
      x.set(-target * trackItemOffset);
      requestAnimationFrame(() => {
        setIsJumping(false);
        setIsAnimating(false);
      });
      return;
    }

    setIsAnimating(false);
  };

  const handleDragEnd = (_: any, info: { offset: { x: number }; velocity: { x: number } }) => {
    const { offset, velocity } = info;
    const direction =
      offset.x < -DRAG_BUFFER || velocity.x < -VELOCITY_THRESHOLD
        ? 1
        : offset.x > DRAG_BUFFER || velocity.x > VELOCITY_THRESHOLD
          ? -1
          : 0;
    if (direction === 0) return;
    setPosition((prev) => {
      const next = prev + direction;
      const max = itemsForRender.length - 1;
      return Math.max(0, Math.min(next, max));
    });
  };

  const dragProps = loop
    ? {}
    : {
        dragConstraints: {
          left: -trackItemOffset * Math.max(itemsForRender.length - 1, 0),
          right: 0,
        },
      };

  const activeIndex =
    items.length === 0
      ? 0
      : loop
        ? ((position - 1 + items.length) % items.length)
        : Math.min(position, items.length - 1);

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="carousel-container"
      style={{
        width: `${baseWidth}px`,
        height: `${baseWidth * 0.55}px`,
        minHeight: 480,
      }}
    >
      <motion.div
        className="carousel-track"
        drag={isAnimating ? false : "x"}
        {...dragProps}
        style={{
          width: itemWidth,
          gap: `${GAP}px`,
          perspective: 1200,
          perspectiveOrigin: `${position * trackItemOffset + itemWidth / 2}px 50%`,
          x,
        }}
        onDragEnd={handleDragEnd}
        animate={{ x: -(position * trackItemOffset) }}
        transition={effectiveTransition}
        onAnimationStart={handleAnimationStart}
        onAnimationComplete={handleAnimationComplete}
      >
        {itemsForRender.map((item, index) => (
          <CarouselItem
            key={`${item.project.slug ?? item.project.title}-${index}`}
            item={item}
            index={index}
            itemWidth={itemWidth}
            trackItemOffset={trackItemOffset}
            x={x}
            transition={effectiveTransition}
            onSelectProject={onSelectProject}
          />
        ))}
      </motion.div>

      {/* Dot indicators */}
      <div className="carousel-indicators-container">
        <div className="carousel-indicators">
          {items.map((_, index) => (
            <motion.button
              type="button"
              key={index}
              className={`carousel-indicator ${activeIndex === index ? "active" : "inactive"}`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeIndex === index}
              animate={{ scale: activeIndex === index ? 1.2 : 1 }}
              onClick={() => setPosition(loop ? index + 1 : index)}
              transition={{ duration: 0.15 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
