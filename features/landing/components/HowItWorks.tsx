import { HOW_IT_WORKS_STEPS } from "@/features/landing/data/howItWorksSteps";
import { HowItWorksStep } from "@/features/landing/components/HowItWorksStep";
import { ScrollReveal } from "@/common/decoration/ScrollReveal";
import { SectionTitle } from "@/common/typography/SectionTitle";
import { EmberText } from "@/common/typography/EmberText";

export const HowItWorks = () => (
  <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:py-24 xl:px-10">
    <ScrollReveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
      <SectionTitle className="max-w-xl">
        How the <EmberText>game</EmberText> plays
      </SectionTitle>
    </ScrollReveal>

    <div className="border-t border-fr-border">
      {HOW_IT_WORKS_STEPS.map((step, i) => (
        <ScrollReveal key={step.no} delay={i * 100}>
          <HowItWorksStep step={step} />
        </ScrollReveal>
      ))}
    </div>
  </section>
);
