import { useEffect, useState } from "react";

function detectWebGL(): boolean {
  if (typeof document === "undefined") return false;

  try {
    const canvas = document.createElement("canvas");
    const context =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");

    if (!context) return false;

    if (context instanceof WebGLRenderingContext || context instanceof WebGL2RenderingContext) {
      const loseExt = context.getExtension("WEBGL_lose_context");
      loseExt?.loseContext();
    }

    return true;
  } catch {
    return false;
  }
}

export function useWebGLSupported(): boolean | null {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(detectWebGL());
  }, []);

  return supported;
}
