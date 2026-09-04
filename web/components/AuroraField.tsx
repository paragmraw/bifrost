"use client";

import { useEffect, useRef } from "react";

/**
 * Fixed aurora backdrop behind all content. The CSS gradient layers below are
 * the permanent fallback; post-idle we feature-test WebGL2 and mount the
 * shader canvas on top (dynamic import, disposed on unmount). SSR output
 * contains no canvas — hydration stays identical to the server render.
 */
export default function AuroraField() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = hostRef.current;
    if (!host) return;

    let cancelled = false;
    let idleId = 0;
    let fallbackTimer: ReturnType<typeof setTimeout> | null = null;
    let dispose: (() => void) | null = null;

    const start = () => {
      if (cancelled) return;
      try {
        // Feature test: no WebGL2 -> the CSS layer stands, nothing to load.
        if (!document.createElement("canvas").getContext("webgl2")) return;
      } catch {
        return;
      }
      import("./fx/auroraShader")
        .then((m) => {
          if (!cancelled) dispose = m.mountAurora(host);
        })
        .catch(() => {
          /* import failed -> CSS layer stands */
        });
    };

    if (typeof requestIdleCallback === "function") idleId = requestIdleCallback(start, { timeout: 2000 });
    else fallbackTimer = setTimeout(start, 1200);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback === "function") cancelIdleCallback(idleId);
      if (fallbackTimer) clearTimeout(fallbackTimer);
      dispose?.();
    };
  }, []);

  return (
    <div className="aurora" aria-hidden="true" ref={hostRef}>
      <div className="aurora-drift">
        <div className="aurora-blur" />
        <div className="aurora-pillar" />
      </div>
    </div>
  );
}