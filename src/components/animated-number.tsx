import { useEffect, useRef, useState } from "react";

export function AnimatedNumber({
  value, format, delay = 0, animate = false,
}: {
  value: number;
  format: (value: number) => string;
  delay?: number;
  animate?: boolean;
}) {
  const [display, setDisplay] = useState(value);
  const previous = useRef(value);
  const hasRun = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const first = !hasRun.current;
    const from = first && animate ? 0 : previous.current;
    const startAt = performance.now() + (first && animate ? delay : 0);
    const duration = first ? 850 : 260;
    let frame: number;

    function step(now: number) {
      if (motion.matches || from === value) {
        previous.current = value;
        setDisplay(value);
        return;
      }
      const progress = Math.max(0, Math.min(1, (now - startAt) / duration));
      const next = from + (value - from) * (1 - (1 - progress) ** 3);
      previous.current = progress === 1 ? value : next;
      setDisplay(previous.current);
      if (progress < 1) frame = requestAnimationFrame(step);
    }

    frame = requestAnimationFrame((now) => {
      hasRun.current = true;
      step(now);
    });
    return () => cancelAnimationFrame(frame);
  }, [animate, delay, value]);

  return (
    <>
      <span className="sr-only">{format(value)}</span>
      <span aria-hidden="true">{format(display)}</span>
    </>
  );
}
