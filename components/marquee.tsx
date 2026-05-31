import { Fragment } from "react";

/** Seamless left-drifting strip. Items are rendered twice so the -50%
 *  translate loops without a seam. Pauses on hover. */
export function Marquee({ items }: { items: string[] }) {
  return (
    <div className="fr-marquee-mask">
      <div className="fr-marquee-track">
        {[0, 1].map((dup) => (
          <Fragment key={dup}>
            {items.map((item, i) => (
              <span
                key={`${dup}-${i}`}
                className="fr-timecode flex items-center gap-5 whitespace-nowrap px-5 py-3"
                aria-hidden={dup === 1}
              >
                {item}
                <span className="text-fr-ember">/</span>
              </span>
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}
