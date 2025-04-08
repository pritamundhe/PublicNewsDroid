import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";

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

    // Function to format the "createdAt" date
    const formatDate = (dateString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dateString).toLocaleDateString("en-US", options);
    };

    return (
        <div className="bg-gray-100 min-h-screen">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                <span className="text-sm text-gray-500">March 3, 2025</span>
                <div className="font-inter font-bold text-2xl text-gray-500">
                    <h1>Public News Droid</h1>
                </div>
                <div className="flex space-x-4">
                    <a href="#" className="text-gray-500">Search</a>
                    <a href="#" className="text-gray-500">Login</a>
                    <a href="/subscription" className="bg-red-500 text-white px-4 py-1">Subscribe</a>
                </div>
            </header>
            

            {/* Navigation */}
            <nav className="font-inter bg-white border-b border-gray-200 py-2 px-4 flex justify-center space-x-4 overflow-x-auto">
                {["India", "World", "Movies", "Sport", "Data", "Health", "Opinion", "Science", "Business", "Premium"].map(category => (
                    <a key={category} href="#" className="text-gray-400 hover:text-red-500 whitespace-nowrap">{category}</a>
                ))}
            </nav>

            {/* Main Content */}
            <main className="font-inter container mx-auto px-4 md:px-8 lg:px-16 py-6 grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Sidebar - Premium Section */}
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

                {/* News Section - Extra Width (lg:col-span-3) */}
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

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-6">
                <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
                    <div>
                        <h2 className="text-lg font-bold mb-2">PUBLIC NEWS DROID</h2>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold mb-2">Editorial</h2>
                        <p className="text-gray-500">Thought-provoking opinions</p>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold mb-2">Analysis</h2>
                        <p className="text-gray-500">In-depth perspectives</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;