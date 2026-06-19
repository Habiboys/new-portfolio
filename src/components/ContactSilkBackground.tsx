import { useWebGLSupported } from "@/hooks/useWebGLSupported";
import { Suspense, lazy } from "react";
import { WebGLErrorBoundary } from "@/components/WebGLErrorBoundary";

const Silk = lazy(() => import("@/components/Silk"));

export function SilkStaticBackground() {
  return <div className="absolute inset-0 bg-[#7B7481]" aria-hidden />;
}

type Props = {
  paused?: boolean;
};

export function ContactSilkBackground({ paused = false }: Props) {
  const webglSupported = useWebGLSupported();
  const fallback = <SilkStaticBackground />;

  if (webglSupported === false) {
    return fallback;
  }

  if (webglSupported === null) {
    return fallback;
  }

  return (
    <WebGLErrorBoundary fallback={fallback}>
      <Suspense fallback={fallback}>
        <Silk
          speed={5}
          scale={1}
          color="#7B7481"
          noiseIntensity={1.5}
          rotation={0}
          paused={paused}
        />
      </Suspense>
    </WebGLErrorBoundary>
  );
}
