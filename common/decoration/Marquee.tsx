import { Fragment } from "react";
import { Timecode } from "@/common/typography/Timecode";

export const Marquee = ({ items }: { items: string[] }) => (
  <div className="fr-marquee-mask">
    <div className="fr-marquee-track">
      {[0, 1].map((dup) => (
        <Fragment key={dup}>
          {items.map((item, i) => (
            <Timecode
              key={`${dup}-${i}`}
              className="flex items-center gap-5 whitespace-nowrap px-5 py-3"
              aria-hidden={dup === 1}
            >
              {item}
              <span className="text-fr-ember">/</span>
            </Timecode>
          ))}
        </Fragment>
      ))}
    </div>
  </div>
);
