import React from "react";

const Footer = () => {
  const sections = [
    {
      title: "Public News Droid",
      links: [
        "About Us",
        "Code of Editorial Values",
        "News Archive",
        "Sitemap",
        "Print Subscription",
        "Digital Subscription",
        "Subscribe to Newsletters",
        "Rss Feeds",
        "Readers Editor–Terms of Reference",
        "Authors & Contributors",
        "Gift Front page",
      ],
      contact: ["Contact Us", "Social Media", "Advertise with us"],
    },
    {
      title: "Other Products",
      links: ["RoofandFloor", "STEP", "Images", "Classifieds – Print", "Bookstore & Special Publications"],
      extraTitle: "Popular Sections",
      extraLinks: [
        "Elections",
        "Latest News",
        "National News",
        "International News",
        "Videos",
        "Life & Style",
        "Food",
        "Podcast",
      ],
    },
    {
      title: "Business",
      links: ["Agri–Business", "Industry", "Economy", "Markets", "Budget"],
      extraTitle: "Sport",
      extraLinks: ["Cricket", "Football", "Hockey", "Tennis", "Athletics", "Motorsport", "Races", "Other Sports"],
    },
    {
      title: "States",
      links: ["Andhra Pradesh", "Karnataka", "Kerala", "Tamil Nadu", "Telangana"],
      extraTitle: "Cities",
      extraLinks: [
        "Bengaluru",
        "Chennai",
        "Coimbatore",
        "Delhi",
        "Hyderabad",
        "Kochi",
        "Kolkata",
        "Kozhikode",
        "Madurai",
      ],
    },
    {
      title: "Trending on The Public News Droid",
      links: [
        "News",
        "India News",
        "Entertainment news",
        "Trump Tariff announcements LIVE",
        "Sports, IPL 2025 News",
        "Delhi news",
        "Live news",
        "Google news sitemap",
        "Update sitemap",
      ],
    },
    {
      title: "Trending on Group sites",
      links: [
        "Stock Market Live Updates",
        "IPL 2025 – SS",
        "Stocks to buy today",
        "Domestic cricket",
        "Gold Rate Today",
        "Silver Rate Today",
        "Arvind Kejriwal Exclusive Interview",
        "Editor’s Note: Putting Muslims in their place?",
        "Frontline Current Issue",
      ],
    },
  ];

  return (
    <footer className="bg-gray-100 text-black px-6 py-10">
      {/* Logo */}
      <div className="mb-6 text-center">
        <div className="flex justify-center items-center space-x-2 text-4xl font-serif font-bold">
          <span>PUBLIC NEWS DROID</span>
        </div>
      </div>

      {/* Sectioned links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 text-sm">
        {sections.map((sec, i) => (
          <div key={i}>
            <h3 className="font-bold border-t-4 border-black inline-block pt-2">{sec.title}</h3>
            <ul className="mt-2 space-y-1">
              {sec.links.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:underline">
                    {link}
                    {link.toLowerCase().includes("news") ||
                    link.toLowerCase().includes("update") ? (
                      <span className="text-red-600 ml-1">↗</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
            {sec.extraTitle && (
              <>
                <h3 className="font-bold mt-4">{sec.extraTitle}</h3>
                <ul className="mt-1 space-y-1">
                  {sec.extraLinks.map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="hover:underline">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {sec.contact && (
              <>
                <h3 className="font-bold mt-4">Contact us</h3>
                <ul className="mt-1 space-y-1">
                  {sec.contact.map((link, idx) => (
                    <li key={idx}>
                      <a href="#" className="hover:underline font-semibold">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        ))}
      </div>

      {/* App Store Buttons */}
      <div className="mt-10 flex justify-center gap-4">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
          alt="Google Play"
          className="h-10"
        />
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="App Store"
          className="h-10"
        />
      </div>
    </footer>
  );
};

export default Footer;
