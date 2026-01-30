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
    <footer className="glass-panel mt-12 px-6 py-12 animate-fade-in text-white/80 border-t border-white/10">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="flex justify-center items-center space-x-2">
          <span className="text-4xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-stone-200 to-stone-400 tracking-wider">
            PUBLIC NEWS DROID
          </span>
        </div>
      </div>

      {/* Sectioned links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8 text-sm max-w-[1200px] mx-auto">
        {sections.map((sec, i) => (
          <div key={i}>
            <h3 className="font-bold border-t-2 border-white/20 inline-block pt-2 mb-3 text-white">{sec.title}</h3>
            <ul className="space-y-2">
              {sec.links.map((link, idx) => (
                <li key={idx}>
                  <a href="/" className="hover:text-amber-200 transition-colors text-white/60 hover:underline decoration-white/30">
                    {link}
                    {link.toLowerCase().includes("news") ||
                      link.toLowerCase().includes("update") ? (
                      <span className="text-white/40 ml-1">↗</span>
                    ) : null}
                  </a>
                </li>
              ))}
            </ul>
            {sec.extraTitle && (
              <>
                <h3 className="font-bold mt-4 text-white">{sec.extraTitle}</h3>
                <ul className="mt-1 space-y-2">
                  {sec.extraLinks.map((link, idx) => (
                    <li key={idx}>
                      <a href="/" className="hover:text-amber-200 transition-colors text-white/60 hover:underline decoration-white/30">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {sec.contact && (
              <>
                <h3 className="font-bold mt-4 text-white">Contact us</h3>
                <ul className="mt-1 space-y-2">
                  {sec.contact.map((link, idx) => (
                    <li key={idx}>
                      <a href="/" className="hover:text-amber-200 transition-colors text-white/60 font-semibold">
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
      <div className="mt-12 flex justify-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/512px-Google_Play_Store_badge_EN.svg.png"
          alt="Google Play"
          className="h-10 cursor-pointer"
        />
        <img
          src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
          alt="App Store"
          className="h-10 cursor-pointer"
        />
      </div>
    </footer>
  );
};

export default Footer;
