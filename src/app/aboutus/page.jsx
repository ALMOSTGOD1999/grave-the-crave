// pages/about.js
import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto py-16 px-4">
        <div className="bg-white shadow-lg rounded-lg p-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">About Us</h1>
          <p className="text-lg text-gray-700 mb-6">
            Welcome to Grave the <span className="text-orange-600">Crave</span>{" "}
            , where every cake is crafted with love and passion for the art of
            baking. Our story began with a simple dream – to create irresistible
            pastries that bring joy to every occasion. Today, we continue that
            tradition with a commitment to quality, freshness, and creativity.
          </p>

          <p className="text-lg text-gray-700 mb-6">
            From classic cakes to innovative pastries, our talented bakers use
            only the finest ingredients to create sweet treats that not only
            taste amazing but also look like a work of art. Whether you are
            celebrating a special milestone or simply indulging in a sweet
            moment, we are here to make your day sweeter.
          </p>

          <p className="text-lg text-gray-700 mb-6">
            At Grave the <span className="text-orange-600">Crave</span>, we
            believe that every bite should be a delightful experience. Thank you
            for choosing us to be a part of your celebrations and everyday
            moments.
          </p>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700">
              To be the go-to bakery that brings sweetness and joy to every
              community through our exceptional pastry creations.
            </p>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-gray-950 mb-4">
              Our Values
            </h2>
            <ul className="list-disc pl-5 text-lg text-gray-700 space-y-2">
              <li>Quality: We use only the finest ingredients.</li>
              <li>Creativity: We craft innovative and beautiful pastries.</li>
              <li>
                Customer Satisfaction: We are committed to making every
                experience special.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
