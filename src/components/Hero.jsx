import Image from "next/image";
import React from "react";
import Navbar from "./Navbar";
import Link from "next/link";

const Hero = () => {
  return (
    <div className=" relative min-h-screen">
      <Image
        className="lg:w-[580px] xl:w-[620px] h-auto absolute top-0 right-0 -z-10"
        src="/hero2.png"
        alt="hero-bg"
        width={1000}
        height={800}
      />
      <Navbar />

      <div className="container h-[calc(100vh-120px)] grid items-center">
        <div className="space-y-4 bg-[#ffffff98] w-fit p-4">
          <p className="uppercase font-medium  ">Wide options of Choice</p>
          <h2 className="text-4xl sm:text-6xl font bold">
            Grave The <span className="text-orange-600">Crave</span>
          </h2>
          <p className="text-gray-900 text-[14px] sm:text-[16px]">
            Delicious food quality, aroma and taste.
            <br />
            What are you waiting for ?
          </p>
          <br />
          <Link href="/order">
            <button className="bg-orange-600 text-white px-6 py-4 rounded-3xl text-[14px ] sm:text-[10]">
              Order Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
