import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  // View counter handler
  const handleNewsClick = async (newsId) => {
    try {
      await axios.put(`http://localhost:5000/news/increment-view/${newsId}`);
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
    navigate(`/newsdetail/${newsId}`);
  };

  useEffect(() => {
    const url = userId
      ? `http://localhost:5000/news/fetch?userid=${userId}`
      : `http://localhost:5000/news/fetch`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const approvedNews = data.filter((item) => item.status !== "Rejected");
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
          const filterValid = (arr) => arr.filter((item) => item.status !== "Rejected");
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
      ? news
      : news.filter(
        (item) =>
          item.status !== "Rejected" &&
          item.category
            ?.split("/")
            .map((cat) => cat.trim().toLowerCase())
            .includes(selectedCategory.toLowerCase())
      );



  // Pagination Logic
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = filteredNews.slice(indexOfFirstNews, indexOfLastNews);

  return (
    <div className="min-h-screen text-stone-900 animate-fade-in pb-12">
      <Navbar />

      {/* Category Nav - Floating Glass Pills */}
      <div className="sticky top-[72px] z-40 py-4 mb-4">
        <nav className="max-w-[1400px] mx-auto px-6 overflow-x-auto no-scrollbar flex items-center gap-3">
          {[
            "Local", "India", "World", "Movies", "Sport",
            "Data", "Health", "Opinion", "Science", "Business", "Premium",
          ].map((item) => (
            <button
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${selectedCategory === item ? "bg-stone-200 text-stone-900 border-stone-300 shadow-md" : "bg-white/40 border-white/40 text-stone-600 hover:bg-white/80 hover:text-black"}`}
            >
              {item === "Premium" ? (
                <span className="flex items-center gap-1">
                  <span className="bg-gradient-to-r from-stone-500 to-stone-700 text-white font-bold text-[10px] px-1.5 py-0.5 rounded-sm">TH</span>
                  Premium
                </span>
              ) : item}
            </button>
          ))}
        </nav>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-8">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-auto lg:h-[calc(100vh-180px)] min-h-[600px]">

          {/* Column 1: Hero Section (Wide) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {news[0] ? (
              <div
                className="relative flex-1 rounded-[2.5rem] overflow-hidden group cursor-pointer border border-white/50 shadow-xl"
                onClick={() => handleNewsClick(news[0]._id)}
              >
                <div className="absolute inset-0 bg-black/10 z-10 group-hover:bg-black/5 transition-colors"></div>
                <img
                  src={news[0]?.images?.[0] || "https://via.placeholder.com/800x600"}
                  alt={news[0]?.title}
                  className="absolute inset-0 w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-20"></div>

                <div className="absolute bottom-0 left-0 p-8 z-30 w-full">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-white/90 text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-sm">
                      {news[0]?.category || "TOP STORY"}
                    </span>
                    <span className="text-white/90 text-sm font-medium backdrop-blur-md px-2 py-0.5 rounded-lg bg-black/20">
                      {timeAgo(news[0].createdAt)}
                    </span>
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-white leading-tight mb-4 drop-shadow-lg group-hover:text-stone-100 transition-colors">
                    {news[0]?.title}
                  </h1>
                  <p className="text-stone-200 text-lg line-clamp-2 max-w-2xl drop-shadow-md">
                    {news[0]?.summary}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex-1 rounded-[2.5rem] bg-stone-200 animate-pulse border border-white/50"></div>
            )}
          </div>

          {/* Column 2: Related/Feed (Narrow) */}
          <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/40 flex flex-col overflow-hidden shadow-sm">
            <h3 className="text-stone-800 font-bold text-lg mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-stone-400 animate-pulse"></span>
              Related News
            </h3>

            <div className="flex-1 overflow-y-auto pr-2 space-y-5 custom-scrollbar">
              {news.slice(1, 6).map((item, idx) => (
                <div key={idx} onClick={() => handleNewsClick(item._id, `/newsdetail/${item._id}`)} className="group cursor-pointer">
                  <div className="flex gap-4 items-start">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-stone-200 shadow-sm">
                      <img src={item.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] text-stone-500 font-bold uppercase mb-1">{item.category}</div>
                      <h4 className="text-sm font-semibold text-stone-900 leading-snug group-hover:text-stone-600 transition-colors line-clamp-3">
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 mt-2 block">{timeAgo(item.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 hover:text-stone-900 text-xs font-bold uppercase tracking-wider transition-colors border border-stone-200">
              View All
            </button>
          </div>

          {/* Column 3: Sidebar/Stats (Narrow) */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="flex-1 bg-white/60 backdrop-blur-xl rounded-[2.5rem] p-6 border border-white/40 flex flex-col shadow-sm">
              <div className="flex items-center justify-between mb-6 border-b border-stone-200 pb-4">
                <h3 className="text-stone-800 font-bold">Last News</h3>
                <button className="text-stone-400 hover:text-stone-600 text-sm">Popular</button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
                {topPicks.slice(0, 4).map((item, idx) => (
                  <div key={idx} onClick={() => handleNewsClick(item._id)} className="cursor-pointer group">
                    <div className="text-[10px] text-stone-400 mb-1 flex justify-between">
                      <span>{item.category || "General"}</span>
                      <span>{timeAgo(item.createdAt)}</span>
                    </div>
                    <h4 className="text-sm font-medium text-stone-700 group-hover:text-black transition-colors border-b border-stone-100 pb-3">
                      {item.title}
                    </h4>
                  </div>
                ))}
              </div>
            </div>

            {/* Mini Widget */}
            <div className="h-40 bg-gradient-to-br from-stone-100 to-white/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/50 flex flex-col justify-center items-center text-center shadow-sm">
              <h4 className="text-stone-800 font-bold text-lg mb-1">Subscribe</h4>
              <p className="text-xs text-stone-500 mb-3">Get the latest updates</p>
              <div className="flex gap-2 w-full">
                <input type="email" placeholder="Email" className="w-full bg-white/50 rounded-lg px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-300 border border-stone-200" />
                <button className="bg-stone-800 text-white p-2 rounded-lg hover:bg-stone-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      <Footer />
    </div >
  );
};

export default Home;
