import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { IoAlertCircleSharp } from "react-icons/io5";
import { CgCheckO } from "react-icons/cg";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newsAnalytics, setnewsAnalytics] = useState([]);
    const [activeTab, setActiveTab] = useState("Users");


    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await axios.get('http://localhost:5000/admin/getallusers');
                setUsers(res.data);
                const res1 = await axios.get('http://localhost:5000/admin/getnewsanalystics');
                setnewsAnalytics(res1.data);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');

    const filteredUsers = users.filter((user) =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const [flaggedContent, setFlaggedContent] = useState([]);

    useEffect(() => {
        const fetchFlagged = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/flagged');
                setFlaggedContent(response.data);
            } catch (error) {
                console.error('Error fetching flagged content:', error);
            }
        };

        fetchFlagged();
    }, []);

    const handleDeactivate = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/admin/deactivate/${userId}`);
            const updatedUsers = await axios.get('http://localhost:5000/admin/getallusers');
            setUsers(updatedUsers.data);
        } catch (error) {
            console.error("Error deactivating user:", error);
        }
    };

    const handleActivate = async (userId) => {
        try {
            await axios.put(`http://localhost:5000/admin/reactivate/${userId}`);
            const updatedUsers = await axios.get('http://localhost:5000/admin/getallusers');
            setUsers(updatedUsers.data);
        } catch (error) {
            console.error("Error activating user:", error);
        }
    };

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: '',
    });

    const userId = localStorage.getItem("userId");
    const [images, setImages] = useState([]);
    const [videos, setVideos] = useState([]);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, type) => {
        const files = Array.from(e.target.files);
        if (type === 'image') {
            setImages(files);
        } else if (type === 'video') {
            setVideos(files);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = new FormData();
        formPayload.append('title', formData.title);
        formPayload.append('content', formData.content);
        formPayload.append('category', formData.category);
        formPayload.append('author', userId);

        // Only append files if they exist
        if (images.length > 0) {
            images.forEach((img) => formPayload.append('images', img));
        }

        if (videos.length > 0) {
            videos.forEach((vid) => formPayload.append('videos', vid));
        }

        try {
            const response = await axios.post('http://localhost:5000/news/add', formPayload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('News submitted successfully!');
            setFormData({ title: '', content: '', category: '' });
            setImages([]);
            setVideos([]);
        } catch (error) {
            setMessage('Submission failed. Check the console.');
            console.error('Error submitting news:', error);
        }
    };

    return (
        <div className="flex h-screen font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2E3A59] text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <nav className="flex flex-col gap-3">
                    <a className={` ${activeTab === "Users" ? "text-black bg-white px-3 py-1 rounded-md" : "text-white hover:bg-[#1e293b] rounded p-2"}`} onClick={() => setActiveTab("Users")}
                    >Users</a>
                    <a className={` ${activeTab === "News" ? "text-black bg-white px-3 py-1 rounded-md" : "text-white hover:bg-[#1e293b] rounded p-2"}`} onClick={() => setActiveTab("News")}>Add News</a>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
                {/* Top bar */}
                {activeTab === "Users" ?
                    (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-bold">Dashboard</h2>
                                <div className="w-10 h-10 rounded-full bg-gray-400" />
                            </div>

                            {/* Stat cards */}
                            <div className="grid grid-cols-4 gap-4 mb-6">
                                <div className="bg-white rounded shadow p-4 text-center ">
                                    <div className="text-3xl font-bold text-black">{users.length}</div>
                                    <div className='flex justify-center my-3 text-blue-500'><FaUser size={30} /></div>
                                    <div className="text-gray-600">Users</div>
                                </div>
                                <div className="bg-white rounded shadow p-4 text-center">
                                    <div className="text-3xl font-bold text-black">{newsAnalytics.totalNews}</div>
                                    <div className='flex justify-center my-3 text-yellow-500'><GrDocumentText size={30} /></div>
                                    <div className="text-gray-600">News</div>
                                </div>
                                <div className="bg-white rounded shadow p-4 text-center">
                                    <div className="text-3xl font-bold text-black">{newsAnalytics.approvedNews}</div>
                                    <div className='flex justify-center my-3 text-green-500'><CgCheckO size={40} /></div>
                                    <div className="text-gray-600">Approved</div>
                                </div>
                                <div className="bg-white rounded shadow p-4 text-center">
                                    <div className="text-3xl font-bold text-black">{newsAnalytics.flaggedNews}</div>
                                    <div className='flex justify-center my-3 text-red-500'><IoAlertCircleSharp size={40} /></div>
                                    <div className="text-gray-600">Flagged content</div>
                                </div>
                            </div>

                            {/* Servers + Users */}
                            <div className="grid grid-cols-2 gap-4 mb-6 ">
                                {/* Flagged Content Section */}
                                <div className="bg-white rounded shadow p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-700">Flagged Content</h3>
                                        <span className="text-blue-600 cursor-pointer">Manage</span>
                                    </div>
                                    <div className="overflow-y-auto max-h-48">
                                        {flaggedContent.length > 0 ? (
                                            flaggedContent.map((item, index) => (
                                                <div key={item._id || index} className="border-b py-2">
                                                    <div className="font-medium">{item.title || 'Untitled'}</div>
                                                    <div className="text-sm text-gray-600">Reason: {item.flaggedReason || 'Not specified'}</div>
                                                    <div className={`text-sm ${item.status === 'pending' ? 'text-orange-500' : 'text-green-600'}`}>
                                                        Status: {item.status}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-500 text-sm">No flagged content found</div>
                                        )}
                                    </div>
                                </div>



                                <div className="bg-white rounded shadow p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="font-semibold text-gray-700">Users</h3>
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="border px-2 py-1 rounded text-sm"
                                        />
                                    </div>
                                    <div className="overflow-y-auto max-h-64">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left border-b sticky top-0 bg-white z-10">
                                                    <th className="py-2">#</th>
                                                    <th>Username</th>
                                                    <th>Status</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user, index) => (
                                                        <tr key={user._id} className="border-b">
                                                            <td className="py-2">{index + 1}</td>
                                                            <td>{user.username}</td>
                                                            <td>{user.isActive == true ? (
                                                                <div className='text-sm bg-green-400 text-white rounded-md px-3  w-fit'>Active</div>
                                                            ) : (
                                                                <div className='text-sm bg-red-400 text-white rounded-md px-3  w-fit'>Deactive</div>)
                                                            }</td>
                                                            <td>{user.isActive == true ? (
                                                                <button
                                                                    className='text-sm text-red-700 hover:underline rounded-md px-3 w-fit'
                                                                    onClick={() => handleDeactivate(user._id)}
                                                                >
                                                                    Deactivate
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    className='text-sm text-green-700 hover:underline rounded-md px-3 w-fit'
                                                                    onClick={() => handleActivate(user._id)}
                                                                >
                                                                    Reactivate
                                                                </button>
                                                            )
                                                            }</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan={2} className="py-4 text-center text-gray-500">No users found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div>
                            <h2 className='text-3xl font-semibold ml-20'>Add news</h2>
                            <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-6">
                                <h2 className="text-2xl font-semibold mb-4">Submit News</h2>
                                <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">

                                    <input
                                        type="text"
                                        name="title"
                                        placeholder="Title"
                                        className="w-full p-3 border rounded-xl"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                    />

                                    <ReactQuill
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(value) => setFormData({ ...formData, content: value })}
                                        className="bg-white rounded-xl"
                                    />
                                    <input
                                        type="text"
                                        name="category"
                                        placeholder="Category"
                                        className="w-full p-3 border rounded-xl"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                    />

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block mb-1 font-medium">Upload Images</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
                                            onChange={(e) => handleFileChange(e, 'image')}
                                            className="block w-full"
                                        />
                                    </div>

                                    {/* Video Upload */}
                                    <div>
                                        <label className="block mb-1 font-medium">Upload Videos</label>
                                        <input
                                            type="file"
                                            multiple
                                            accept="video/*"
                                            onChange={(e) => handleFileChange(e, 'video')}
                                            className="block w-full"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
                                    >
                                        Submit News
                                    </button>

                                    {message && <p className="text-center text-sm text-blue-600">{message}</p>}
                                </form>
                            </div>
                        </div>
                    )
                }

            </main>
        </div>
    );
};

export default AdminDashboard;
