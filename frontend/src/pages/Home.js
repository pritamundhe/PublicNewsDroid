import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 10;

    useEffect(() => {
        fetch("http://localhost:5000/news/fetch")
            .then(response => response.json())
            .then(data => {
                setNews(data);
                setLoading(false);
            })
            .catch(error => {
                console.error("Error fetching news:", error);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    const totalPages = Math.ceil(news.length / newsPerPage);
    const startIndex = (currentPage - 1) * newsPerPage;
    const currentNews = news.slice(startIndex, startIndex + newsPerPage);

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const getGridClass = (index) => {
        const gridLayouts = [
            "md:col-span-3 md:row-span-2", // Big hero
            "md:col-span-3 md:row-span-1", // Wide
            "md:col-span-3 md:row-span-1", // Small
            "md:col-span-2 md:row-span-1", // Small
            "md:col-span-4 md:row-span-1", // wide
            "md:col-span-3 md:row-span-1", // Medium
            "md:col-span-3 md:row-span-1", // Medium
            "md:col-span-2 md:row-span-1", // Small
            "md:col-span-2 md:row-span-1", // Small
            "md:col-span-2 md:row-span-1", // Small
        ];
        return gridLayouts[index] || "md:col-span-2";
    };

    return (
        <div className="bg-gray-100 min-h-screen font-times">
            <Navbar />

            <main className="font-inter container mx-auto px-4 md:px-8 lg:px-16 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Premium Sidebar */}
                <aside className="lg:col-span-1 hidden lg:block">
                    <h2 className="text-red-500 font-bold text-2xl mb-4">Premium</h2>
                    <div className="space-y-4">
                        {[1, 2].map(num => (
                            <div key={num} className="bg-white p-4 border">
                                <h3 className="font-semibold text-gray-700">Premium article {num}</h3>
                                <p className="text-gray-500 text-sm">Exclusive in-depth analysis.</p>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* News Cards Section */}
                <section className="lg:col-span-3">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading news...</p>
                    ) : (
                        <>
                            {currentNews.length > 0 && currentNews[0].location?.city && (
                                <div className="mb-4">
                                    <h2 className="text-red-500 font-bold text-2xl">
                                        {currentNews[0].location.city}
                                    </h2>
                                </div>
                            )}

                            {/* Collage Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-6 auto-rows-[220px] gap-4">
                                {currentNews.map((item, index) => (
                                    <article
                                        key={index}
                                        className={`relative bg-white border border-gray-200 shadow hover:shadow-xl transition-all duration-300 overflow-hidden ${getGridClass(index)}`}
                                    >
                                        <div className="relative h-full">
                                            <img
                                                src={`https://picsum.photos/800/400?random=${startIndex + index}`}
                                                alt="News Thumbnail"
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                                                <h2 className="text-red-400 font-bold text-sm">{item.category}</h2>
                                                <h1 className="text-white text-xl font-bold leading-tight">
                                                    {item.title}
                                                </h1>
                                                <p className="text-gray-300 text-xs">{formatDate(item.createdAt)}</p>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <p className="text-gray-700 text-sm mb-2">
                                                {item.content.slice(0, 100)}...
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Author: {item.author?.username || "Anonymous"}
                                            </p>
                                        </div>
                                    </article>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="mt-6 flex justify-center gap-4">
                                <button
                                    onClick={handlePrev}
                                    disabled={currentPage === 1}
                                    className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={handleNext}
                                    disabled={currentPage === totalPages}
                                    className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-red-300"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </section>

                {/* Latest News Sidebar */}
                <aside className="lg:col-span-1 hidden lg:block">
                    <h2 className="text-red-500 text-2xl font-bold mb-4">Latest News</h2>
                    <div className="space-y-4">
                        {["Latest news 1", "Latest news 2"].map((title, index) => (
                            <div key={index} className="bg-white p-4 border">
                                <h3 className="font-semibold text-gray-700">{title}</h3>
                                <p className="text-gray-500 text-sm">Breaking updates and analysis.</p>
                            </div>
                        ))}
                    </div>
                </aside>
            </main>

            <Footer />
        </div>
    );
};

export default Home;
