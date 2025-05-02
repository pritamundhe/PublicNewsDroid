import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [loggedIn, SetloggedIn] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      SetloggedIn(loggedIn => true);
    }
  }, [])
  return (
    <header className="flex flex-col md:flex-row items-center justify-between px-4 py-4 border-b shadow-sm">
      <div className="flex items-center space-x-4 text-sm mb-2 md:mb-0 font-times">
        <span>{new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</span>
        <a href="/epaper" className="text-red-700 font-semibold">
          e-Paper
        </a>
      </div>

      {/* Center: Logo and Navigation */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1 text-4xl font-serif font-bold">
         <Link to='/'>
          <span>PUBLIC NEWS DROID</span>
         </Link> 
        </div>


      </div>

      {/* Top Right: Icons + Actions */}
      <div className="flex items-center space-x-4 text-sm mt-2 md:mt-0 mr-9">
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

        <div >
          <Link to="/subscription">
            <button className="bg-red-700 hover:bg-red-500 text-white px-4 py-1 rounded">
              SUBSCRIBE
            </button>
          </Link>

          {loggedIn == true ? (
            <div className="mt-2 text-center font-semibold font-times">
              <Link to='/profile'>
                <span>PROFILE</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-1 mt-2 text-center font-semibold font-times">
              <Link to='/login'>
                <span>LOGIN</span>
              </Link>
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
          )

          }

        </div>
      </div>
    </header>
  );
};

export default Navbar;
