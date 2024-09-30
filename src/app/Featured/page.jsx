import Image from "next/image";
import React from "react";
import Dash from "../../components/Dash";

const Featured = () => {
  return (
    <div className="container pt-40">
      <h2 className="text-6xl font-bold">Our</h2>
      <h2 className="text-6xl font-bold pt-2">
        Featured <span className="text-orange-600">Cakes</span>
      </h2>

      <p className="max-w-[550px] pt-10 text-gray-800">
        Discover our Featured Cakes – where every slice is a celebration! From
        classic favorites to seasonal delights, each cake is crafted with love
        and the finest ingredients. Treat yourself to irresistible flavors that
        will make any moment sweeter!
      </p>

      <Dash />

      <div className="grid md:grid-cols-[1fr,37%,1fr] gap-16 mt-10">
        <div className="w-fit mx-auto self-end">
          <Image
            className="w-[100%] max-w-[400px] sm:max-w-full h-auto shadow-2xl"
            src="/chocolate.jpg"
            width={300}
            height={800}
            alt="grid image"
          />

          <div className="space-y-4">
            <Dash />
            <h2 className="font-medium text-xl">Chocolate Cake</h2>
            <p className="text-gray-800 text-[14px] xl:text-[16px]">
              Satisfy your chocolate cravings with our decadent chocolate cakes!
              Rich, indulgent, and irresistibly smooth, these cakes are a
              chocoholic’s dream come true. Perfect for any occasion—or no
              occasion at all.
            </p>
          </div>
        </div>
        <div className="w-fit mx-auto">
          <Image
            className="w-[100%] max-w-[400px] sm:max-w-full h-auto shadow-2xl"
            src="/butterscotch.jpg"
            width={500}
            height={500}
            alt="grid image"
          />

          <div className="space-y-4">
            <Dash />
            <h2 className="font-medium text-xl">Butterscotch Birthday Cake</h2>
            <p className="text-gray-800 text-[14px] xl:text-[16px]">
              Delight in the creamy, caramel goodness of our Butterscotch Cakes!
              With a perfect blend of sweetness and crunch, each bite is a
              buttery dream you won’t want to miss. Pure bliss in every slice!
            </p>
          </div>
        </div>
        <div className="w-fit mx-auto self-end">
          <Image
            className="w-[100%] max-w-[400px] sm:max-w-full h-auto shadow-2xl"
            src="/bento1.webp"
            width={300}
            height={600}
            alt="grid image"
          />

          <div className="space-y-4">
            <Dash />
            <h2 className="font-medium text-xl">Bento Cake</h2>
            <p className="text-gray-700 text-[14px] xl:text-[16px]">
              Small in size, big on flavor! Our Bento Cakes are the perfect mini
              indulgence, personalized just for you. Cute, delicious, and made
              for moments when you want a sweet treat all to yourself.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Featured;
