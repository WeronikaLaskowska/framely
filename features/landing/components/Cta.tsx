import { ScrollReveal } from "@/common/decoration/ScrollReveal";
import { CornerFrame } from "@/common/decoration/CornerFrame";
import { Card } from "@/common/ui/Card";
import { ButtonLink } from "@/common/ui/ButtonLink";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { EmberText } from "@/common/typography/EmberText";

/** Closing "feature presentation" slate. */
export const Cta = () => (
  <section className="mx-auto w-full max-w-6xl px-5 pb-28 pt-8 xl:px-10">
    <ScrollReveal>
      <Card className="relative overflow-hidden px-6 py-16 text-center md:px-10 md:py-24">
        <CornerFrame />

        <ScrollReveal delay={140} className="relative mx-auto mt-5 max-w-3xl">
          <DisplayHeading className="text-[clamp(1.5rem,4.5vw,3rem)] leading-[1.35]">
            Lights down.
            <br />
            <EmberText>Roll the film.</EmberText>
          </DisplayHeading>
        </ScrollReveal>

        <ScrollReveal delay={300} className="mt-9">
          <ButtonLink href="/games" variant="ember" className="relative px-8 py-4 text-base">
            Choose a game
          </ButtonLink>
        </ScrollReveal>
      </Card>
    </ScrollReveal>
  </section>
);
