"use client";

import { useEffect, useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { Card } from "@/common/ui/Card";
import { DisplayHeading } from "@/common/typography/DisplayHeading";

const subscribe = () => () => {};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Pixel-styled dialog rendered in a portal. Closes on Escape or backdrop. */
export const Modal = ({ open, onClose, title, icon, children, className }: ModalProps) => {
  // SSR-safe client flag: portals need `document`, which only exists after the
  // first client render. `false` on the server, `true` on the client.
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <Card
        role="dialog"
        aria-modal="true"
        className={cn(
          "fr-pop relative z-10 max-h-[85vh] w-full max-w-lg overflow-auto p-6 md:p-7",
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b-2 border-fr-border pb-3">
          <DisplayHeading as="h2" className="flex items-center gap-2 text-sm md:text-base">
            {icon}
            {title}
          </DisplayHeading>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="cursor-pointer text-fr-fg-subtle transition-colors hover:text-fr-fg"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </Card>
    </div>,
    document.body,
  );
};
