/** Pure HTTP for the Higher or Lower game. */
import { apiGet } from "@/api/client";
import type { HiloCard } from "@/models/hilo";

type DeckResponse = { deck: HiloCard[] };

export const hiloGameApi = {
  deck: (): Promise<DeckResponse> => apiGet<DeckResponse>("/api/games/higher-lower"),
};
