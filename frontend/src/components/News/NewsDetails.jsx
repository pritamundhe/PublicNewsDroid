import React, { useState, useEffect } from "react";
import { CiShare1 } from "react-icons/ci";
import { FaRegCommentAlt } from "react-icons/fa";
import Navbar from "../Navbar";
import Footer from "../Footer";
import { IoPrintSharp } from "react-icons/io5";
import { BiLike, BiDislike } from "react-icons/bi";
import SmallNewsCover from "./SmallNewsCover";
import toast from 'react-hot-toast';
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function NewsDetail() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [replyText, setReplyText] = useState('');
    const [replyingTo, setReplyingTo] = useState(null);
    const [pollLoading, setPollLoading] = useState(false);
    const [currentNews, setCurrentNews] = useState(null);
    const [userVote, setUserVote] = useState(null);

    const userId = localStorage.getItem('userId');
    const { id } = useParams();

    useEffect(() => {
        const getCurrentNews = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/news/fetchcurrentnews/${id}`);
                setCurrentNews(response.data);
                setUserVote(response.data.userVote);
            } catch (err) {
                console.log(err);
            }
        };
        getCurrentNews();
    }, [id]);

    useEffect(() => {
        if (!currentNews) return;
        const getComments = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/news/fetchcomments/${currentNews._id}`);
                setComments(response.data.comments);
            } catch (err) {
                console.log(err);
            }
        };
        getComments();
    }, [currentNews]);

    useEffect(() => {
        fetch(`http://localhost:5000/news/fetch?userid=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setNews(data);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching news:', error);
                setLoading(false);
            });
    }, [userId]);

    const handleComment = async () => {
        try {
            const response = await axios.post("http://localhost:5000/news/addcomment", {
                newsId: id,
                content: commentText,
                userId
            });
            if (response) {
                setCommentText("");
                const updated = await axios.get(`http://localhost:5000/news/fetchcomments/${id}`);
                setComments(updated.data.comments);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleReply = async (commentId) => {
        try {
            const response = await axios.post("http://localhost:5000/news/addreply", {
                newsId: id,
                parentCommentId: commentId,
                content: replyText,
                userId
            });
            if (response) {
                setReplyText('');
                setReplyingTo(null);
                const updated = await axios.get(`http://localhost:5000/news/fetchcomments/${id}`);
                setComments(updated.data.comments);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleCommentVote = async (commentId, type) => {
        try {
            const response = await axios.post("http://localhost:5000/news/votecomment", {
                commentId,
                userId,
                type
            });
            if (response) {
                const updated = await axios.get(`http://localhost:5000/news/fetchcomments/${id}`);
                setComments(updated.data.comments);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handlePoll = async (type) => {
        if (pollLoading) return;
        setPollLoading(true);
        const newVote = userVote === type ? null : type;

        try {
            const response = await axios.post("http://localhost:5000/news/updatePoll", {
                newsId: currentNews._id,
                type: newVote,
            });

            if (response) {
                let supportCount = currentNews.poll?.supportCount || 0;
                let opposeCount = currentNews.poll?.opposeCount || 0;

                if (userVote === 'support') supportCount--;
                if (userVote === 'oppose') opposeCount--;

                if (newVote === 'support') supportCount++;
                if (newVote === 'oppose') opposeCount++;

                setCurrentNews(prev => ({
                    ...prev,
                    poll: { supportCount, opposeCount }
                }));

                setUserVote(newVote);
                toast.success(`You ${newVote ? `voted ${newVote}` : 'removed your vote'}`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Failed to update vote.');
        } finally {
            setPollLoading(false);
        }
    };

    // Filter sidebar news by keyword match
    const filteredNews = currentNews && currentNews.keywords?.length > 0
        ? news.filter(item =>
            item._id !== currentNews._id &&
            item.keywords?.some(kw => currentNews.keywords.includes(kw))
        )
        : [];

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
                            <h1 className="text-3xl font-bold leading-snug">{currentNews.title}</h1>
                            <p className="mt-3 text-lg text-gray-700 font-medium">{currentNews.summary}</p>
                            <p className="mt-2 text-sm text-gray-500">
                                <span className="text-red-600 font-semibold">Published</span> – {new Date(currentNews.createdAt).toLocaleDateString()} IST – {currentNews.location?.city || 'Unknown'}
                            </p>

                            <div className="flex justify-between mt-4 text-gray-600">
                                <div className="flex gap-3 pl-3">
                                    <button onClick={() => {
                                        if (navigator.share) {
                                            navigator.share({ title: document.title, url: window.location.href });
                                        } else {
                                            navigator.clipboard.writeText(window.location.href);
                                            toast.success("Link copied to clipboard!");
                                        }
                                    }}>
                                        <CiShare1 size={24} />
                                    </button>
                                    <FaRegCommentAlt size={18} className="cursor-pointer" />
                                </div>
                                <button className="flex items-center">
                                    <IoPrintSharp size={20} /> Print
                                </button>
                            </div>

                            <div className="mt-2">
                                <img src={currentNews.images?.[0]} alt={currentNews.title} className="w-full rounded-lg shadow-lg" />
                            </div>

                            <div className="flex justify-end mt-1 gap-3 text-gray-600 mb-8 pr-4">
                                <button className="hover:text-red-500 text-black"><BiLike size={24} /></button>
                                <button className="hover:text-red-500 text-black"><BiDislike size={24} /></button>
                            </div>

                            <div className="text-lg leading-relaxed" dangerouslySetInnerHTML={{ __html: currentNews.content }} />

                            {/* Poll Section */}
                            <div className="mt-8 border-t pt-6">
                                <h3 className="text-xl font-semibold mb-4">🗳️ Poll: Do you support this news?</h3>
                                <div className="flex border border-gray-400 divide-x divide-gray-400 rounded overflow-hidden font-medium text-black">
                                    <button onClick={() => handlePoll('support')} disabled={pollLoading}
                                        className={`flex items-center justify-center gap-2 w-1/2 px-6 py-3 ${userVote === 'support' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                                        <BiLike size={20} /> Support ({currentNews.poll?.supportCount ?? 0})
                                    </button>
                                    <button onClick={() => handlePoll('oppose')} disabled={pollLoading}
                                        className={`flex items-center justify-center gap-2 w-1/2 px-6 py-3 ${userVote === 'oppose' ? 'bg-gray-200' : 'hover:bg-gray-100'}`}>
                                        <BiDislike size={20} /> Oppose ({currentNews.poll?.opposeCount ?? 0})
                                    </button>
                                </div>
                            </div>

                            {/* Comments */}
                            <div className="mt-8 border-t pt-4">
                                <h3 className="text-xl font-semibold mb-4">Join the Conversation</h3>
                                <ReactQuill theme="snow" value={commentText} onChange={setCommentText} className="w-full border rounded p-2 mb-2" />
                                <button onClick={handleComment} className="bg-black text-white px-4 py-2 rounded mb-6">Post Comment</button>

                                <div>
                                    {comments.length > 0 ? comments.map((c, i) => (
                                        <div key={i} className="mb-6 border-b pb-2">
                                            <div className="flex justify-between">
                                                <div className="font-semibold">{c.userId?.username || 'Anonymous'}</div>
                                                <div className="text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</div>
                                            </div>
                                            <div className="mt-1" dangerouslySetInnerHTML={{ __html: c.content }} />
                                            <div className="flex justify-between items-center mt-2 text-gray-600">
                                                <button onClick={() => setReplyingTo(c._id)} className="text-blue-600 hover:underline">Reply</button>
                                                <div className="flex gap-4">
                                                    <button onClick={() => handleCommentVote(c._id, 'like')}><BiLike size={24} /> {c.likes || 0}</button>
                                                    <button onClick={() => handleCommentVote(c._id, 'dislike')}><BiDislike size={24} /> {c.dislikes || 0}</button>
                                                </div>
                                            </div>
                                            {replyingTo === c._id && (
                                                <div className="mt-2">
                                                    <ReactQuill theme="snow" value={replyText} onChange={setReplyText} className="w-full border rounded p-2 mb-2" />
                                                    <button onClick={() => handleReply(c._id)} className="bg-blue-600 text-white px-3 py-1 rounded">Submit Reply</button>
                                                </div>
                                            )}
                                        </div>
                                    )) : <p className="text-gray-500">No comments yet. Be the first to share your thoughts!</p>}
                                </div>
                            </div>
                        </div>
                    ) : <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>}
                </div>

                {/* Sidebar */}
                <div className="w-1/4">
                    <h3 className="text-lg font-bold font-times text-red-600 mb-1">Read More</h3>
                    <hr className="bg-gray-400 h-[1px] rounded-lg w-full mb-4" />
                    {filteredNews.length > 0 ? (
                        filteredNews.slice(0, 5).map((item, index) => (
                            <Link to={`/newsdetail/${item._id}`} key={index}>
                                <SmallNewsCover title={item.title} />
                            </Link>
                        ))
                    ) : (
                        <p className="text-gray-500">No related news found.</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
