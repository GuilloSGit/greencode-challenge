"use client"

import type { Joke } from "@/lib/types"
import TrashIcon from "./SVG/TrashIcon"
import StarIcon from "./SVG/StarIcon"
import { useSortedFavorites } from "@/hooks/useSortedFavorites"

interface FavoritesListProps {
  favorites: Joke[]
  onRemove: (id: string) => void
  onUpdateRating: (id: string, rating: number) => void
}

export default function FavoritesList({ favorites, onRemove, onUpdateRating }: FavoritesListProps) {
  const { sortBy, setSortBy, sortedFavorites } = useSortedFavorites(favorites);

  if (favorites.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-100 rounded-lg">
        <p className="text-gray-600">You haven't saved any jokes yet.</p>
        <p className="text-gray-500 text-sm mt-2">
          Find a joke you like and click "Add to Favorites" to save it here.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-medium">Your Favorite Jokes</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-sm text-gray-600">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "newest" | "highest" | "lowest")}
            className="p-1 border rounded text-sm text-white bg-gray-800"
          >
            <option value="newest">Newest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        {sortedFavorites.map((joke) => (
          <div key={joke.id} className="bg-gray-800 rounded-lg p-4">
            <p className="text-white mb-4">{joke.value}</p>
            
            <div className="flex justify-between items-center">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => onUpdateRating(joke.id, star)}
                    className="focus:outline-none"
                  >
                    <StarIcon filled={star <= (joke.rating || 0)} />
                  </button>
                ))}
              </div>
              <button
                onClick={() => onRemove(joke.id)}
                className="text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon filled={false} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
