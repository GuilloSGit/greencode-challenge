import { useState, useMemo } from "react";
import type { Joke } from "@/lib/types";

type SortOption = "newest" | "highest" | "lowest";

export function useSortedFavorites(favorites: Joke[]) {
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const sortedFavorites = useMemo(() => {
    return [...favorites].sort((a, b) => {
      if (sortBy === "highest") {
        return (b.rating || 0) - (a.rating || 0);
      } else if (sortBy === "lowest") {
        return (a.rating || 0) - (b.rating || 0);
      }
      return 0;
    });
  }, [favorites, sortBy]);

  return {
    sortBy,
    setSortBy,
    sortedFavorites
  };
}
