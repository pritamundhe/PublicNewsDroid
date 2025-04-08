import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import { useEffect } from 'react';
import io from 'socket.io-client';
import Admin from "./pages/Admin";
import Subscription from "./components/Subscription";
import Signup from "./components/Authentication/SignUp";
import Login from "./components/Authentication/Login";
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
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
