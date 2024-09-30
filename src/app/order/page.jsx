"use client";
import React, { useState } from "react";

const OrderPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    cakeType: "",
    deliveryDate: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order Submitted! Thank you, ${formData.name}`);
    // Normally, you'd send formData to the backend here
    console.log(formData);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="relative bg-gray-900 border border-cyan-500 p-8 max-w-2xl w-full shadow-neon">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-500 opacity-75 blur-2xl rounded-lg"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-cyan-400 text-center mb-8 neon-text">
            Order Now
          </h1>
          <p className="text-center text-lg text-gray-300 mb-10">
            Secure your order today and bring a futuristic flavor to your
            events!
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Input */}
            <div>
              <label className="block text-lg font-medium text-cyan-400 mb-2 neon-text">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-gray-200 border border-cyan-400 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-cyan-500 transition duration-300"
                placeholder="Enter your name"
              />
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-lg font-medium text-cyan-400 mb-2 neon-text">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-gray-200 border border-cyan-400 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-cyan-500 transition duration-300"
                placeholder="Enter your email"
              />
            </div>

            {/* Phone Input */}
            <div>
              <label className="block text-lg font-medium text-cyan-400 mb-2 neon-text">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-gray-200 border border-cyan-400 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-cyan-500 transition duration-300"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Cake Type Input */}
            <div>
              <label className="block text-lg font-medium text-cyan-400 mb-2 neon-text">
                Cake Type
              </label>
              <select
                name="cakeType"
                value={formData.cakeType}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-gray-200 border border-cyan-400 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-cyan-500 transition duration-300"
              >
                <option value="">Choose a type</option>
                <option value="Chocolate Cake">Chocolate Cake</option>
                <option value="Vanilla Cake">Vanilla Cake</option>
                <option value="Red Velvet Cake">Red Velvet Cake</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {/* Delivery Date Input */}
            <div>
              <label className="block text-lg font-medium text-cyan-400 mb-2 neon-text">
                Delivery Date
              </label>
              <input
                type="date"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 text-gray-200 border border-cyan-400 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-cyan-500 transition duration-300"
              />
            </div>

            {/* Message Input */}
            <div>
              <label className="block text-lg font-medium text-cyan-400 mb-2 neon-text">
                Additional Message (Optional)
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-gray-800 text-gray-200 border border-cyan-400 rounded-lg p-3 mt-1 focus:ring-2 focus:ring-cyan-500 transition duration-300"
                placeholder="Any special requests?"
                rows={4}
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-cyan-500 text-gray-900 font-bold py-3 px-4 rounded-lg shadow-neon hover:shadow-cyan transition-all duration-300 hover:scale-105"
              >
                Submit Order
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
