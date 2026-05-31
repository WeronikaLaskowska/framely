import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b-2 border-fr-border-strong bg-fr-bg/70 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-5 xl:px-10">
        <Link href="/" className="group flex items-center" aria-label="Framely — home">
          <Image
            src="/logo.png"
            alt="Framely"
            width={500}
            height={500}
            priority
            className="h-16 w-16 object-contain transition-transform duration-200 group-hover:-translate-y-0.5"
          />
        </Link>

        <nav className="flex items-center gap-3">
          <Link href="/games" className="fr-btn fr-btn--ghost px-4 py-2.5 text-xs">
            Games
          </Link>
          <Link href="/games/guess-movie" className="fr-btn fr-btn--ember px-4 py-2.5 text-xs">
            Play
          </Link>
        </nav>
      </div>
    </header>
  );
}
