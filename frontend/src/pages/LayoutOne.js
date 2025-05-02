import React from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const incrementView = async (newsId) => {
    try {
      await fetch(`http://localhost:5000/news/increment-view/${newsId}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error("Failed to increment view:", error);
    }
  };

const LayoutOne = ({ news, formatDate, startIndex }) => (
  <div className="space-y-12">
    {/* Hero Section */}
    {news[0] && (
      <Link
        to={`/newsdetail/${news[0]._id}`}
        onClick={() => incrementView(news[0]._id)}
      >
        <div className="relative h-[450px] overflow-hidden shadow-lg rounded-xl cursor-pointer">
          <img
            src={`https://picsum.photos/800/400?random=${startIndex}`}
            alt="Hero News"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80 flex flex-col justify-end p-6 rounded-xl">
            <div className="flex items-center gap-2 text-sm text-white">
              <span className="text-red-400 font-bold uppercase">{news[0].category}</span>
              {news[0].isTrending && (
                <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold rounded-sm">TRENDING</span>
              )}
              {news[0].source && (
                <span className="bg-white/20 px-2 py-0.5 text-xs rounded">{news[0].source}</span>
              )}
            </div>
            <h1 className="text-white text-4xl md:text-5xl font-extrabold mt-2">{news[0].title}</h1>
            <p className="text-gray-300 text-sm mt-3">{formatDate(news[0].createdAt)}</p>
            <button className="mt-4 px-6 py-2 bg-red-600 text-white font-semibold hover:bg-red-700 transition duration-300 rounded-md">
              Read More
            </button>
          </div>
        </div>
      </Link>
    )}

    {/* News Cards Section */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.slice(1).map((item, index) => (
        <Link
          to={`/newsdetail/${item._id}`}
          onClick={() => incrementView(item._id)}
          key={index}
        >
          <div className="group bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
            <img
              src={`https://picsum.photos/400/300?random=${startIndex + index + 1}`}
              className="w-full h-48 object-cover"
              alt="News"
            />
            <div className="p-5 space-y-3">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-red-500 text-xs font-semibold uppercase tracking-wide">{item.category}</span>
                {item.isTrending && (
                  <span className="bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold rounded-sm">🔥 Trending</span>
                )}
                {item.source && (
                  <span className="bg-gray-100 px-2 py-0.5 text-xs rounded text-gray-600">{item.source}</span>
                )}
              </div>

              <h2 className="text-lg font-semibold text-gray-800 group-hover:text-red-600 transition duration-200">
                {item.title}
              </h2>
              <p className="text-sm text-gray-600">{item.summary.slice(0, 100)}...</p>

              {item.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((keyword, i) => (
                    <span key={i} className="bg-gray-100 border text-gray-700 text-xs px-2 py-1 rounded">
                      #{keyword}
                    </span>
                  ))}
                </div>
              )}

              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs text-blue-600">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {item.poll?.question && (
                <div className="mt-2">
                  <p className="text-sm font-semibold text-gray-800">📊 {item.poll.question}</p>
                  <ul className="mt-1 space-y-1 text-xs text-gray-600">
                    {item.poll.options.map((opt, i) => (
                      <li key={i}>• {opt.text} ({opt.votes} votes)</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={14} className="text-green-500" /> {item.likes || 0}
                  <ThumbsDown size={14} className="text-red-500 ml-3" /> {item.dislikes || 0}
                  <MessageSquare size={14} className="text-blue-500 ml-3" /> {item.comments?.length || 0}
                </div>
                <span>{formatDate(item.createdAt)} • 👁️ {item.views || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

export default LayoutOne;
