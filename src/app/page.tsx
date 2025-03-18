import JokeApp from "@/components/joke-app"

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-amber-50 to-orange-100">
      <div className="max-w-3xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-orange-800">Chuck Norris Jokes</h1>
          <p className="text-orange-700 mt-2">Because Chuck Norris doesn't tell jokes, he tells facts.</p>
        </header>

        <JokeApp />
      </div>
    </main>
  )
}

