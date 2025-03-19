import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useEffect } from 'react';
import io from 'socket.io-client';
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
      </Routes>
    </Router>
  );
}

export default App;
