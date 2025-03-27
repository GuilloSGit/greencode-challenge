"use client"

import { useState, useEffect } from "react"
import FavoritesList from "./favorites-list"
import HeartIcon from "./SVG/HeartIcon"
import NewJokeIcon from "./SVG/NewJokeIcon"
import WhatsAppIcon from "./SVG/WhatsAppIcon"
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
    <div className="container mx-auto max-w-2xl p-4" role="main">
      <h1 className="text-3xl font-bold mb-8 text-center">Chuck Norris Jokes</h1>
      
      {/* Tabs navigation - accesible tabs */}
      <div className="flex w-full mb-6 border-b" role="tablist">
        <button
          role="tab"
          aria-selected={activeTab === "random"}
          aria-controls="random-panel"
          id="random-tab"
          className={`flex-1 py-2 text-center border-b-2 ${
            activeTab === "random"
              ? "border-primary font-medium"
              : "border-transparent hover:border-primary/30"
          }`}
          onClick={() => setActiveTab("random")}
        >
          Random Joke
        </button>
        <button
          role="tab"
          aria-selected={activeTab === "favorites"}
          aria-controls="favorites-panel"
          id="favorites-tab"
          className={`flex-1 py-2 text-center border-b-2 ${
            activeTab === "favorites"
              ? "border-primary font-medium"
              : "border-transparent hover:border-primary/30"
          }`}
          onClick={() => setActiveTab("favorites")}
        >
          Favorites ({favorites.length})
        </button>
      </div>

      {/* Random Joke Panel */}
      <div 
        id="random-panel" 
        role="tabpanel" 
        aria-labelledby="random-tab"
        hidden={activeTab !== "random"}
      >
        {activeTab === "random" && (
          <div className="space-y-6">
            <div className="p-6 rounded-lg shadow-md bg-black">
              {loading ? (
                <p className="text-white text-center" aria-live="polite">Loading joke...</p>
              ) : joke ? (
                <p className="text-lg text-white" aria-live="polite">{joke.value}</p>
              ) : (
                <p aria-live="assertive">Error loading joke. Please try again.</p>
              )}
            </div>

            <div className="flex gap-2 justify-center">
              <button
                onClick={getNewJoke}
                className="text-white px-6 py-2 rounded-md flex items-center gap-2 bg-orange-400 hover:bg-orange-500 transition-colors"
                disabled={loading}
                aria-label="Get a new joke"
              >
                <NewJokeIcon filled={false} /> New Joke
              </button>
              <button
                onClick={() => joke && addToFavorites(joke)}
                className={`text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  loading || !joke || favorites.some(fav => fav.id === joke?.id)
                    ? "bg-transparent border-2 border-gray-300 text-gray-700"
                    : "bg-gray-400 hover:bg-gray-500"
                }`}
                disabled={loading || !joke || favorites.some(fav => fav.id === joke?.id)}
                aria-label={favorites.some(fav => fav?.id === joke?.id) 
                  ? "Joke already in favorites" 
                  : "Add this joke to favorites"}
              >
                <HeartIcon filled={favorites.some(fav => fav.id === joke?.id)} /> Add to Favorites
              </button>
              <button
                onClick={() => {
                  if (joke) {
                    const encodedText = encodeURIComponent(joke.value);
                    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
                  }
                }}
                className={`text-white px-6 py-2 rounded-md flex items-center gap-2 transition-colors ${
                  loading || !joke 
                  ? "bg-transparent border-2 border-green-500 text-green-500"
                  : "bg-green-600 hover:bg-green-700"
                }`}
                disabled={loading || !joke}
                title="Share this joke on WhatsApp"
                aria-label="Share this joke on WhatsApp"
              >
                <WhatsAppIcon filled={true} /> Share on WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Favorites Panel */}
      <div 
        id="favorites-panel" 
        role="tabpanel" 
        aria-labelledby="favorites-tab"
        hidden={activeTab !== "favorites"}
      >
        {activeTab === "favorites" && (
          <FavoritesList
            favorites={favorites}
            onRemove={removeFromFavorites}
            onUpdateRating={updateRating}
          />
        )}
      </div>
    </div>
  )
}
