import { Hero } from "@/features/landing/components/Hero";
import { HowItWorks } from "@/features/landing/components/HowItWorks";
import { GamesPreview } from "@/features/landing/components/GamesPreview";
import { Cta } from "@/features/landing/components/Cta";
import { SiteFooter } from "@/common/layout/SiteFooter";

export const LandingScreen = () => (
  <>
    <main className="flex flex-1 flex-col">
      <Hero />
      <HowItWorks />
      <GamesPreview />
      <Cta />
    </main>
    <SiteFooter />
  </>
);
