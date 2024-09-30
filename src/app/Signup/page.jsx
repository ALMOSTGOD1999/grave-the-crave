"use client";
import { useState } from "react";
import {
  FaFacebook,
  FaGoogle,
  FaTwitter,
  FaUser,
  FaEnvelope,
  FaLock,
} from "react-icons/fa";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add your logic for form submission
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-2xl transform transition-all duration-500 hover:scale-105">
        <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-8">
          Create Account
        </h2>

        {/* Social Media Sign Up */}
        <div className="flex justify-center mb-6 space-x-4">
          <button className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700">
            <FaFacebook size={20} />
          </button>
          <button className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700">
            <FaGoogle size={20} />
          </button>
          <button className="p-3 rounded-full bg-blue-400 text-white hover:bg-blue-500">
            <FaTwitter size={20} />
          </button>
        </div>

        <p className="text-center text-sm text-gray-500 mb-6">
          or use your email for registration
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="mb-4 relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Email Address"
              required
            />
          </div>

          <div className="mb-6 relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleInputChange}
              className="pl-10 w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-2xl hover:bg-gradient-to-l transform transition hover:scale-105"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{" "}
          <a href="/Login" className="text-purple-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
