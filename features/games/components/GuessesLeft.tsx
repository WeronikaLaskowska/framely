import { plural } from "@/lib/format";
import { Counter } from "@/common/typography/Counter";

type GuessesLeftProps = {
  count: number;
};

export const GuessesLeft = ({ count }: GuessesLeftProps) => (
  <Counter>
    {count} {plural(count, "guess", "guesses")} left
  </Counter>
);
