import React from "react";
import { CiShare1 } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { IoPrintSharp } from "react-icons/io5";
import { BiLike, BiDislike } from "react-icons/bi";
import SmallNewsCover from "./SmallNewsCover";
import { useState, useEffect } from "react";
import toast from 'react-hot-toast';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';


export default function NewsDetail() {
    const [news, setNews] = useState([]);
    const [showComments, setShowComments] = useState(false);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const userId = localStorage.getItem('userId');
    const { id } = useParams();
    const [currentNews, setCurrentNews] = useState(null);

    useEffect(() => {
        const getCurrentNews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/news/fetchcurrentnews/${id}`);
                setCurrentNews(response.data);
            }
            catch (err) {
                console.log(err);
            }
        }
        getCurrentNews();
    }, [id])

    useEffect(() => {
        const getComments = async () => {
            if (!currentNews) return;
            try {
                const response = await axios.get(`http://localhost:5000/news/fetchcomments/${currentNews._id}`);
                setComments(response.data.comments);
                console.log(response.data.comments);
            }
            catch (err) {
                console.log(err);
            }
        }
        getComments();
    }, [id])



    useEffect(() => {
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
    }, [userId]);

    return (
        <div>
            <Navbar />
            <div className="flex px-60 py-10 gap-4">
                <div className="max-w-6xl mx-auto font-times text-gray-900 w-3/4">
                    <div className="text-sm text-gray-500 mb-6">
                        <span className="hover:underline cursor-pointer text-gray-700">HOME</span> / <span className="hover:underline cursor-pointer text-gray-700">NEWS</span> / <span className="text-red-600 font-semibold">INDIA</span>
                    </div>
                    {currentNews ? (
                        <div>
                            <h1 className="text-3xl font-bold leading-snug ">
                                {currentNews.title}
                            </h1>

                            <p className="mt-3 text-lg text-gray-700 font-medium">
                                {currentNews.summary}
                            </p>

                            <p className="mt-2 text-sm text-gray-500">
                                <span className="text-red-600 font-semibold">Published</span> – {new Date(currentNews.createdAt).toLocaleDateString()} IST – {currentNews.location.city}
                            </p>

                            <div className="flex justify-between mt-4 text-gray-600">
                                <div className="flex  gap-3 pl-3">

                                    <button
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator
                                                    .share({
                                                        title: document.title,
                                                        url: window.location.href,
                                                    })
                                                    .then(() => console.log("Shared successfully"))
                                                    .catch((err) => console.error("Share failed:", err));
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                toast.success("Link copied to clipboard!");
                                            }
                                        }}
                                        className="hover:text-black"
                                    >
                                        <CiShare1 size={24} />
                                    </button>

                                    <button className="hover:text-black" onClick={() => setShowComments(!showComments)}><FaRegCommentAlt size={18} /></button>

                                </div>
                                <button className="hover:text-black pr-3 flex items-center"><IoPrintSharp size={20} /> Print</button>
                            </div>

                            <div className=" mt-2">
                                <img
                                    src={currentNews.images[0]}
                                    alt="Mallikarjun Kharge with Sonia and Rahul Gandhi"
                                    className="w-full rounded-lg shadow-lg"
                                />
                            </div>
                            <div className="flex justify-end mt-1 gap-3 text-gray-600 mb-8 pr-4">

                                <button className="hover:text-red-500 text-black"><BiLike size={24} /></button>

                                <button className="hover:text-red-500 text-black"><BiDislike size={24} /></button>
                            </div>
                            <div className="text-lg leading-relaxed">
                                <div
                                    className="text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: currentNews?.content }}
                                />

                            </div>
                            {showComments && (
                                <div className="mt-8 border-t pt-4">
                                    <h3 className="text-xl font-semibold mb-4">Join the Conversation</h3>

                                    <ReactQuill
                                        theme="snow"
                                        value={commentText}
                                        onChange={(value) => setCommentText(value)}
                                        className="w-full border rounded p-2 mb-2"
                                    />
                                    <button
                                        onClick={() => {
                                            if (commentText.trim() !== '') {
                                                setComments([{ text: commentText }, ...comments]);
                                                setCommentText('');
                                            }
                                        }}
                                        className="bg-black text-white px-4 py-2 rounded mb-6"
                                    >
                                        Post Comment
                                    </button>

                                    <div>
                                        {comments.map((c, i) => (
                                            <div key={i} className="mb-4 border-b pb-2">
                                                <div className="font-semibold">{c.userId.username}</div>
                                                <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                                                <p className="mt-1 text-gray-800">{c.content}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}


                        </div>
                    ) : (
                        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
                    )}


                </div>
                <div className=" w-1/4">
                    <div >
                        <h3 className="text-lg font-bold font-times text-red-600 mb-1">Read More</h3>
                        <h2 className='bg-gray-400 h-[1px] rounded-lg w-full'></h2>
                        {news.slice(0, 5).map((item, index) => (
                            <div key={index}>
                                <Link to={`/newsdetail/${item._id}`} key={index}>
                                    <SmallNewsCover title={item.title} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
