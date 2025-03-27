import { useState, useCallback } from "react";
import type { Joke } from "@/lib/types";
import { fetchRandomJoke } from "@/lib/api";
import { useToast } from "@/contexts/toast-context";

export function useJoke() {
  const [joke, setJoke] = useState<Joke | null>(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const getNewJoke = useCallback(async () => {
    setLoading(true);
    showToast("Fetching new joke...", "info");
    
    try {
      const newJoke = await fetchRandomJoke();
      setJoke(newJoke);
    } catch (error) {
      console.error("Failed to fetch joke:", error);
      showToast("Error: Failed to fetch a new joke. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  return {
    joke,
    loading,
    getNewJoke
  };
}
