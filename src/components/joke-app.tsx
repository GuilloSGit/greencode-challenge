"use client"

import { useState, useEffect } from "react"
import FavoritesList from "./favorites-list"
import HeartIcon from "./SVG/HeartIcon"
import NewJokeIcon from "./SVG/NewJokeIcon"
import { useJoke } from "@/hooks/useJoke"
import { useFavorites } from "@/hooks/useFavorites"

export default function JokeApp() {
  const [activeTab, setActiveTab] = useState<"random" | "favorites">("random")
  const { joke, loading, getNewJoke } = useJoke()
  const { favorites, addToFavorites, removeFromFavorites, updateRating } = useFavorites()

  useEffect(() => {
    getNewJoke()
  }, [getNewJoke])

  return (
    <div className="container mx-auto max-w-2xl p-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Chuck Norris Jokes</h1>

      <div className="flex w-full mb-6 border-b">
        <button
          onClick={() => setActiveTab("random")}
          className={`flex-1 py-2 text-center border-b-2 ${
            activeTab === "random"
              ? "border-primary font-medium"
              : "border-transparent hover:border-primary/30"
          }`}
        >
          Random Joke
        </button>
        <button
          onClick={() => setActiveTab("favorites")}
          className={`flex-1 py-2 text-center border-b-2 ${
            activeTab === "favorites"
              ? "border-primary font-medium"
              : "border-transparent hover:border-primary/30"
          }`}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      {activeTab === "random" && (
        <div className="space-y-4">
          <div className="p-6 rounded-lg shadow-md bg-black">
            {loading ? (
              <div className="animate-pulse h-16 bg-gray-700 rounded-md" />
            ) : joke ? (
              <p className="text-lg text-white">{joke.value}</p>
            ) : (
              <p>Error loading joke. Please try again.</p>
            )}
          </div>

          <div className="flex gap-2 justify-center">
            <button
              onClick={getNewJoke}
              className="text-white px-6 py-2 rounded-md flex items-center gap-2 bg-orange-400 hover:bg-orange-500 transition-colors"
              disabled={loading}
            >
              <NewJokeIcon filled={false} /> New Joke
            </button>
            <button
              onClick={() => joke && addToFavorites(joke)}
              className="text-white px-6 py-2 rounded-md flex items-center gap-2 bg-gray-400 hover:bg-gray-500 transition-colors"
              disabled={loading || !joke}
            >
              <HeartIcon filled={false} /> Add to Favorites
            </button>
          </div>
        </div>
      )}

      {activeTab === "favorites" && (
        <FavoritesList
          favorites={favorites}
          onRemove={removeFromFavorites}
          onUpdateRating={updateRating}
        />
      )}
    </div>
  )
}
