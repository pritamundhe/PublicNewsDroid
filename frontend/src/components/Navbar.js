import React from "react";

const Navbar = () => {
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 py-4 border-b shadow-sm">
      {/* Top left: Date and e-Paper */}
      <div className="flex items-center space-x-4 text-sm mb-2 md:mb-0">
        <span>April 8, 2025</span>
        <a href="#" className="text-red-700 font-semibold">
          e-Paper
        </a>
      </div>

      {/* Center: Logo and Navigation */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1 text-4xl font-serif font-bold">
          <span>PUBLIC NEWS DROID</span>
        </div>

        {/* Nav Links */}
        <nav className="mt-2 flex flex-wrap justify-center gap-4 text-md font-semibold">
          {[
            "India",
            "World",
            "Movies",
            "Sport",
            "Data",
            "Health",
            "Opinion",
            "Science",
            "Business",
            "Premium",
          ].map((item) => (
            <a
              key={item}
              href="#"
              className={`hover:text-red-700 ${
                item === "Sport" ? "text-red-700" : ""
              } flex items-center`}
            >
              {item === "Premium" ? (
                <>
                  <span className="bg-yellow-400 rounded-full px-2 text-black font-bold text-xs mr-1">
                    TH
                  </span>
                  Premium
                </>
              ) : (
                item
              )}
            </a>
          ))}
        </nav>
      </div>

      {/* Top Right: Icons + Actions */}
      <div className="flex items-center space-x-4 text-sm mt-2 md:mt-0">
        {/* Menu icon */}
        <button className="md:hidden">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Search */}
        <div className="flex items-center space-x-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <span>Search</span>
        </div>

        {/* Login */}
        <div className="flex items-center space-x-1">
          <span>LOGIN</span>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5.121 17.804A9 9 0 1112 21v-2a7 7 0 10-7-7h-2a9 9 0 012.121 5.804z"
            />
          </svg>
        </div>


        {/* Subscribe */}
        <button className="bg-red-700 text-white px-4 py-1 rounded">
          SUBSCRIBE
        </button>
      </div>
    </header>
  );
};

export default Navbar;
