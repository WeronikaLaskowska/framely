import { useState, type KeyboardEvent } from "react";

type ListboxNavigation = {
  active: number;
  setActive: (index: number) => void;
  /** Wire onto the input/list element to drive ↑/↓ + Enter + Escape. */
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
};

type Options<T> = {
  items: T[];
  isOpen: boolean;
  onChoose: (item: T) => void;
  onClose: () => void;
};

/**
 * Roving-highlight keyboard navigation for a listbox/combobox: ↑/↓ wrap through
 * `items`, Enter selects the active one, Escape closes. Owns the active index so
 * consumers only render highlight state.
 */
export function useListboxNavigation<T>({
  items,
  isOpen,
  onChoose,
  onClose,
}: Options<T>): ListboxNavigation {
  const [active, setActive] = useState(0);

  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!isOpen || items.length === 0) return;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActive((a) => (a + 1) % items.length);
        break;
      case "ArrowUp":
        event.preventDefault();
        setActive((a) => (a - 1 + items.length) % items.length);
        break;
      case "Enter": {
        event.preventDefault();
        const pick = items[active];
        if (pick) onChoose(pick);
        break;
      }
      case "Escape":
        onClose();
        break;
    }
  };

  return { active, setActive, onKeyDown };
}
