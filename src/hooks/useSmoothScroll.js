import { useEffect } from "react";
import Lenis from "lenis";

// Shared easing for every programmatic scroll — easeInOutCubic.
const easeInOutCubic = (t) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

// Single smooth-scroll entry point used by the navbar, hero CTAs, footer
// anchors and the scroll indicator — all glide through the same Lenis engine.
export function scrollToSection(target, { offset = 110, onComplete } = {}) {
  const element =
    typeof target === "string" ? document.querySelector(target) : target;
  if (!element) return;
  const lenis = window.__lenis;
  if (lenis) {
    lenis.scrollTo(element, {
      offset: -offset,
      duration: 1.1, // 1100ms premium glide
      easing: easeInOutCubic,
      onComplete,
    });
  } else {
    window.scrollTo({ top: element.offsetTop - offset, behavior: "smooth" });
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
    window.scrollToSection = (target, offset = 120) =>
      scrollToSection(target, { offset });

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
