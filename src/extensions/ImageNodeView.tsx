import React from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

export default function ImageNodeView({
  node,
  updateAttributes,
  selected,
}: NodeViewProps) {
  const imgRef = React.useRef<HTMLImageElement>(null);
  const [dragging, setDragging] = React.useState(false);

  const src = node.attrs.src;
  const width = node.attrs.width;

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);

    const startX = e.clientX;
    const startW = imgRef.current?.offsetWidth ?? 300;

    const onMouseMove = (ev: MouseEvent) => {
      const dx = ev.clientX - startX;
      const newW = Math.max(50, startW + dx);
      updateAttributes({ width: newW });
    };

    const onMouseUp = () => {
      setDragging(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <NodeViewWrapper className="inline-block relative leading-none">
      <img
        ref={imgRef}
        src={src}
        alt=""
        style={width ? { width: `${width}px`, height: "auto" } : undefined}
        className="max-w-full h-auto"
        draggable={false}
      />
      {selected && (
        <div
          onMouseDown={handleMouseDown}
          className="absolute bottom-1 right-1 w-3 h-3 bg-gray-900 border-2 border-white cursor-se-resize rounded-sm hover:scale-125 transition-transform"
          style={dragging ? { transform: "scale(1.25)" } : undefined}
        />
      )}
    </NodeViewWrapper>
  );
}
