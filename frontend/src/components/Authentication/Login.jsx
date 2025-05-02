import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/users/login", formData);
      setMessage("Login successful");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.id);
      if (response.data.user.role === "user") {
        navigate("/");
      } else {
        navigate("/admin");
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="bg-[#9c8cc7] min-h-screen flex items-center justify-center p-6 font-[Poppins,sans-serif]">
      <div className="max-w-5xl w-full rounded-[24px] flex flex-col md:flex-row overflow-hidden shadow-lg">
        {/* Left Panel */}
        <div className="relative bg-gradient-to-b from-[#7f5fc5] to-[#8f6cc9] flex-1 p-10 md:p-16 text-white rounded-t-[24px] md:rounded-l-[24px] md:rounded-tr-none">
          <img
            src="https://storage.googleapis.com/a1aa/image/b70525a2-546d-425f-9f9d-0be704a5f7df.jpg"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40 rounded-t-[24px] md:rounded-l-[24px] md:rounded-tr-none"
          />
          <div className="relative z-10 max-w-md">
            <h1 className="text-4xl font-extrabold mb-3">Welcome back!</h1>
            <p className="text-lg font-normal leading-relaxed">
              You can sign in to access with your existing account.
            </p>
          </div>
        </div>

        {/* Right Panel */}
        <div className="bg-white flex-1 rounded-b-[24px] md:rounded-r-[24px] md:rounded-bl-none p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-extrabold text-gray-700 mb-8">Sign In</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <div className="relative text-gray-400 focus-within:text-purple-700">
                <span className="absolute inset-y-0 left-4 flex items-center">
                  <i className="fas fa-user" />
                </span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Username or email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <div className="relative text-gray-400 focus-within:text-purple-700">
                <span className="absolute inset-y-0 left-4 flex items-center">
                  <i className="fas fa-lock" />
                </span>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 text-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-600">
              <label className="inline-flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked
                  readOnly
                  className="form-checkbox h-4 w-4 text-purple-600 border-gray-300 rounded"
                />
                <span>Remember me</span>
              </label>
              <a className="text-purple-600 hover:text-purple-800 transition-colors duration-200" href="#">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full text-white text-lg font-medium bg-gradient-to-r from-[#6a4bcf] to-[#7f5fc5] hover:from-[#7f5fc5] hover:to-[#6a4bcf] transition-colors duration-300"
            >
              Sign In
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-red-600 font-medium">{message}</p>
          )}

          <p className="mt-6 text-center text-gray-600 text-sm">
            New here?{" "}
            <a className="text-purple-600 hover:text-purple-800 font-medium transition-colors duration-200" href="/signup">
              Create an Account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
