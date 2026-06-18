import Image from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ImageNodeView from "./ImageNodeView";

export const ResizableImage = Image.extend({
  addAttributes() {
    return {
      src: { default: null },
      alt: { default: null },
      title: { default: null },
      width: { default: null },
    };
  },

  renderHTML({ HTMLAttributes }) {
    const { width, ...rest } = HTMLAttributes;
    return [
      "img",
      {
        ...rest,
        style: width ? `width:${width}px;height:auto;max-width:100%` : undefined,
        width: undefined,
      },
    ];
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
        getAttrs: (el) => {
          if (typeof el === "string") return {};
          const img = el as HTMLImageElement;
          const w = img.getAttribute("width") || img.style.width;
          return { width: w ? parseInt(w, 10) || null : null };
        },
      },
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});
