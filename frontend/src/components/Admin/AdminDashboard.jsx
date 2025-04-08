import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser } from "react-icons/fa";
import { GrDocumentText } from "react-icons/gr";
import { IoAlertCircleSharp } from "react-icons/io5";
import { CgCheckO } from "react-icons/cg";

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [newsAnalytics, setnewsAnalytics] = useState([]);

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

    return (
        <div className="flex h-screen font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#2E3A59] text-white flex flex-col p-4">
                <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
                <nav className="flex flex-col gap-3">
                    <a href="#" className="text-white hover:bg-[#1e293b] rounded p-2">Users</a>
                </nav>
            </aside>

            {/* Main content */}
            <main className="flex-1 bg-gray-100 overflow-y-auto p-6">
                {/* Top bar */}
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
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((user, index) => (
                                            <tr key={user._id} className="border-b">
                                                <td className="py-2">{index + 1}</td>
                                                <td>{user.username}</td>
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

            </main>
        </div>
    );
};

export default AdminDashboard;
