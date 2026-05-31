export type HowItWorksStep = { no: string; title: string; body: string };

/** The three explainer rows on the landing "how it plays" section. */
export const HOW_IT_WORKS_STEPS: HowItWorksStep[] = [
  {
    no: "01",
    title: "A secret film is cast",
    body: "Every round draws a well-known movie from 1980 onward. You never see its title — only the clues you earn.",
  },
  {
    no: "02",
    title: "Guess, then read the colour",
    body: "Green is an exact match. Amber is close — overlapping genres or cast, a near year, rating or gross. Grey is cold. Arrows point you higher or lower.",
  },
  {
    no: "03",
    title: "Call it in as few takes as you can",
    body: "Narrow it across six attributes — or one revealed poster fragment — and name the title before the reel runs out.",
  },
];
