"use client"

import { useState } from "react"
import type { Joke } from "@/lib/types"
import StarIcon from "./StarIcon"
import TrashIcon from "./TrashIcon"

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
            className="block appearance-none w-full bg-black border border-gray-300 hover:border-gray-400 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="newest">Newest First</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
            <TrashIcon />
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
                    <StarIcon filled={(joke.rating || 0) >= star} />
                  </button>
                ))}
              </div>

              <button
                onClick={() => onRemove(joke.id)}
                className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  <line x1="10" y1="11" x2="10" y2="17" />
                  <line x1="14" y1="11" x2="14" y2="17" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

