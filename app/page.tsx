import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/features/landing/hero";
import { HowItWorks } from "@/features/landing/how-it-works";
import { GamesPreview } from "@/features/landing/games-preview";
import { Cta } from "@/features/landing/cta";

export default function Home() {
  return (
    <>
      {/* <SiteHeader /> */}
      <main className="flex flex-1 flex-col">
        <Hero />
        <HowItWorks />
        <GamesPreview />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}
