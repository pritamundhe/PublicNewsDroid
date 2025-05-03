import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import axios from "axios";

const Home = () => {
  const [news, setNews] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("Local");

  const newsPerPage = 10;
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const url = userId
      ? `http://localhost:5000/news/fetch?userid=${userId}`
      : `http://localhost:5000/news/fetch`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const approvedNews = data.filter((item) => item.status != "Rejected");
          setNews(approvedNews);
        } else {
          console.error("API response is not an array:", data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setLoading(false);
      });
  }, [userId]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/news/gethighlights")
      .then((res) => {
        if (res.data.success) {
          const filterValid = (arr) => arr.filter((item) => item.status != "Rejected");
          setTopPicks(filterValid(res.data.topPicks));
          setLatestNews(filterValid(res.data.latestNews));
        }
      })
      .catch((err) => {
        console.error("Error fetching highlights:", err);
      });
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const filteredNews =
    selectedCategory === "All"
      ? news.filter((item) => item.status != "Rejected")
      : news.filter(
        (item) =>
          item.status !== "Rejected" &&
          item.category
            ?.split("/")
            .map((cat) => cat.trim().toLowerCase())
            .includes(selectedCategory.toLowerCase())
      );
  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + newsPerPage);

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="bg-gray-100">
        <div className="bg-gray-50 py-3 border-b shadow-sm font-times">
          <nav className="mt-2 flex flex-wrap justify-center gap-4 text-lg">
            {[
              "Local",
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
              <button
                key={item}
                onClick={() => setSelectedCategory(item)}
                className={`hover:text-red-700 ${selectedCategory === item ? "text-red-700 underline" : ""
                  } flex items-center`}
              >
                {item === "Premium" ? (
                  <>
                    <span className="bg-yellow-400 px-2 text-black font-bold text-xs mr-1">
                      TH
                    </span>
                    Premium
                  </>
                ) : (
                  item
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="bg-[#f2f7fc] min-h-screen p-4 font-[Roboto]">
          <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:space-x-6">
            {/* Left Side */}
            <main className="flex-1">
              <header className="mb-6">
                <h1 className="text-3xl font-medium text-[#202124]">
                  Your briefing
                </h1>
                <p className="text-base text-[#5f6368] mt-1">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
              </header>

              {/* Top Stories */}
              <section className="bg-white rounded-md p-4 mb-6 border border-gray-400">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[#1a56db] text-xl font-medium flex items-center space-x-1">
                    <span>Top stories</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="#1a56db"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </h2>
                </div>

                <div className="flex flex-col md:flex-row md:space-x-6">
                  {/* Main Story */}
                  {news[0] && (
                    <Link to={`/newsdetail/${news[0]._id}`} className="md:w-1/2">
                      <div className="cursor-pointer">
                        <img
                          src={
                            news[0]?.images?.[0] ||
                            "https://via.placeholder.com/200x140"
                          }
                          alt={news[0]?.title}
                          className="rounded-sm object-cover w-[350px] h-[180px] mb-2"
                        />
                        <div className="text-sm text-[#5f6368] mb-1">
                          {news[0]?.author?.firstname || "Unknown Author"} •{" "}
                          {timeAgo(news[0].createdAt)}
                        </div>
                        <h2 className="text-lg font-medium text-[#202124] leading-tight max-w-[280px]">
                          {news[0]?.title.slice(0, 100)}...
                        </h2>
                      </div>
                    </Link>
                  )}

                  {/* Secondary Stories */}
                  <div className="md:w-1/2 mt-6 md:mt-0 flex flex-col space-y-4">
                    {news.slice(1, 4).map((item, index) => (
                      <Link to={`/newsdetail/${item._id}`} key={index}>
                        <article className="cursor-pointer">
                          <div className="text-sm text-[#5f6368] mb-1">
                            {item?.author?.username || "Unknown Author"} •{" "}
                            {timeAgo(item.createdAt)}
                          </div>
                          <p className="text-base text-[#202124] max-w-[320px] leading-snug">
                            {item?.title.slice(0, 100)}...
                          </p>
                        </article>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
              {/* Highlighted News (from topPicks) - displayed anonymously */}
              {filteredNews.length > 0 && (
                <section className="bg-white rounded-md p-4 mb-6 border border-transparent">
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredNews.map((item) => (
                      <Link to={`/news/${item._id}`} key={item._id}>
                        <div className="bg-[#f8fafc] hover:bg-white shadow hover:shadow-lg transition p-4 rounded-lg border border-gray-200">
                          {item.images?.[0] && (
                            <img
                              src={item.images[0]}
                              alt={item.title}
                              className="w-full h-48 object-cover rounded mb-3"
                            />
                          )}
                          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                            {item.summary}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {timeAgo(item.createdAt)}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

            </main>

            {/* Right Sidebar */}
            <aside className="lg:w-[300px] hidden lg:block space-y-4">
              <h2 className="text-xl font-semibold text-[#202124] border-b pb-2">
                Top Picks
              </h2>
              {topPicks.slice(0, 5).map((item, idx) => (
                <div key={idx} className="bg-white p-3 rounded-md shadow-sm">
                  <Link to={`/newsdetail/${item._id}`}>
                    <h3 className="text-base font-semibold text-[#202124] leading-tight">
                      {item.title.slice(0, 60)}...
                    </h3>
                    <p className="text-sm text-[#5f6368] mt-1">
                      {timeAgo(item.createdAt)}
                    </p>
                  </Link>
                </div>
              ))}
            </aside>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
