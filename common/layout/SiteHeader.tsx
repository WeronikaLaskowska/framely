import Link from "next/link";
import Image from "next/image";
import { ButtonLink } from "@/common/ui/ButtonLink";
import { ScoreTrigger } from "@/features/score/components/ScoreTrigger";

export const SiteHeader = () => (
  <header className="sticky top-0 z-30 border-b-2 border-fr-border-strong bg-fr-bg/70 backdrop-blur-xl">
    <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5 sm:h-20 xl:px-10">
      <div className=""></div>
      {/* <Link href="/" className="group flex items-center" aria-label="Framely — home">
        <Image
          src="/logo.png"
          alt="Framely"
          width={500}
          height={500}
          priority
          className="h-12 w-12 object-contain transition-transform duration-200 group-hover:-translate-y-0.5 sm:h-16 sm:w-16"
        />
      </Link> */}

      <nav className="flex items-center gap-2 sm:gap-3">
        <ButtonLink href="/games" variant="ghost" className="px-3 py-2.5 text-xs sm:px-4">
          Games
        </ButtonLink>
        <ButtonLink href="/games/guess-movie" variant="ember" className="px-3 py-2.5 text-xs sm:px-4">
          Play
        </ButtonLink>
        <ScoreTrigger />
      </nav>
    </div>
  </header>
);
