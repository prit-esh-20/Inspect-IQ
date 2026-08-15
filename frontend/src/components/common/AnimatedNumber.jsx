import { useEffect, useState } from "react";

export default function AnimatedNumber({
  end,
  decimals = 0,
  duration = 1.2,
  delay = 0,
  className = "",
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let animationFrame;
    let timeoutId;

    const startAnimation = () => {
      const startTime = Date.now();
      const startValue = 0;
      const totalDuration = duration * 1000;

      const tick = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / totalDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const nextValue = startValue + (end - startValue) * eased;

        setValue(Number(nextValue.toFixed(decimals)));

        if (progress < 1) {
          animationFrame = window.requestAnimationFrame(tick);
        }
      };

      animationFrame = window.requestAnimationFrame(tick);
    };

    if (delay > 0) {
      timeoutId = window.setTimeout(startAnimation, delay * 1000);
    } else {
      startAnimation();
    }

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [delay, decimals, duration, end]);

  return <span className={className}>{value}</span>;
}
