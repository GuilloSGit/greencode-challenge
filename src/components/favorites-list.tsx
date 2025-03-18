"use client"

import { useState } from "react"
import type { Joke } from "@/lib/types"
import TrashIcon from "./SVG/TrashIcon"
import ArrowIcon from "./SVG/ArrowIcon"
import StarIcon from "./SVG/StarIcon"

interface FavoritesListProps {
  favorites: Joke[]
  onRemove: (id: string) => void
  onUpdateRating: (id: string, rating: number) => void
}

export default function FavoritesList({ favorites, onRemove, onUpdateRating }: FavoritesListProps) {
  const [sortBy, setSortBy] = useState<"newest" | "highest" | "lowest">("newest")

  const sortedFavorites = [...favorites].sort((a, b) => {
    if (sortBy === "highest") {
      return (b.rating || 0) - (a.rating || 0)
    } else if (sortBy === "lowest") {
      return (a.rating || 0) - (b.rating || 0)
    }
    // Default: newest first (assuming the newest are at the end of the array)
    return 0 // Keep original order
  })

  if (favorites.length === 0) {
    return (
      <div className="p-6 text-center bg-black rounded-lg shadow-md">
        <p className="text-gray-500">You haven't favorited any jokes yet.</p>
        <p className="text-gray-500 mt-2">Find a joke you like and click the Favorite button!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="block appearance-none w-full bg-gray-500 border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <ArrowIcon filled={false} />
          </div>
        </div>
      </div>

      {sortedFavorites.map((joke) => (
        <div key={joke.id} className="p-4 bg-black rounded-lg shadow-md">
          <div className="flex flex-col gap-3">
            <p>{joke.value}</p>

            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => onUpdateRating(joke.id, star)} className="focus:outline-none">
                    <StarIcon filled={star <= (joke.rating || 0)} />
                  </button>
                ))}
              </div>

              <button
                onClick={() => onRemove(joke.id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <TrashIcon filled={false} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

