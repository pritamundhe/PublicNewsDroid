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
    language: "en",
  });
  const navigate = useNavigate();
  const categoriesList = ["Politics", "Business", "Technology", "Sports", "Entertainment", "Movies", "Health", "Science"];

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
      requestForToken(response.data.userId);
      navigate("/login");
    } catch (error) {
      console.log(error.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-6 font-[Poppins]">
      <div className="max-w-6xl w-full rounded-[24px] flex flex-col md:flex-row overflow-hidden shadow-xl">
        {/* Left Panel */}
        <div className="relative bg-red-300 flex-1 p-10 md:p-16 text-white">
          <img
            src="https://storage.googleapis.com/a1aa/image/b70525a2-546d-425f-9f9d-0be704a5f7df.jpg"
            alt="Decoration"
            className="absolute inset-0 w-full h-full object-cover opacity-40 rounded-t-[24px] md:rounded-l-[24px] md:rounded-tr-none"
          />
          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-extrabold mb-4">Join PublicNews!</h1>
            <p className="text-lg font-light leading-relaxed">
              Get the latest, location-based headlines tailored just for you.
            </p>
          </div>
        </div>

        {/* Right Form Panel */}
        <div className="bg-white flex-1 p-10 md:p-16 flex flex-col justify-center rounded-b-[24px] md:rounded-r-[24px] md:rounded-bl-none">
          <h2 className="text-3xl font-extrabold text-gray-700 mb-6 text-center">Create an Account</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              required
              className="w-full px-5 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
              className="w-full px-5 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              required
              className="w-full px-5 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-purple-600"
            />

            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-600">Preferred Categories</label>
              <div className="flex flex-wrap gap-2">
                {categoriesList.map((cat) => (
                  <label key={cat} className="flex items-center space-x-1 text-sm text-gray-700">
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

            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="w-full px-5 py-3 border rounded-full text-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="bn">Bengali</option>
              <option value="ta">Tamil</option>
              <option value="te">Telugu</option>
            </select>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-white text-lg font-semibold bg-red-500 hover:bg-red-300 transition-colors duration-300"
            >
              Sign Up
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-red-600 font-semibold hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
