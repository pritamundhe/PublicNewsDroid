import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { requestForToken } from "./fireBaseConfig.js";

export default function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    lat: "",
    lon: "",
    categories: [],
  });
  const navigate=useNavigate();
  const categoriesList = ["Politics", "Business", "Technology", "Sports", "Entertainment","Movies","Health","Science"];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      const updatedCategories = checked
        ? [...formData.categories, value]
        : formData.categories.filter((cat) => cat !== value);
      setFormData({ ...formData, categories: updatedCategories });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
    role: formData.role,
    location: {
      lat: parseFloat(formData.lat),
      lon: parseFloat(formData.lon),
    },
    preferences: {
      categories: formData.categories,
      language: formData.language,
    },
    };
    try {
      const response = await axios.post("http://localhost:5000/users/register", payload);
      console.log(response);
      requestForToken(response.data.userId);
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data?.message || "Registration failed.");
    }
   
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-times  border-red-300 shadow-2xl">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl border-red-300"
      >
        <h2 className="text-3xl font-bold mb-2 text-center text-black uppercase tracking-wide">
         Public<span className="text-black">News</span> 
        </h2>
        <h2 className="text-3xl font-bold mb-2 text-center font-times">Create an Account</h2>
        <h1 className="w-50% bg-red-500 h-[3px] rounded-xl mb-6"></h1>
        <div className="mb-4 border-red-300">
          <label className="block mb-1 font-semibold">Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded p-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Preferred Categories</label>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((cat) => (
              <label key={cat} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="categories"
                  value={cat}
                  checked={formData.categories.includes(cat)}
                  onChange={handleChange}
                />
                <span>{cat}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block mb-1 font-semibold">Preferred Language</label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full border rounded p-2"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="te">Telugu</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
