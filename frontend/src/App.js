import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import { useEffect } from 'react';
import io from 'socket.io-client';
import { Toaster } from 'react-hot-toast';
import Profile from "./components/Authentication/Profile";
import Subscription from "./components/Subscription";
import Signup from "./components/Authentication/SignUp";
import Login from "./components/Authentication/Login";
import NewsDetail from "./components/News/NewsDetails";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AddNews from "./components/News/AddNews";
import PaymentPage from "./pages/Paymentpage";

import Epaper from "./pages/Epaper";
const socket = io('http://localhost:5000');

function App() {
  useEffect(() => {
    socket.on('connect', () => {
    });

    socket.on('disconnect', () => {
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Router>
      <div className="fixed inset-0 z-[-1] w-full h-full overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute min-w-full min-h-full object-cover w-full h-full opacity-60"
        >
          <source src="https://www.pexels.com/download/video/31801604/" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Cinematic Noise/Overlay */}
        <div className="absolute inset-0 bg-stone-900/40 backdrop-blur-[20px]"></div>
      </div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/newsdetail/:id" element={<NewsDetail />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/addnews" element={<AddNews />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/pay" element={<PaymentPage />} />

        <Route path="/epaper" element={<Epaper />} />
      </Routes>
    </Router>
  );
}

export default App;
