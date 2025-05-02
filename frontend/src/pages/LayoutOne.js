import React from "react";
import { Link } from "react-router-dom";
import { ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";

const LayoutOne = ({ news, formatDate, startIndex }) => (
  <div className="bg-[#f2f7fc] min-h-screen p-4">
    <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:space-x-6">
      <main className="flex-1">
        <header className="mb-6">
          <h1 className="text-2xl font-normal text-[#202124]">Your briefing</h1>
          <p className="text-sm text-[#5f6368] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </header>

        {/* Top Story Section */}
        {news[0] && (
          <section className="bg-white rounded-2xl p-4 mb-6 border border-transparent">
            <div className="flex items-center justify-between mb-4">
              <Link className="text-[#1a56db] text-lg font-normal flex items-center space-x-1" to="#">
                <span>Top stories</span>
                <svg aria-hidden="true" className="w-4 h-4" fill="none" stroke="#1a56db" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M9 18l6-6-6-6"></path>
                </svg>
              </Link>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-6">
              <div className="md:w-1/2">
                <img src={`https://picsum.photos/seed/${startIndex}/200/140`} alt={news[0].title} className="rounded-lg object-cover w-[200px] h-[140px] mb-2" />
                <div className="flex items-center space-x-1 mb-1">
                  <span className="text-xs font-semibold text-[#5f6368]">{news[0].source}</span>
                </div>
                <h2 className="text-lg font-normal text-[#202124] leading-tight max-w-[280px]">
                  {news[0].title.length > 90 ? news[0].title.substring(0, 87) + '...' : news[0].title}
                </h2>
                <p className="text-xs text-[#5f6368] mt-2">{formatDate(news[0].createdAt)}</p>
              </div>
              <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col space-y-4">
                {news.slice(1, 4).map((item, i) => (
                  <article key={i}>
                    <div className="flex items-center space-x-1 mb-1">
                      <span className="text-xs font-semibold text-[#5f6368]">{item.source}</span>
                    </div>
                    <p className="text-sm text-[#202124] max-w-[320px] leading-snug">
                      {item.title.length > 100 ? item.title.substring(0, 97) + '...' : item.title}
                    </p>
                    <p className="text-xs text-[#5f6368] mt-1">{formatDate(item.createdAt)}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-4 pt-4 border-t border-[#dadce0]">
              <button className="flex items-center space-x-2 text-xs text-[#3c4043] bg-[#f1f3f4] rounded-full px-3 py-1" type="button">
                <span>Full coverage</span>
              </button>
            </div>
          </section>
        )}

        {/* Additional News Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.slice(4).map((item, index) => (
            <Link to={`/newsdetail/${item._id}`} key={index}>
              <div className="group bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden">
                <img
                  src={`https://picsum.photos/seed/${startIndex + index}/400/240`}
                  alt={item.title}
                  className="w-full h-[180px] object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-[#202124] mb-1 group-hover:text-blue-600">
                    {item.title.length > 80 ? item.title.substring(0, 77) + '...' : item.title}
                  </h3>
                  <p className="text-sm text-[#5f6368] mb-2">{formatDate(item.createdAt)}</p>
                  <div className="flex items-center text-xs text-gray-500 space-x-4">
                    <div className="flex items-center space-x-1">
                      <ThumbsUp size={14} /> <span>{item.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ThumbsDown size={14} /> <span>{item.dislikes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageSquare size={14} /> <span>{item.comments?.length || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  </div>
);

export default LayoutOne;