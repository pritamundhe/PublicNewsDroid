import React, { useState, useEffect } from 'react';
import Navbar from '../Navbar';
import Footer from '../Footer';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineMarkEmailRead } from "react-icons/md";


const Profile = () => {
    const [activeTab, setActiveTab] = useState("profile");
    const [passSent, setPassSent] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        mobile: '',
        firstName: '',
        lastName: '',
        dob: { day: '', month: '', year: '' },
        gender: '',
        city: '',
    });
    const [loading, setLoading] = useState(false);
    const [userNews, setUserNews] = useState([])
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/users/userdata", {
                    params: { userId: userId }
                });
                setFormData((prev) => ({
                    ...prev,
                    email: response.data.email || '',
                    mobile: response.data.mobile || '',
                    firstName: response.data.firstName || '',
                    lastName: response.data.lastName || '',
                    dob: response.data.dob || { day: '', month: '', year: '' },
                    gender: response.data.gender || '',
                    city: response.data.city || '',
                }));

            } catch (err) {
                console.log("Error fetching user data", err);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const fetchUserNews = async () => {
            try {
                const news = await axios.get("http://localhost:5000/news/fetchusernews", {
                    params: { userId: userId }
                })
                setUserNews(news.data);
            } catch (err) {
                console.log("Error fetching user news", err);
            }
        }
        fetchUserNews();
    }, []);
    const Navigate = useNavigate();

    const logOut = () => {
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        Navigate("/");
    }



    const handleChange = (e) => {
        const { name, value } = e.target;
        if (['day', 'month', 'year'].includes(name)) {
            setFormData({
                ...formData,
                dob: { ...formData.dob, [name]: value },
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put("http://localhost:5000/users/updateuserprofile", {
                userId,
                ...formData
            });

            if (response.data.success) {
                alert("Profile updated successfully!");
            } else {
                alert("Failed to update profile.");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("An error occurred while updating profile.");
        }
    };

    const handleReset = async () => {
        setLoading(true); // start loading
        try {
            const email = formData.email;
            const response = await axios.post("http://localhost:5000/users/reset", { email });
            if (response.data.succes) {
                setPassSent(true);
            } else {
                console.log("Password reset link not sent");
            }
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pb-12 animate-fade-in">
            <Navbar />

            <div className="max-w-[1200px] mx-auto px-4 md:px-8 pt-8 flex flex-col md:flex-row gap-8">
                {/* Sidebar Navigation */}
                <div className="w-full md:w-1/4">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 sticky top-28 shadow-lg">
                        <ul className="space-y-2">
                            <li
                                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${activeTab === "profile" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                onClick={() => setActiveTab("profile")}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                My Profile
                            </li>
                            <li
                                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${activeTab === "news" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                onClick={() => setActiveTab("news")}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                                Manage News
                            </li>
                            <li
                                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${activeTab === "authors" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                onClick={() => setActiveTab("authors")}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                Follow Authors
                            </li>
                            <li
                                className={`cursor-pointer px-4 py-3 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${activeTab === "password" ? "bg-teal-500/20 text-teal-400 border border-teal-500/30 shadow-[0_0_15px_rgba(45,212,191,0.2)]" : "text-white/60 hover:text-white hover:bg-white/5"}`}
                                onClick={() => setActiveTab("password")}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                Change Password
                            </li>

                            <li className="mt-8">
                                <button className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold rounded-xl shadow-lg hover:shadow-red-500/20 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2" onClick={logOut}>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                    LOGOUT
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="w-full md:w-3/4">
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl min-h-[500px]">
                        {activeTab === "profile" ? (
                            <div className="animate-fade-in">
                                <h3 className="text-3xl font-heading font-bold mb-8 text-white border-b border-white/10 pb-4">
                                    Profile Details
                                </h3>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">Email Address</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/5 transition-all" readOnly />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">Mobile Number</label>
                                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/5 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">First Name</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/5 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">Last Name</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/5 transition-all" />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">Date of Birth</label>
                                            <div className="flex gap-2">
                                                <select name="day" value={formData.dob.day} onChange={handleChange} className="bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white w-20 focus:outline-none focus:border-teal-500/50">
                                                    <option value="" className="bg-slate-900">DD</option>
                                                    {[...Array(31)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1} className="bg-slate-900">{i + 1}</option>
                                                    ))}
                                                </select>
                                                <select name="month" value={formData.dob.month} onChange={handleChange} className="bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white flex-1 focus:outline-none focus:border-teal-500/50">
                                                    <option value="" className="bg-slate-900">MM</option>
                                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                                        <option key={i + 1} value={i + 1} className="bg-slate-900">{m}</option>
                                                    ))}
                                                </select>
                                                <select name="year" value={formData.dob.year} onChange={handleChange} className="bg-black/20 border border-white/10 rounded-xl px-3 py-3 text-white w-24 focus:outline-none focus:border-teal-500/50">
                                                    <option value="" className="bg-slate-900">YYYY</option>
                                                    {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
                                                        <option key={year} value={year} className="bg-slate-900">{year}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">Gender</label>
                                            <div className="flex gap-4 mt-3 bg-black/20 border border-white/10 rounded-xl px-4 py-3">
                                                {['Male', 'Female', 'Other'].map((g) => (
                                                    <label key={g} className="flex items-center cursor-pointer">
                                                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="mr-2 accent-teal-500 w-4 h-4" />
                                                        <span className="text-white/90">{g}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-white/70 text-sm font-medium ml-1">City</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-teal-500/50 focus:bg-white/5 transition-all" />
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10 mt-8">
                                        <button type="button" className="text-red-400 text-sm hover:text-red-300 transition-colors font-medium border border-transparent hover:border-red-500/30 px-4 py-2 rounded-lg">
                                            Delete Account
                                        </button>
                                        <button type="submit" className="bg-gradient-to-r from-amber-300 to-yellow-500 text-stone-900 font-bold px-10 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transform user-select-none hover:-translate-y-1 transition-all duration-300">
                                            Update Profile
                                        </button>
                                    </div>
                                </form>
                            </div>
                        ) : activeTab === "news" ? (
                            <div className="animate-fade-in">
                                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                                    <h3 className="text-3xl font-heading font-bold text-white">Your News</h3>
                                    <Link to="/addnews">
                                        <button className="flex items-center gap-2 px-5 py-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/30 rounded-xl font-bold hover:bg-teal-500 hover:text-black transition-all duration-300">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                            Add News
                                        </button>
                                    </Link>
                                </div>
                                <ul className="space-y-4">
                                    {userNews.length > 0 ? (
                                        userNews.map((news) => (
                                            <li key={news.id} className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-teal-500/30 transition-all duration-300">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-xl font-semibold text-white mb-2">{news.title}</h4>
                                                        <p className="text-sm text-white/50 mb-3">
                                                            {new Date(news.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${news.status === "Approved" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                                                        {news.status}
                                                    </span>
                                                </div>
                                            </li>
                                        ))
                                    ) : (
                                        <div className="text-center py-12 text-white/50 bg-white/5 rounded-2xl border-dashed border-2 border-white/10">
                                            <p className="text-lg">No news added yet.</p>
                                            <Link to="/addnews" className="text-teal-400 hover:underline mt-2 inline-block">Post your first story</Link>
                                        </div>
                                    )}
                                </ul>
                            </div>
                        ) : activeTab === "password" ? (
                            <div className="animate-fade-in py-10">
                                {passSent ? (
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <MdOutlineMarkEmailRead size={40} className="text-green-500" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                                        <p className="text-white/60">We've sent a password reset link to your registered email address.</p>
                                    </div>
                                ) : loading ? (
                                    <div className="text-center py-20">
                                        <div className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                                        <p className="text-lg font-semibold text-white/80">Sending reset link...</p>
                                    </div>
                                ) : (
                                    <div className="text-center max-w-md mx-auto">
                                        <div className="w-20 h-20 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-4">Change Password</h2>
                                        <p className="text-white/60 mb-8">Click the button below to receive a password reset link at <strong>{formData.email}</strong>.</p>
                                        <button
                                            onClick={handleReset}
                                            className="bg-gradient-to-r from-teal-400 to-emerald-500 text-black font-bold px-8 py-3 rounded-xl hover:shadow-[0_0_20px_rgba(45,212,191,0.3)] transform hover:-translate-y-1 transition-all duration-300 w-full"
                                        >
                                            Send Reset Link
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : activeTab === "authors" ? (
                            <div className="animate-fade-in text-center py-20">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                                    <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                </div>
                                <h2 className="text-xl font-bold text-white mb-2">Coming Soon</h2>
                                <p className="text-white/50">The "Follow Authors" feature is currently under development.</p>
                            </div>
                        ) : (
                            <div className="text-white">Logout</div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Profile;