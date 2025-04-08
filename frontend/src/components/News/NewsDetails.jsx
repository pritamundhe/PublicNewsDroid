import React from "react";

export default function NewsDetail() {
    return (
        <div className="flex px-36 py-10 gap-10">
            <div className="max-w-6xl mx-auto font-serif text-gray-900 w-3/4">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-4">
                    <span className="hover:underline cursor-pointer text-gray-700">HOME</span> / <span className="hover:underline cursor-pointer text-gray-700">NEWS</span> / <span className="text-red-600 font-semibold">INDIA</span>
                </div>

                {/* Headline */}
                <h1 className="text-4xl font-bold leading-snug">
                    Mallikarjun Kharge slams BJP for appropriating Patel’s legacy, recalls he banned RSS
                </h1>

                {/* Subheadline */}
                <p className="mt-3 text-lg text-gray-700 font-medium">
                    There was almost daily correspondence between the two. Nehruji used to take his advice on all matters. Nehruji had immense respect for Patel sahab, says Mallikarjun Kharge
                </p>

                {/* Metadata */}
                <p className="mt-4 text-sm text-gray-500">
                    <span className="text-red-600 font-semibold">Published</span> – April 08, 2025 03:47 pm IST – Ahmedabad
                </p>

                {/* Icons */}
                <div className="flex items-center gap-6 mt-4 text-gray-600">
                    <button className="hover:text-black"><i className="fas fa-share"></i> Share</button>
                    <button className="hover:text-black"><i className="far fa-comment"></i> Comment</button>
                    <button className="hover:text-black"><i className="far fa-bookmark"></i> Read Later</button>
                    <button className="hover:text-black"><i className="fas fa-print"></i> Print</button>
                </div>

                {/* Image */}
                <div className="my-8">
                    <img
                        src="https://images.indianexpress.com/2023/09/congress-kharge-rahul-sonia.jpg" // Placeholder
                        alt="Mallikarjun Kharge with Sonia and Rahul Gandhi"
                        className="w-full rounded-lg shadow-lg"
                    />
                </div>

                {/* Body Text */}
                <div className="text-lg leading-relaxed">
                    <p className="mb-4">
                        Congress President Mallikarjun Kharge on Monday accused the BJP of appropriating Sardar Vallabhbhai Patel’s legacy while ignoring the latter’s contributions and the decisions he took as Home Minister.
                    </p>
                    <p className="mb-4">
                        Addressing a gathering in Ahmedabad, Kharge said, "There was almost daily correspondence between Nehru and Patel. Nehruji used to take his advice on all matters."
                    </p>
                    <p className="mb-4">
                        He added that Nehru had immense respect for Patel and followed his advice on matters of governance and administration.
                    </p>
                    <p className="mb-4">
                        The Congress leader also pointed out that it was Sardar Patel who had imposed a ban on the RSS following Mahatma Gandhi’s assassination.
                    </p>
                </div>


            </div>
            <div className=" w-1/4">
                <div className="border-t border-b py-4">
                    <h3 className="text-lg font-bold text-red-600 mb-4">Most Popular</h3>
                    <ul className="space-y-4">
                        <li className="text-sm hover:underline cursor-pointer">
                            Saif Ali Khan hotel brawl case: Court re-issues bailable warrant against Malaika Arora
                        </li>
                        <li className="text-sm hover:underline cursor-pointer">
                            All you need to know about: dysthymia
                        </li>
                        <li className="text-sm hover:underline cursor-pointer">
                            Bengal school appointments row: Rahul Gandhi urges President Murmu to ensure those selected fairly get to keep job
                        </li>
                        <li className="text-sm hover:underline cursor-pointer">
                            India overtakes Germany to become 3rd-largest generator of wind, solar
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
