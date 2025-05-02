import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import LayoutOne from "./LayoutOne";
import LayoutTwo from "./LayoutTwo";
import LayoutThree from "./LayoutThree";
import axios from 'axios'

const Home = () => {
  const [news, setNews] = useState([]);
  const [topPicks, setTopPicks] = useState([]);
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutIndex] = useState(Math.floor(Math.random() * 3)); // Random layout each refresh
  const newsPerPage = 10;
  const [selectedCategory, setSelectedCategory] = useState("Local");


  // Get userId from localStorage
  const userId = localStorage.getItem('userId');  // Get userId from localStorage

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:5000/news/fetch?userid=${userId}`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNews(data);
          } else {
            console.error('API response is not an array:', data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching news:', error);
          setLoading(false);
        });
    } else {
      fetch(`http://localhost:5000/news/fetch`)
        .then(response => response.json())
        .then(data => {
          if (Array.isArray(data)) {
            setNews(data);
          } else {
            console.error('API response is not an array:', data);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching news:', error);
          setLoading(false);
        });
    }
  }, [userId]);

  const incrementView = async (newsId) => {
    try {
      await fetch(`http://localhost:5000/news/increment-view/${newsId}`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error("Failed to increment view:", error);
    }
  };

  useEffect(() => {
    axios.get("http://localhost:5000/news/gethighlights")
      .then((res) => {
        if (res.data.success) {
          setTopPicks(res.data.topPicks);
          setLatestNews(res.data.latestNews);
        }
      })
      .catch((error) => {
        console.error("Error fetching highlights:", error);
      });
  }, []);


  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);


  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const filteredNews = selectedCategory === "All"
    ? news
    : news.filter(item =>
      item.category
        ?.split(',')
        .map(cat => cat.trim().toLowerCase())
        .includes(selectedCategory.toLowerCase())
    );

  const totalPages = Math.ceil(filteredNews.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const currentNews = filteredNews.slice(startIndex, startIndex + newsPerPage);


  const renderLayout = () => {
    switch (layoutIndex) {
      case 0: return <LayoutOne news={currentNews} formatDate={formatDate} startIndex={startIndex} />;
      case 1: return <LayoutTwo news={currentNews} formatDate={formatDate} startIndex={startIndex} />;
      case 2: return <LayoutThree news={currentNews} formatDate={formatDate} startIndex={startIndex} />;
      default: return null;
    }
  };

  return (
    <div className=" min-h-screen">
      <Navbar />
      <div className="bg-gray-100">

        <div className="bg-gray-50 py-2 border-b shadow-sm font-times">
          {/* Nav Links */}
          <nav className="mt-2 flex flex-wrap justify-center gap-4 text-md font-semibold">
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
                    <span className="bg-yellow-400 rounded-full px-2 text-black font-bold text-xs mr-1">TH</span>
                    Premium
                  </>
                ) : (
                  item
                )}
              </button>
            ))}

          </nav>
        </div>
        <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6 bg-gray-100">
          {/* Left Sidebar - Top Picks */}
          <aside className="lg:col-span-1 hidden lg:block space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Top Picks</h2>
            {topPicks.slice(0, 5).map((item, index) => (
              <div key={index} className="bg-white p-2 rounded shadow">
                <Link
                  to={`/newsdetail/${item._id}`}
                  onClick={() => incrementView(item._id)}
                  key={index}
                >
                  <h3 className="text-sm font-semibold">{item.title.slice(0, 50)}...</h3>
                  <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                </Link>
              </div>
            ))}
          </aside>

          {/* Main Content */}
          <section className="lg:col-span-3">
            {loading ? <p >Loading news...
              <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mt-4">
              </div></p> : renderLayout()}
          </section>

          {/* Right Sidebar - Latest News */}
          <aside className="lg:col-span-1 hidden lg:block space-y-4">
            <h2 className="text-xl font-bold border-b pb-2">Latest News</h2>
            {latestNews.slice(-5).reverse().map((item, index) => (
              <div key={index} className="bg-white p-2 rounded shadow">
                <Link
                  to={`/newsdetail/${item._id}`}
                  onClick={() => incrementView(item._id)}
                  key={index}
                >
                  <h3 className="text-sm font-semibold">{item.title.slice(0, 50)}...</h3>
                  <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
                </Link>
              </div>
            ))}
          </aside>

          <div className="flex justify-center items-center my-4 space-x-4 text-sm  ">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-white border shadow rounded disabled:opacity-50 hover:text-red-800"
            >
              Prev
            </button>
            <span className="font-semibold ml-20 ">Page <span className="text-red-500"> {currentPage}</span> of {totalPages}</span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-white border shadow rounded disabled:opacity-50 hover:text-red-800"
            >
              Next
            </button>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
