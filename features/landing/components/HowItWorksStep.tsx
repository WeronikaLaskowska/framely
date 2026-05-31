import type { HowItWorksStep as Step } from "@/features/landing/data/howItWorksSteps";
import { DisplayHeading } from "@/common/typography/DisplayHeading";
import { OutlineText } from "@/common/typography/OutlineText";

export const HowItWorksStep = ({ step }: { step: Step }) => (
  <div className="group grid grid-cols-1 items-baseline gap-3 border-b border-fr-border py-8 md:grid-cols-12 md:gap-6 md:py-10">
    <div className="md:col-span-3">
      <OutlineText className="fr-display text-6xl md:text-7xl">{step.no}</OutlineText>
    </div>
    <div className="md:col-span-7">
      <DisplayHeading as="h3" className="text-sm leading-relaxed md:text-base">
        {step.title}
      </DisplayHeading>
      <p className="mt-3 max-w-xl text-fr-fg-muted">{step.body}</p>
    </div>
  </div>
);
