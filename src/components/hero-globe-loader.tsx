"use client";

import { useSyncExternalStore } from "react";
import dynamic from "next/dynamic";
import { HeroGlobeFallback } from "./hero-globe-fallback";
import { WebglErrorBoundary } from "./webgl-error-boundary";

const HeroGlobe = dynamic(() => import("./hero-globe"), {
  ssr: false,
  loading: () => <HeroGlobeFallback />,
});

let cachedWebGLSupport: boolean | null = null;

function detectWebGL(): boolean {
  if (cachedWebGLSupport !== null) return cachedWebGLSupport;
  try {
    const canvas = document.createElement("canvas");
    cachedWebGLSupport = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")),
    );
  } catch {
    cachedWebGLSupport = false;
  }
  return cachedWebGLSupport;
}

const noopSubscribe = () => () => {};

function useHasWebGL() {
  return useSyncExternalStore(noopSubscribe, detectWebGL, () => false);
}

export function HeroGlobeLoader() {
  const supported = useHasWebGL();

  if (!supported) {
    return (
      <div className="h-full w-full">
        <HeroGlobeFallback />
      </div>
    );
  }

  return (
    <div className="h-full w-full touch-none">
      <WebglErrorBoundary fallback={<HeroGlobeFallback />}>
        <HeroGlobe />
      </WebglErrorBoundary>
    </div>
  );
}
