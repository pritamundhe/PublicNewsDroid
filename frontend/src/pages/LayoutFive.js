import React from "react";

const LayoutFive = ({ news, formatDate, startIndex }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main Story Column */}
            {/* <div className="col-span-2 space-y-6">
                <div>
                    <h3 className="text-xs font-bold text-pink-700 uppercase">{mainNews.category}</h3>
                    <h1 className="text-3xl font-black leading-snug">{mainNews.title}</h1>
                    <p className="text-sm text-gray-700 mt-2">{mainNews.summary}</p>
                    <img
                        src={mainNews.imgUrl}
                        alt="Main News"
                        className="mt-4 w-full h-64 object-cover rounded"
                    />
                </div>
            </div> */}

            {/* Latest News Column */}
            <div className="col-span-1 border-l pl-4">
                <h2 className="text-xl font-bold text-red-800 mb-4">Latest News</h2>
                <div className="relative pl-4 border-l border-gray-300 space-y-6">
                    {news.map((item, i) => (
                        <div key={i} className="relative">
                            <span className="absolute left-[-9px] top-1 w-2 h-2 bg-black rounded-full"></span>
                            <p className="text-[11px] text-gray-500">{item.time} — <span className="font-medium">{item.tag}</span></p>
                            <h4 className="text-sm font-semibold leading-snug text-gray-900 hover:underline cursor-pointer">
                                {item.title}
                            </h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LayoutFive;
