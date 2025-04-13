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
                setFormData((prev) => ({ ...prev, email: response.data.email }));

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Updated Data:', formData);
        alert('Profile updated successfully!');
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
        <div>
            <Navbar />
            <div className='bg-gray-100 min-h-screen'>

                <div className="font-times max-h-80% flex px-20 py-10 gap-12 mx-40 bg-gray-100">
                    <div className="w-1/4">
                        <ul className="space-y-3">
                            <li className={`cursor-pointer ${activeTab === "profile" ? " text-red-600 px-2 py-1 font-semibold border-red-600 border-b-2" : "hover:underline"}`} onClick={() => setActiveTab("profile")}>
                                My Profile
                            </li>
                            <li className={`cursor-pointer ${activeTab === "news" ? " text-red-600 px-2 py-1 font-semibold border-b-2 border-red-600" : "hover:underline"}`} onClick={() => setActiveTab("news")}>
                                Manage News
                            </li>
                            <li className={`cursor-pointer ${activeTab === "authors" ? " text-red-600 px-2 py-1 font-semibold border-b-2 border-red-600" : "hover:underline"}`} onClick={() => setActiveTab("authors")}>
                                Follow Authors
                            </li>
                            <li className={`cursor-pointer ${activeTab === "password" ? " text-red-600 px-2 py-1 font-semibold border-b-2 border-red-600" : "hover:underline"}`} onClick={() => setActiveTab("password")}>
                                Change passwords
                            </li>
                            <li className=" px-4 py-2 bg-red-600 text-white hover:bg-red-400 w-fit rounded-md" onClick={logOut}>
                                LOGOUT                        </li>
                        </ul>
                    </div>

                    <div className="w-3/4 p-8 border border-gray-300 rounded-xl shadow-md bg-white">
                        {activeTab === "profile" ? (
                            <>
                                <h3 className="text-2xl font-bold mb-6">Update profile</h3>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label>Email:</label>
                                            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full border-b-2 border-red-600 outline-none" readOnly />
                                        </div>
                                        <div>
                                            <label>Mobile Number</label>
                                            <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" className="w-full border-b-2 border-red-600 outline-none" />
                                        </div>
                                        <div>
                                            <label>First Name:</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border-b-2 border-red-600 outline-none" />
                                        </div>
                                        <div>
                                            <label>Last Name:</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border-b-2 border-red-600 outline-none" />
                                        </div>
                                        <div className="flex gap-2">
                                            <div>
                                                <label>DOB</label>
                                                <div className="flex gap-2">
                                                    <select name="day" value={formData.dob.day} onChange={handleChange} className="border-b-2 border-red-600">
                                                        <option value="">DD</option>
                                                        {[...Array(31)].map((_, i) => (
                                                            <option key={i + 1}>{i + 1}</option>
                                                        ))}
                                                    </select>
                                                    <select name="month" value={formData.dob.month} onChange={handleChange} className="border-b-2 border-red-600">
                                                        <option value="">MM</option>
                                                        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                                                            <option key={i + 1} value={i + 1}>{m}</option>
                                                        ))}
                                                    </select>
                                                    <select name="year" value={formData.dob.year} onChange={handleChange} className="border-b-2 border-red-600">
                                                        <option value="">YYYY</option>
                                                        {Array.from({ length: 100 }, (_, i) => 2025 - i).map((year) => (
                                                            <option key={year}>{year}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <label>Gender:</label>
                                            <div className="flex gap-4 mt-2">
                                                {['Male', 'Female', 'Other'].map((g) => (
                                                    <label key={g}>
                                                        <input type="radio" name="gender" value={g} checked={formData.gender === g} onChange={handleChange} className="mr-1" /> {g}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label>City:</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full border-b-2 border-red-600 outline-none" />
                                        </div>
                                    </div>

                                    <div className="text-center mt-6">
                                        <button type="submit" className="bg-white border px-8 py-2 rounded-xl hover:bg-blue-100 font-semibold">UPDATE</button>
                                    </div>
                                    <p className="text-red-600 mt-4 cursor-pointer hover:underline text-sm ml-96 pl-40">Delete Your Account</p>
                                </form>
                            </>
                        ) : activeTab === "news" ?
                            (
                                <div>
                                    <div className="flex justify-between">
                                        < h3 className="text-2xl font-bold mb-6 w-fit">Your News</h3>
                                        <Link to="/addnews">
                                            < h2 className="text-2xl px-3 py-1 text-white bg-red-600 rounded-md w-fit h-fit">Add News</h2>
                                        </Link>
                                    </div>
                                    <ul className="space-y-4">
                                        {userNews.length > 0 ? (
                                            userNews.map((news) => (
                                                <li key={news.id} className="border p-4 rounded-lg shadow">
                                                    <h4 className="text-lg font-semibold">{news.title}</h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(news.createdAt).toLocaleDateString()}
                                                    </p>
                                                    <p className={`mt-2 font-mono text-sm px-3 py-1 w-fit rounded-md text-white ${news.status === "Approved" ? "bg-green-400 " : "bg-red-400"}`}>{news.status}</p>
                                                </li>
                                            ))
                                        ) : (
                                            <p>No news added yet.</p>
                                        )}
                                    </ul></div>
                            ) : activeTab === "password" ?
                                (passSent ? (
                                    <div>
                                        <h2 className='text-center text-2xl font-semibold'>Please check you email.</h2>
                                        <MdOutlineMarkEmailRead size={80} className='mx-auto my-5 text-red-500' />
                                        <h2 className='text-center'>Password reset link has been sent to your registered email.</h2>
                                    </div>
                                ) : loading ? (
                                    <div className='text-center'>
                                        <p className="text-lg font-semibold">Sending reset link...</p>
                                        <div className="w-8 h-8 border-4 border-red-500 border-t-transparent rounded-full animate-spin mx-auto mt-4"></div>
                                    </div>
                                ) : (
                                    <div>
                                        <h2 className='text-center text-2xl'>Click on below button to reset your password</h2>
                                        <button
                                            onClick={handleReset}
                                            className='text-white bg-red-500 px-3 py-1 rounded-md text-center w-fit text-3xl mt-8 mx-auto hover:bg-red-400 block'
                                        >
                                            Reset Password
                                        </button>
                                    </div>
                                )
                                ) : activeTab === "authors" ?
                                    (
                                        <>Authors</>
                                    ) :
                                    (
                                        <div>Logout</div>
                                    )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;