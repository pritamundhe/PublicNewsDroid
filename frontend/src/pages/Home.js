import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import LayoutOne from "./LayoutOne";
import LayoutTwo from "./LayoutTwo";
import LayoutThree from "./LayoutThree";

const Home = () => {
  const [news, setNews] = useState([]); // Initialize news as an empty array
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [layoutIndex] = useState(Math.floor(Math.random() * 3)); // Random layout each refresh
  const newsPerPage = 10;

  // Get userId from localStorage
  const userId = localStorage.getItem('userId');  // Get userId from localStorage

  useEffect(() => {
    if (userId) {
      // Fetch news using the userId from localStorage
      fetch(`http://localhost:5000/news/fetch?userid=${userId}`)
        .then(response => response.json())
        .then(data => {
          // Ensure data is an array before setting it to state
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
          // Ensure data is an array before setting it to state
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
  }, [userId]);  // Depend on userId to ensure it's loaded from localStorage

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const totalPages = Math.ceil(news.length / newsPerPage);
  const startIndex = (currentPage - 1) * newsPerPage;
  const currentNews = news.slice(startIndex, startIndex + newsPerPage);

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

      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6 bg-gray-100">

        {/* Left Sidebar - Top Picks */}
        <aside className="lg:col-span-1 hidden lg:block space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Top Picks</h2>
          {news.slice(0, 5).map((item, index) => (
            <div key={index} className="bg-white p-2 rounded shadow">
              <Link to={`/newsdetail/${item._id}`} key={index}>
                <h3 className="text-sm font-semibold">{item.title.slice(0, 50)}...</h3>
                <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
              </Link>
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-3">
          {loading ? <p>Loading news...</p> : renderLayout()}
        </section>

        {/* Right Sidebar - Latest News */}
        <aside className="lg:col-span-1 hidden lg:block space-y-4">
          <h2 className="text-xl font-bold border-b pb-2">Latest News</h2>
          {news.slice(-5).reverse().map((item, index) => (
            <div key={index} className="bg-white p-2 rounded shadow">
              <Link to={`/newsdetail/${item._id}`} key={index}>
                <h3 className="text-sm font-semibold">{item.title.slice(0, 50)}...</h3>
                <p className="text-xs text-gray-500">{formatDate(item.createdAt)}</p>
              </Link>
            </div>
          ))}
        </aside>

      </main>

      <Footer />
    </div>
  );
};

export default Home;
