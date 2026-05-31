import Image from "next/image";
import { Timecode } from "@/common/typography/Timecode";

/** Footer styled as an end-of-reel slate with required TMDB attribution. */
export const SiteFooter = () => (
  <footer className="border-t-2 border-fr-border-strong">
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-5 py-10 xl:px-10">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <Image
          src="/logo.png"
          alt="Framely — guess, discover, love movies"
          width={500}
          height={500}
          className="h-28 w-28 object-contain"
        />
        <div className="flex max-w-md flex-col gap-2">
          <Timecode className="leading-relaxed normal-case tracking-normal text-fr-fg-subtle">
            This product uses the TMDB API but is not endorsed or certified by
            TheMovieDB.
          </Timecode>
          <Timecode className="leading-relaxed normal-case tracking-normal text-fr-fg-subtle">
            A non-commercial portfolio project, built for fun.
          </Timecode>
        </div>
      </div>
    </div>
  </footer>
);
