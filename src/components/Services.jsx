import React from "react";
import Dash from "./Dash";
import ServiceCard from "./ServiceCard";
const servicesData = [
  {
    img: "/homebaked2.jpg",
    title: "Professonally Homebaked",
    desc: "Experience the art of home baking done professionally! Our cakes combine homemade charm with expert craftsmanship, ensuring every bite is a delicious masterpiece. Taste the difference that passion and skill can make!",
  },
  {
    img: "/delivery.avif",
    title: "Free Delivery",
    desc: "Freshly baked and delivered to your door! Enjoy our delicious treats without leaving home—fast, reliable, and always on time. Let us bring the sweetness to you!",
  },
  {
    img: "/Cakes.jpg",
    title: "Range of Choices",
    desc: "Craving variety? Our wide range of cakes has something for everyone! From classic flavors to creative twists, we’ve got the perfect treat for every taste and occasion. Explore endless delicious options!",
  },
  {
    img: "/freecake.png",
    title: "Free Cake On Your Birthday",
    desc: "Celebrate your special day with a sweet surprise! Enjoy a FREE cake on your birthday, baked with love just for you. Because your day deserves a little extra sweetness!",
  },
];
const Services = () => {
  return (
    <div className="container pt-40 ">
      <div className="space-y-4 w-fit mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold">
          Choose best <span className="text-orange-500">Services</span>
        </h2>

        <p className="text-gray-950">
          Bring your cake vision to life with our custom cake service! Whether
          it is a birthday, wedding, or any special occasion,
          <br /> we craft unique, delicious creations tailored to your style and
          taste. Dream it, and we will bake it!
        </p>
        <div className="w-fit mx-auto">
          <Dash />
        </div>
      </div>

      <div className="grid gap-10 md:grid-cols-4 md:gap-4 pt-8">
        {servicesData.map((items, index) => (
          <ServiceCard
            key={index}
            img={items.img}
            title={items.title}
            desc={items.desc}
          />
        ))}
      </div>
    </div>
  );
};

export default Services;
