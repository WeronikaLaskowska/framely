import { ScrollReveal } from "@/components/scroll-reveal";

const STEPS = [
  {
    no: "01",
    tag: "FADE IN",
    title: "A secret film is cast",
    body: "Every round draws a well-known movie from 1980 onward. You never see its title — only the clues you earn.",
  },
  {
    no: "02",
    tag: "DEVELOP",
    title: "Guess, then read the colour",
    body: "Green is an exact match. Amber is close — overlapping genres or cast, a near year, rating or gross. Grey is cold. Arrows point you higher or lower.",
  },
  {
    no: "03",
    tag: "CUT",
    title: "Call it in as few takes as you can",
    body: "Narrow it across six attributes — or one revealed poster fragment — and name the title before the reel runs out.",
  },
];

/** Editorial "spec sheet" — large indexed rows separated by hairlines. */
export function HowItWorks() {
  return (
    <section className="mx-auto w-full max-w-6xl px-5 py-24 xl:px-10">
      <ScrollReveal className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <h2 className="fr-section-title max-w-xl">
          How the <span className="fr-ember-text">game</span> plays
        </h2>
        <span className="fr-timecode">Spec · 003 lines</span>
      </ScrollReveal>

      <div className="border-t border-fr-border">
        {STEPS.map((step, i) => (
          <ScrollReveal key={step.no} delay={i * 100}>
            <div className="group grid grid-cols-1 items-baseline gap-3 border-b border-fr-border py-8 md:grid-cols-12 md:gap-6 md:py-10">
              <div className="md:col-span-3">
                <span className="fr-display fr-outline-text text-6xl md:text-7xl">
                  {step.no}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="fr-timecode text-fr-flame/80">{step.tag}</span>
              </div>
              <div className="md:col-span-7">
                <h3 className="fr-display text-sm leading-relaxed md:text-base">{step.title}</h3>
                <p className="mt-3 max-w-xl text-fr-fg-muted">{step.body}</p>
              </div>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
