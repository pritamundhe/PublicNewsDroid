import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white text-center py-10">
        <h1 className="text-4xl font-bold">Welcome to Public News Droid</h1>
        <p className="text-lg mt-2">Your one-stop platform for the latest news updates.</p>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Latest News</h2>
          <p className="text-gray-700">Stay updated with the most recent and trending news from around the world.</p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Categories</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Politics</li>
            <li>Technology</li>
            <li>Sports</li>
            <li>Entertainment</li>
            <li>Health</li>
          </ul>
        </section>
      </main>

      <footer className="bg-gray-800 text-white text-center py-4">
        <p className="text-sm">© 2024 Public News Droid. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
