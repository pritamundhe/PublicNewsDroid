import React from "react";
import { Link } from "react-router-dom";

const LayoutTwo = ({ news, formatDate, startIndex }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,_auto)]">
    {news.map((item, index) => {
      const layoutType = index % 6;
      const isBig = layoutType === 2;
      const cardHeight = isBig ? "h-72" : "h-48";
      const colSpan = isBig ? "col-span-1 sm:col-span-2" : "";
      const imgUrl = `https://picsum.photos/600/400?random=${startIndex + index}`;

      return (
        <Link to={`/newsdetail/${item._id}`} key={index}>
          <div
            className={`relative rounded-xl overflow-hidden shadow-md hover:shadow-xl transition duration-300 transform hover:scale-[1.02] cursor-pointer ${colSpan}`}
          >
            {/* Background Image with Overlay */}
            <div className={`relative ${cardHeight} w-full`}>
              <img
                src={imgUrl}
                alt="News"
                className="w-full h-full object-cover brightness-[.6]"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute bottom-0 w-full p-6 space-y-4 text-white">
              {/* Category and Trending Badge */}
              <div className="flex gap-2 text-xs">
                <span className="bg-red-500 px-2 py-0.5 rounded">{item.category}</span>
                {item.isTrending && (
                  <span className="bg-yellow-400 text-black px-2 py-0.5 font-bold rounded">🔥 Trending</span>
                )}
              </div>

              {/* Title */}
              <h2 className="text-lg font-bold mt-2">{item.title}</h2>

              {/* Content Preview */}
              <p className="text-sm">{item.summary}...</p>

              {/* Tags */}
              {item.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 text-xs">
                  {item.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-0.5 bg-blue-50 border border-blue-200 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Poll */}
              {item.poll?.question && (
                <div className="mt-2">
                  <p className="text-sm font-semibold">📊 {item.poll.question}</p>
                  <ul className="mt-1 space-y-1 text-xs">
                    {item.poll.options.map((opt, i) => (
                      <li key={i}>• {opt.text} ({opt.votes} votes)</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Footer */}
              <div className="flex justify-between text-xs mt-3 text-gray-300">
                <span>By <span className="font-medium">{item.author?.username || "Anonymous"}</span></span>
                <span>{formatDate(item.createdAt)} • 👁️ {item.views || 0}</span>
              </div>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
);

export default LayoutTwo;
