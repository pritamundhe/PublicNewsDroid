import React from "react";
import { CiShare1 } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { IoPrintSharp } from "react-icons/io5";
import { BiLike ,BiDislike } from "react-icons/bi";
import SmallNewsCover from "./SmallNewsCover";

export default function NewsDetail() {
    return (
        <div>
            <Navbar />
            <div className="flex px-60 py-10 gap-4">
                <div className="max-w-6xl mx-auto font-times text-gray-900 w-3/4">
                    <div className="text-sm text-gray-500 mb-6">
                        <span className="hover:underline cursor-pointer text-gray-700">HOME</span> / <span className="hover:underline cursor-pointer text-gray-700">NEWS</span> / <span className="text-red-600 font-semibold">INDIA</span>
                    </div>
                    <h1 className="text-3xl font-bold leading-snug ">
                        Mallikarjun Kharge slams BJP for appropriating Patel’s legacy, recalls he banned RSS
                    </h1>

                    <p className="mt-3 text-lg text-gray-700 font-medium">
                        There was almost daily correspondence between the two. Nehruji used to take his advice on all matters. Nehruji had immense respect for Patel sahab, says Mallikarjun Kharge
                    </p>

                    <p className="mt-2 text-sm text-gray-500">
                        <span className="text-red-600 font-semibold">Published</span> – April 08, 2025 03:47 pm IST – Ahmedabad
                    </p>

                    <div className="flex justify-between mt-4 text-gray-600">
                        <div className="flex  gap-3 pl-3">

                        <button className="hover:text-black"><CiShare1 size={24} /></button>
                        <button className="hover:text-black"><FaRegCommentAlt size={18} /></button>
                        
                        </div>
                        <button className="hover:text-black pr-3 flex items-center"><IoPrintSharp size={20}/> Print</button>
                    </div>

                    <div className=" mt-2">
                        <img
                            src="https://fastly.picsum.photos/id/1001/800/400.jpg?hmac=Di70UG4-ZQd4h6nrjisWmoMC_hx45vyqiVNrBDWz3F8"
                            alt="Mallikarjun Kharge with Sonia and Rahul Gandhi"
                            className="w-full rounded-lg shadow-lg"
                        />
                    </div>
                    <div className="flex justify-end mt-1 gap-3 text-gray-600 mb-8 pr-4">

                        <button className="hover:text-red-500 text-black"><BiLike size={24}  /></button>

                        <button className="hover:text-red-500 text-black"><BiDislike size={24}/></button>
                    </div>
                    <div className="text-lg leading-relaxed">
                        <p className="mb-4">
                            Congress President Mallikarjun Kharge on Monday accused the BJP of appropriating Sardar Vallabhbhai Patel’s legacy while ignoring the latter’s contributions and the decisions he took as Home Minister.
                        </p>
                        <p className="mb-4">
                            Addressing a gathering in Ahmedabad, Kharge said, "There was almost daily correspondence between Nehru and Patel. Nehruji used to take his advice on all matters."
                        
                            He added that Nehru had immense respect for Patel and followed his advice on matters of governance and administration.
                        </p>
                        <p className="mb-4">
                            The Congress leader also pointed out that it was Sardar Patel who had imposed a ban on the RSS following Mahatma Gandhi’s assassination.
                        </p>
                    </div>


                </div>
                <div className=" w-1/4">
                    <div >
                        <h3 className="text-lg font-bold font-times text-red-600 mb-1">Read More</h3>
                        <h2 className='bg-gray-400 h-[1px] rounded-lg w-full'></h2>
                        <SmallNewsCover />
                        <SmallNewsCover />
                        <SmallNewsCover />
                        <SmallNewsCover />
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
