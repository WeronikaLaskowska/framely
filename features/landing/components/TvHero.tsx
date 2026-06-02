"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { CornerFrame } from "@/common/decoration/CornerFrame";
import { Timecode } from "@/common/typography/Timecode";

export const TvHero = () => {
  const [data, setData] = useState<object | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/animations/tv.json")
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => active && setData(json))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative mx-auto w-full max-w-[480px]">
      <div className="fr-monitor__halo" aria-hidden />
      <div className="fr-monitor fr-crt-flicker relative aspect-[4/3]">
        <div className="fr-letterbox fr-letterbox--t" aria-hidden />
        <div className="absolute inset-0 grid place-items-center p-6">
          {data ? (
            <Lottie animationData={data} loop className="h-full w-full" />
          ) : (
            <div className="h-2/3 w-2/3 fr-skeleton rounded-lg" aria-hidden />
          )}
        </div>
        <div className="fr-letterbox fr-letterbox--b" aria-hidden />
        <div className="fr-scanlines" aria-hidden />
        <CornerFrame />

        <Timecode className="absolute left-4 top-3 z-[5] text-[10px] text-fr-flame/80">
          ● REC
        </Timecode>
        <Timecode className="absolute bottom-3 right-4 z-[5] text-[10px] text-fr-fg-muted">
          02:39:1
        </Timecode>
      </div>
    </div>
  );
};
