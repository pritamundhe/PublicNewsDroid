import React from "react";
import { Link } from "react-router-dom";

const incrementView = async (newsId) => {
  try {
    await fetch(`http://localhost:5000/news/increment-view/${newsId}`, {
      method: 'PUT',
    });
  } catch (error) {
    console.error("Failed to increment view:", error);
  }
};

const LayoutThree = ({ news, formatDate, startIndex }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
    {news.map((item, index) => (
      <Link
        to={`/newsdetail/${item._id}`}
        onClick={() => incrementView(item._id)}
        key={index}
      >
        <div className="group bg-white rounded-3xl shadow-lg overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl duration-300 cursor-pointer">
          <div className="relative">
            <img
              src={`https://picsum.photos/500/300?random=${startIndex + index}`}
              className="w-full h-48 object-cover rounded-t-3xl"
              alt="News"
            />
            <span className="absolute top-4 left-4 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase">
              {item.category}
            </span>
          </div>
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 hover:text-red-600 group-hover:underline transition duration-200">
              {item.title}
            </h2>
            <p className="text-sm text-gray-700">{item.summary}...</p>
            <p className="text-xs text-gray-400">
              By <span className="font-medium">{item.author?.username || "Anonymous"}</span> • {formatDate(item.createdAt)}
            </p>
          </div>
        </div>
      </Link>
    ))}
  </div>
);

export default LayoutThree;
