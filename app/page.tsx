"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-center">
        Ballon d'Or Player Tracker
      </h1>

      <p className="text-lg mb-8 text-center max-w-xl">
        Track the performance of top football players like Haaland with live
        stats and dynamic graphs. Start visualizing their Ballon d'Or journey!
      </p>

      <Link
        href="/haaland"
        className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded shadow transition-colors"
      >
        View Haaland Graph
      </Link>
    </main>
  );
}
