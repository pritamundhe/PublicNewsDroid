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
    <header className="glass-panel flex flex-col md:flex-row items-center justify-between px-6 py-4 sticky top-0 z-50 animate-fade-in transition-all duration-300 border-b border-white/10">
      <div className="flex items-center space-x-4 text-sm mb-2 md:mb-0 font-sans text-stone-300">
        <span>{new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</span>
        <a href="/epaper" className="text-white font-semibold hover:text-amber-200 transition">
          e-Paper
        </a>
      </div>

      {/* Center: Logo and Navigation */}
      <div className="flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center space-x-1">
          <span className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-200 to-stone-400 tracking-wider drop-shadow-sm">
            PUBLIC NEWS DROID
          </span>
        </div>
      </div>

      {/* Top Right: Icons + Actions */}
      <div className="flex items-center space-x-6 text-sm mt-2 md:mt-0 mr-4 font-sans font-medium text-stone-200">
        {/* Menu icon */}
        <button className="md:hidden text-stone-300 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div>
          {loggedIn === true ? (
            <div className="mt-2 text-center">
              <Link to='/profile' className="hover:text-amber-200 transition-colors">
                <span>PROFILE</span>
              </Link>
            </div>
          ) : (
            <div className="flex items-center space-x-2 mt-2 text-center">
              <Link to='/login' className="hover:text-amber-200 transition-colors flex items-center gap-1 group">
                <span>LOGIN</span>
                <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A9 9 0 1112 21v-2a7 7 0 10-7-7h-2a9 9 0 012.121 5.804z" />
                </svg>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
