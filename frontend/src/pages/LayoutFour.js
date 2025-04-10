const LayoutFour = ({ news, formatDate, startIndex }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {news.map((item, index) => (
            <div key={index} className="bg-white shadow-lg border rounded overflow-hidden">
                <img
                    src={`https://picsum.photos/300/200?random=${startIndex + index}`}
                    className="w-full h-40 object-cover"
                    alt="News Thumbnail"
                />
                <div className="p-4">
                    <h2 className="text-red-500 font-bold text-sm">{item.category}</h2>
                    <h1 className="text-lg font-semibold">{item.title}</h1>
                    <p className="text-sm text-gray-600">{item.content.slice(0, 100)}...</p>
                    <p className="text-xs text-gray-400 mt-1">By {item.author?.username || "Anonymous"} • {formatDate(item.createdAt)}</p>
                </div>
            </div>
        ))}
    </div>
);

export default LayoutFour;
