"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·:/";

type DecodeTextProps = {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
};

export const DecodeText = ({ text, className, delay = 0, duration = 900 }: DecodeTextProps) => {
  const [output, setOutput] = useState(text);
  const frame = useRef<number>(0);

  useEffect(() => {
    // Reduced motion: the initial state already shows the final text, so we
    // simply skip the animation rather than re-setting identical state.
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    let raf = 0;
    let start = 0;
    const total = text.length;

    const tick = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const settled = Math.floor(progress * total);
      let out = "";
      for (let i = 0; i < total; i++) {
        const ch = text[i];
        if (ch === " ") out += " ";
        else if (i < settled) out += ch;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setOutput(out);
      if (progress < 1) raf = requestAnimationFrame(tick);
      else setOutput(text);
    };

    const timer = window.setTimeout(() => {
      raf = requestAnimationFrame(tick);
    }, delay);

    const node = frame;
    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      node.current = 0;
    };
  }, [text, delay, duration]);

  return <span className={className}>{output}</span>;
};
