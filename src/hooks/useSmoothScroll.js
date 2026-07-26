import { useEffect } from "react";
import Lenis from "lenis";

// Shared easing — easeInOutCubic for a premium, non-bouncy glide.
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Visual breathing room below the navbar edge (px). Only this value is hardcoded.
const SCROLL_GAP = 30;

/**
 * Reads the actual rendered height of the fixed navbar at scroll-time.
 * Queries the first <header> that has position:fixed so it works even if the
 * navbar ever gets a [data-navbar] attribute added or its class changes.
 * Falls back to 80px if no fixed header is found.
 */
function getNavbarHeight() {
  // Prefer a specifically tagged element, fall back to any fixed header.
  const navbar =
    document.querySelector("[data-navbar]") ||
    document.querySelector("header");
  if (!navbar) return 80;
  return navbar.getBoundingClientRect().height;
}

/**
 * Returns the total scroll offset to subtract so that the section title
 * lands just below the navbar with SCROLL_GAP pixels of breathing room.
 * Called fresh on every invocation so it's always accurate.
 */
function getDynamicOffset() {
  return getNavbarHeight() + SCROLL_GAP;
}

/**
 * Single smooth-scroll entry point used by the navbar, hero CTAs, footer
 * anchors and the scroll indicator — all glide through the same Lenis engine.
 *
 * The `offset` parameter is kept for backwards-compatibility but is now
 * IGNORED. The offset is always computed dynamically from the live navbar
 * height so no caller needs to hardcode pixel values.
 */
export function scrollToSection(target, { onComplete } = {}) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;

  const dynamicOffset = getDynamicOffset();
  const lenis = window.__lenis;

  if (lenis) {
    lenis.scrollTo(element, {
      offset: -dynamicOffset,
      duration: 1.1,
      easing: easeInOutCubic,
      onComplete,
    });
  } else {
    // Fallback: native scroll with manual position calculation.
    const top =
      element.getBoundingClientRect().top +
      window.pageYOffset -
      dynamicOffset;
    window.scrollTo({ top, behavior: "smooth" });
    onComplete?.();
  }
}

export default function useSmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.05,
      touchMultiplier: 1.8,
    });

    window.__lenis = lenis;
    // Keep the global shim working (ignores the legacy offset arg).
    window.scrollToSection = (target) => scrollToSection(target);

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };

    requestAnimationFrame(raf);

    return () => {
      window.__lenis = undefined;
      window.scrollToSection = undefined;
      lenis.destroy();
    };
  }, []);
}
