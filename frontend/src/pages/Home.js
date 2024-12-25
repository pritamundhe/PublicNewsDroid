import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-100">
      {/* Header Section */}
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo Section */}
          <div className="flex items-center">
            <img
              src="https://storage.googleapis.com/a1aa/image/nUf23lI61UUAdqAA97SlAwCX8PbbE7OYEkfpnPGDiPNxmaenA.jpg"
              alt="Logo"
              width="50"
              height="50"
              className="mr-2"
            />
            <span className="text-xl font-bold text-blue-600">Public News Droid</span>
          </div>

          {/* Search Bar */}
          <div className="flex items-center">
            <input
              type="text"
              placeholder="What are you looking for?"
              className="border px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button className="px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              Search
            </button>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <button aria-label="Messages" className="text-gray-500 hover:text-blue-600">
              <i className="fas fa-envelope"></i>
            </button>
            <button aria-label="User Profile" className="text-gray-500 hover:text-blue-600">
              <i className="fas fa-user-circle"></i>
            </button>
          </div>
        </div>

        {/* Navigation Bar */}
        <nav className="bg-gray-50">
          <div className="container mx-auto px-4 py-4">
            <ul className="flex justify-center flex-wrap gap-2">
              {[
                'Life Style',
                'Travel',
                'Coding',
                'Music',
                'Sports',
                'Design',
                'Mobile',
                'Health',
              ].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block bg-white text-gray-700 font-medium py-2 px-6 shadow hover:text-blue-600 hover:shadow-lg transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Placeholder for additional content */}
        <p className="text-center text-gray-600">Add your main content here!</p>
      </div>
    </div>
  );
};

export default Home;
