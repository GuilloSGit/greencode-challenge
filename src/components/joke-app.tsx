"use client"

import { useState, useEffect } from "react"
import type { Joke } from "@/lib/types"
import { fetchRandomJoke } from "@/lib/api"
import FavoritesList from "@/components/favorites-list"
import { useToast } from "@/lib/toast-context"
import NewJokeIcon from "./SVG/NewJokeIcon"
import HeartIcon from "./SVG/HeartIcon"

export default function JokeApp() {
  const [joke, setJoke] = useState<Joke | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Joke[]>([])
  const [activeTab, setActiveTab] = useState("random")
  const { showToast } = useToast()

  useEffect(() => {
    // Load favorites from localStorage on component mount
    const storedFavorites = localStorage.getItem("chuckFavorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }

    // Fetch initial joke
    getNewJoke()
  }, [])

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chuckFavorites", JSON.stringify(favorites))
  }, [favorites])

  const getNewJoke = async () => {
    setLoading(true)
    try {
      const newJoke = await fetchRandomJoke()
      setJoke(newJoke)
    } catch (error) {
      console.error("Failed to fetch joke:", error)
      showToast("Error: Failed to fetch a new joke. Please try again.", "error")
    } finally {
      setLoading(false)
    }
  }

  const addToFavorites = () => {
    if (!joke) return

    // Check if joke is already in favorites
    if (favorites.some((fav) => fav.id === joke.id)) {
      showToast("This joke is already in your favorites!", "info")
      return
    }

    // Add joke to favorites with initial rating of 0 (unrated)
    const jokeWithRating = { ...joke, rating: 0 }
    setFavorites((prev) => [...prev, jokeWithRating])

    showToast("Joke added to your favorites!", "success")
  }

  const removeFromFavorites = (id: string) => {
    setFavorites((prev) => prev.filter((joke) => joke.id !== id))
    showToast("Joke removed from your favorites", "info")
  }

  const updateRating = (id: string, rating: number) => {
    setFavorites((prev) => prev.map((joke) => (joke.id === id ? { ...joke, rating } : joke)))
  }

  return (
    <div className="w-full">
      {/* Custom Tabs */}
      <div className="flex w-full mb-6 border-b">
        <button
          onClick={() => setActiveTab("random")}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === "random"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          Random Joke
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 py-3 font-medium text-center transition-colors ${
            activeTab === "favorites"
              ? "text-orange-600 border-b-2 border-orange-500"
              : "text-gray-500 hover:text-orange-500"
          }`}
        >
          Favorites jokes ({favorites.length} jokes saved)
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "random" && (
        <div className="space-y-4">
          <div className="p-6 rounded-lg shadow-md bg-black">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <>
                <p className="text-xl mb-6">{joke?.value}</p>
                <div className="flex justify-between">
                  <button
                    onClick={getNewJoke}
                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md flex items-center transition-colors"
                  >
                    <NewJokeIcon filled={false} />
                    New Joke
                  </button>
                  <button
                    onClick={addToFavorites}
                    className="px-4 py-2 border border-orange-500 text-orange-500 hover:bg-orange-50 rounded-md flex items-center transition-colors"
                  >
                    <HeartIcon filled={false} />
                    Favorite
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {activeTab === "favorites" && (
        <FavoritesList favorites={favorites} onRemove={removeFromFavorites} onUpdateRating={updateRating} />
      )}
    </div>
  )
}

