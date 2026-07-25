import { useEffect } from "react";
import Lenis from "lenis";

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
    window.scrollToSection = (target, offset = 120) => {
      const element =
        typeof target === "string" ? document.querySelector(target) : target;
      if (!element) return;
      lenis.scrollTo(element, {
        offset: -offset,
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    };

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
