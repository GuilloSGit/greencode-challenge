import Head from 'next/head'; // Import Head from next/head
import JokeApp from "@/components/joke-app";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        {/* Include the scripts here */}
        <script src="node_modules/@material-tailwind/html/scripts/tabs.js"></script>
        <script src="https://unpkg.com/@material-tailwind/html@latest/scripts/tabs.js"></script>
      </Head>
      <header className="border-b py-4">
        <div className="container">
          <h1 className="text-2xl font-bold text-center">Chuck Norris Jokes</h1>
        </div>
      </header>
      <main className="flex-1 container py-8 px-4 justify-center">
        <JokeApp />
      </main>
    </div>
  );
}
