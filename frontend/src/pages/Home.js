import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Home = () => {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="bg-gray-100 min-h-screen font-times">
            {/* Header */}
            <Navbar />
    
            {/* Main Content */}
            <main className="font-inter container mx-auto px-4 md:px-8 lg:px-16 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
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

                <section className="lg:col-span-3">
                    {loading ? (
                        <p className="text-center text-gray-500">Loading news...</p>
                    ) : (
                        <>
                            {news.length > 0 && news[0].location?.city && (
                                <div className="mb-4">
                                    <h2 className="text-red-500 font-bold text-2xl">{news[0].location.city}</h2>
                                </div>
                            )}

                            {/* News Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {news.length > 0 ? (
                                    news.map((item, index) => (
                                        <article key={index} className="bg-white border border-gray-100 overflow-hidden">
                                            {/* Image Section */}
                                            <div className="relative">
                                                <img src={`https://picsum.photos/800/400?random=${index}`} alt="News Thumbnail" className="w-full h-48 object-cover" />
                                                
                                                {/* Overlay Content */}
                                                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-end p-4">
                                                    <h2 className="text-red-400 font-bold text-sm">{item.category}</h2>
                                                    <h1 className="text-white text-xl font-bold">{item.title}</h1>
                                                    <p className="text-gray-200 text-xs">{formatDate(item.createdAt)}</p>
                                                </div>
                                            </div>

                                            {/* Content Below Image */}
                                            <div className="p-6">
                                                <p className="text-gray-500 text-sm md:text-base mb-4">{item.content}</p>
                                                <p className="text-gray-500 text-xs">Author: {item.author?.username || "Anonymous"}</p>
                                            </div>
                                        </article>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">No news available</p>
                                )}
                            </div>
                        </>
                    )}
                </section>

                {/* Sidebar - Latest News */}
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