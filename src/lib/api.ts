import type { Joke } from "./types"

export async function fetchRandomJoke(): Promise<Joke> {
  const response = await fetch("https://api.chucknorris.io/jokes/random")

  if (!response.ok) {
    throw new Error(`Failed to fetch joke: ${response.status}`)
  }

  return response.json()
}
