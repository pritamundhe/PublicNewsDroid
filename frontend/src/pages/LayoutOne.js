import React from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

// Increment view count when a news card is clicked
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
    {/* ------------------ Hero Section ------------------ */}
    {news[0] && (
      <Link
        to={`/newsdetail/${news[0]._id}`}
        onClick={() => incrementView(news[0]._id)}
      >
        <div className="relative h-[450px] overflow-hidden shadow-lg rounded-xl cursor-pointer">
          <img
            src={Array.isArray(news[0].images) && news[0].images[0]
                ? news[0].images[0]
                : `https://picsum.photos/600/400?random=${startIndex}`}
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

            {/* Hero Title and Side Stories */}
            <div className="flex flex-col md:flex-row md:space-x-6 mt-4">
              <div className="md:w-1/2">
                <img
                src={Array.isArray(news[0].images) && news[0].images[0]
                ? news[0].images[0]
                : `https://picsum.photos/seed/${startIndex}/200/140`}
                  alt={news[0].title}
                  className="rounded-lg object-cover w-[200px] h-[140px] mb-2"
                />
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs font-semibold text-[#5f6368]">{news[0].source}</span>
                </div>
                <h2 className="text-lg font-normal text-[#f1f3f4] leading-tight max-w-[280px]">
                  {news[0].title.length > 90 ? news[0].title.substring(0, 87) + '...' : news[0].title}
                </h2>
                <p className="text-xs text-[#ccc] mt-2">{formatDate(news[0].createdAt)}</p>
              </div>

              <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col space-y-4">
                {news.slice(1, 4).map((item, i) => (
                  <article key={i}>
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs font-semibold text-white">{item.source}</span>
                    </div>
                    <p className="text-sm text-white max-w-[320px] leading-snug">
                      {item.title.length > 100 ? item.title.substring(0, 97) + '...' : item.title}
                    </p>
                    <p className="text-xs text-white mt-1">{formatDate(item.createdAt)}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 pt-4 border-t border-white/20">
              <button className="flex items-center space-x-2 text-xs text-white bg-[#f1f3f4]/20 rounded-full px-3 py-1" type="button">
                <span>Full coverage</span>
              </button>
            </div>
          </div>
        </div>
      </Link>
    )}

    {/* ------------------ News Cards Section ------------------ */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {news.slice(1).map((item, index) => (
        <Link
          to={`/newsdetail/${item._id}`}
          onClick={() => incrementView(item._id)}
          key={index}
        >
          <div className="group bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer">
            <img
              src={Array.isArray(item.images) && item.images[0]
                ? item.images[0]
                : `https://picsum.photos/400/300?random=${startIndex + index + 1}`}
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
              <p className="text-sm text-gray-600">{item.summary?.slice(0, 100)}...</p>

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
