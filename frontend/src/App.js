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
import PaymentPage1 from "./pages/PaymentPage1";
import Epaper from "./pages/Epaper";
const socket = io('http://localhost:5000');

function App() {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to Socket.io');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Router>
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
        <Route path="/pay" element={<PaymentPage/>}/>
        <Route path="/pay1" element={<PaymentPage1/>}/>
        <Route path="/epaper" element={<Epaper/>}/>
      </Routes>
    </Router>
  );
}

export default App;
