import { useState, useEffect } from "react";
import type { Joke } from "@/lib/types";
import { useToast } from "@/contexts/toast-context";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Joke[]>([]);
  const { showToast } = useToast();

  useEffect(() => {
    const storedFavorites = localStorage.getItem("chuckFavorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
      showToast("Favorites loaded", "success");
    }
  }, [showToast]);

  useEffect(() => {
    if (favorites.length > 0) {
      localStorage.setItem("chuckFavorites", JSON.stringify(favorites));
    }
  }, [favorites]);

  const addToFavorites = (joke: Joke) => {
    if (!joke) return;

    if (favorites.some((fav) => fav.id === joke.id)) {
      showToast("This joke is already in your favorites!", "info");
      return;
    }

    const jokeWithRating = { ...joke, rating: 0 };
    setFavorites((prevFavorites) => {
      if (prevFavorites.some(fav => fav.id === joke.id)) {
        return prevFavorites;
      }
      return [...prevFavorites, jokeWithRating];
    });
    showToast("Joke added to your favorites!", "success");
  };

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((joke) => joke.id !== id));
    showToast("Joke removed from your favorites", "warning");
  };

  const updateRating = (id: string, rating: number) => {
    setFavorites((prev) =>
      prev.map((joke) => (joke.id === id ? { ...joke, rating } : joke))
    );
    showToast("Rating updated", "info");
  };

  return {
    favorites,
    addToFavorites,
    removeFromFavorites,
    updateRating,
  };
}
