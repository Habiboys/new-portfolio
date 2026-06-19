"use client";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

const COLORS = [
  "#e6f2ff",
  "#fff1f5",
  "#e6ffe6",
  "#fffde6",
  "#ffe6e6",
  "#f5e6ff",
  "#e6e9ff",
  "#efe6ff",
];

export const BoxesCore = ({ className, ...rest }: { className?: string }) => {
  const cells = useMemo(() => {
    const rows = 24;
    const cols = 16;
    return Array.from({ length: rows * cols }, (_, i) => ({
      row: Math.floor(i / cols),
      col: i % cols,
      color: COLORS[i % COLORS.length],
    }));
  }, []);

  return (
    <div
      style={{
        transform: `translate(-40%,-60%) skewX(-48deg) skewY(14deg) scale(0.675) rotate(0deg) translateZ(0)`,
      }}
      className={cn(
        "absolute -top-1/4 left-1/4 z-0 flex h-full w-full -translate-x-1/2 -translate-y-1/2 p-4 pointer-events-none",
        className,
      )}
      {...rest}
    >
      <div className="grid grid-flow-col auto-cols-[4rem] auto-rows-[2rem]">
        {cells.map(({ row, col, color }) => (
          <div
            key={`${row}-${col}`}
            className="relative h-8 w-16 border border-gray-100/80 transition-colors duration-300 hover:bg-[var(--cell-hover)]"
            style={{ ["--cell-hover" as string]: color }}
          />
        ))}
      </div>
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);
