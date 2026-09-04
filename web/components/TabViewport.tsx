"use client";

import { useEffect, type ReactNode } from "react";

const STORAGE_KEY = "bifrost.tab";
const WHEEL_THRESHOLD = 30;

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

    // A section taller than the viewport (very short screens) scrolls itself:
    // let wheel/touch scroll it natively instead of snap-switching tabs.
    const scrollableSection = (t: EventTarget | null) => {
      const sec = (t as HTMLElement | null)?.closest?.("[data-tab-section]") as HTMLElement | null;
      return sec && sec.scrollHeight > sec.clientHeight + 1 ? sec : null;
    };

    // Wheel: snap between tabs on the first scroll. Sections don't scroll.
    let wheelAcc = 0;
    let wheelTimer: ReturnType<typeof setTimeout> | null = null;
    const onWheel = (e: WheelEvent) => {
      if (menuOpen) return;
      if (scrollableSection(e.target)) return;
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
      if (scrollableSection(e.target)) {
        touchY = null;
        return;
      }
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
    };
  }, []);

  return (
    <main id="content" className="viewport">
      {children}
    </main>
  );
}