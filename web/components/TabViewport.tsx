"use client";

import { useEffect, type ReactNode } from "react";

const STORAGE_KEY = "bifrost.tab";
const WHEEL_THRESHOLD = 30;

// Scale floor. Below this, content would be unreadable — but the contract is
// "no scrolling on any screen size", so we allow aggressive downscaling rather
// than clipping. (flex-centering keeps whatever is scaled evenly framed.)
const MIN_SCALE = 0.3;

export default function TabViewport({ children }: { children: ReactNode }) {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-tab-section]"));
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>("[data-tab]"));
    if (!sections.length) return;

    const ORDER = sections.map((s) => s.id);
    const btn = document.querySelector<HTMLButtonElement>(".nav-toggle");
    const nav = document.getElementById("primary-nav");
    let menuOpen = false;

    const indexOf = (id: string) => ORDER.indexOf(id);
    const clamp = (n: number) => Math.max(0, Math.min(ORDER.length - 1, n));

    // --- Fit-to-viewport scaling -------------------------------------------------
    // Every section is height-locked to the viewport (overflow hidden). When its
    // content is taller/wider than the viewport, we scale the section's container
    // down with transform: scale until it fits. Result: ZERO scrolling anywhere,
    // on every screen size — scroll gestures simply switch tabs instead.
    // We scale the container (not the section): zooming/scaling an absolutely
    // positioned flex section misplaces it; scaling an in-flow child is stable.
    const scaledContainers: HTMLElement[] = [];

    function fitSection(section: HTMLElement) {
      const container = (section.firstElementChild as HTMLElement | null) ?? section;
      if (!scaledContainers.includes(container)) scaledContainers.push(container);
      const vw = section.clientWidth;
      const vh = section.clientHeight;
      if (!vw || !vh) return;

      // Measure unscaled: temporarily clear the transform so scrollHeight is natural
      const prevScale = container.style.transform;
      container.style.transform = "none";
      const naturalW = container.scrollWidth;
      const naturalH = container.scrollHeight;
      container.style.transform = prevScale;

      const pad = 24; // breathing room so scaled content doesn't kiss the edges
      const heightScale = Math.min(1, (vh - pad) / naturalH);
      // The container is width:100%, so scrollWidth equals clientWidth when content
      // fits — only bound by width when it actually overflows, otherwise every
      // section would shrink ~2% for free.
      const widthScale = naturalW > vw + 1 ? (vw - pad) / naturalW : 1;
      const scale = Math.max(MIN_SCALE, Math.min(heightScale, widthScale));

      if (scale < 0.999) {
        container.style.transformOrigin = "center center";
        container.style.transform = `scale(${scale})`;
      } else {
        // Content fits naturally — clear any previously applied scale.
        container.style.transform = "";
        container.style.transformOrigin = "";
      }
    }

    function fitAll() {
      sections.forEach(fitSection);
    }

    // Recompute scale whenever content size can change (webfonts, images, breakpoints).
    // Observe the scaled containers, not the sections — sections are inset:0 and
    // never change size, so observing them would fire only once.
    const ro = new ResizeObserver(() => fitAll());
    const observed = new Set<HTMLElement>();
    const observeContainers = () => {
      sections.forEach((s) => {
        const c = s.firstElementChild as HTMLElement | null;
        if (c && !observed.has(c)) {
          observed.add(c);
          ro.observe(c);
        }
      });
    };
    observeContainers();
    fitAll();

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => fitAll()).catch(() => {});
    }
    window.addEventListener("resize", fitAll);

    function setMenu(open: boolean) {
      menuOpen = open;
      if (!btn || !nav) return;
      nav.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.textContent = open ? "Close" : "Menu";
    }

    function currentId(): string {
      let saved: string | null = null;
      try {
        saved = localStorage.getItem(STORAGE_KEY);
      } catch {
        /* private mode */
      }
      if (saved && indexOf(saved) >= 0) return saved;
      return ORDER[0];
    }

    function activate(id: string) {
      const i = indexOf(id);
      if (i < 0) return;
      try {
        localStorage.setItem(STORAGE_KEY, id);
      } catch {
        /* private mode */
      }
      navLinks.forEach((a) => {
        if (a.getAttribute("data-tab") === id) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });
      sections.forEach((s) => {
        if (s.id === id) s.classList.add("is-active");
        else {
          s.classList.remove("is-active");
          s.scrollTop = 0;
        }
      });
      // Aurora shader listens for this to ease its intensity per tab.
      window.dispatchEvent(new CustomEvent("bifrost:tabchange", { detail: id }));
    }

    function goTo(id: string) {
      activate(id);
    }

    function stepBy(delta: number) {
      let current = ORDER.indexOf(currentId());
      if (current < 0) current = 0;
      goTo(ORDER[clamp(current + delta)]);
    }

    const onNavClick = (e: Event) => {
      const a = (e.currentTarget as HTMLAnchorElement).getAttribute("data-tab");
      if (!a || indexOf(a) < 0) return;
      e.preventDefault();
      setMenu(false);
      goTo(a);
    };
    navLinks.forEach((a) => a.addEventListener("click", onNavClick));

    // Wheel: snap between tabs on the first scroll. Sections never scroll.
    let wheelAcc = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      if (menuOpen) return;
      e.preventDefault();
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) >= WHEEL_THRESHOLD) {
        stepBy(wheelAcc > 0 ? 1 : -1);
        wheelAcc = 0;
      }
      if (wheelTimer) clearTimeout(wheelTimer);
      wheelTimer = setTimeout(() => {
        wheelAcc = 0;
      }, 220);
    };
    document.addEventListener("wheel", onWheel, { passive: false });

    // Keyboard
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable))
        return;
      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        stepBy(1);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        stepBy(-1);
      } else if (e.key === "Home") {
        e.preventDefault();
        goTo(ORDER[0]);
      } else if (e.key === "End") {
        e.preventDefault();
        goTo(ORDER[ORDER.length - 1]);
      } else if (e.key === "Escape" && menuOpen) {
        setMenu(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Touch swipe
    let touchY: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (touchY == null || menuOpen) return;
      const dy = touchY - (e.changedTouches[0] ? e.changedTouches[0].clientY : touchY);
      if (Math.abs(dy) > 40) stepBy(dy > 0 ? 1 : -1);
      touchY = null;
    };
    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchend", onTouchEnd, { passive: true });

    // Mobile menu: outside click closes it
    const onDocClick = (e: MouseEvent) => {
      if (menuOpen && nav && btn && !nav.contains(e.target as Node) && !btn.contains(e.target as Node))
        setMenu(false);
    };
    document.addEventListener("click", onDocClick);

    const onToggleClick = () => setMenu(!menuOpen);
    btn?.addEventListener("click", onToggleClick);

    // Pointer glow: on precise pointers, feed cursor coords to CSS custom props
    // (normalized 0-1 in --mx-n/--my-n, pixels in --mx/--my) for hover effects.
    let removeGlow: (() => void) | null = null;
    if (
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      const rootStyle = document.documentElement.style;
      let glowRaf = 0;
      let lastMove: PointerEvent | null = null;
      const applyGlow = () => {
        glowRaf = 0;
        const e = lastMove;
        if (!e) return;
        lastMove = null;
        rootStyle.setProperty("--mx-n", String(e.clientX / window.innerWidth));
        rootStyle.setProperty("--my-n", String(e.clientY / window.innerHeight));
        rootStyle.setProperty("--mx", `${e.clientX}px`);
        rootStyle.setProperty("--my", `${e.clientY}px`);
      };
      const onPointerMove = (e: PointerEvent) => {
        lastMove = e;
        if (!glowRaf) glowRaf = requestAnimationFrame(applyGlow);
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      removeGlow = () => {
        cancelAnimationFrame(glowRaf);
        window.removeEventListener("pointermove", onPointerMove);
      };
    }

    // Initial state
    goTo(currentId());

    return () => {
      navLinks.forEach((a) => a.removeEventListener("click", onNavClick));
      document.removeEventListener("wheel", onWheel);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("click", onDocClick);
      btn?.removeEventListener("click", onToggleClick);
      removeGlow?.();
      if (wheelTimer) clearTimeout(wheelTimer);
      ro.disconnect();
      window.removeEventListener("resize", fitAll);
      scaledContainers.forEach((c) => {
        c.style.transform = "";
        c.style.transformOrigin = "";
      });
    };
  }, []);

  return (
    <main id="content" className="viewport">
      {children}
    </main>
  );
}