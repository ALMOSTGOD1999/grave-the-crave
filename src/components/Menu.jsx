import React from "react";
import Dash from "./Dash";
import Image from "next/image";
import MenuCard from "./MenuCard";

const menuData = [
  {
    img: "/cupcake.jpg",
    title: "Cup Cake",
    desc: "The youngest member of the family!",
    price: "₹15",
  },
  {
    img: "/pastry.jpg",
    title: "Pastry",
    desc: "Sweeten Every Moment with Our Delightful Pastry Cakes!",
    price: "₹22",
  },
  {
    img: "/mousse.jpg",
    title: "Mousse  ",
    desc: "Indulge in a Wildly Delicious Experience!",
    price: "₹39",
  },
  {
    img: "/swiss.jpg",
    title: "Swiss Roll",
    desc: "A Sweet Twist of Delight in Every Bite!",
    price: "₹49",
  },
  {
    img: "/bento1.webp",
    title: "Bento Cake",
    desc: "(Mango/Strawberry/Pineapple/Orange)",
    price: "₹149",
  },
  {
    img: "/bento.webp",
    title: "Bento Cake",
    desc: "(Chocolate/Red Velvet/ Butterscotch)",
    price: "₹159",
  },
  {
    img: "/plum.jpg",
    title: "Plum Cake",
    desc: "A Timeless Treat: Celebrate Life’s Moments with Plum Cake!",
    price: "₹199",
  },
  {
    img: "/date.jpeg",
    title: "Date Cake",
    desc: "Fuel Your Day with the Sweet Goodness of Date Cake!",
    price: "₹199",
  },
  {
    img: "/fruitnut.jpg",
    title: "Fruit 'n' Nut",
    desc: "Nutty Goodness Meets Fruity Delight: A Cake to Savor!",
    price: "₹249",
  },
  {
    img: "/vanilla.jpg",
    title: "Vanilla Cake",
    desc: "Savor the Simplicity: Vanilla Cake, Where Sweetness Shines!",
    price: "₹259",
  },
  {
    img: "/orange.jpg",
    title: "Orange Cake ",
    desc: "Citrus Sensation: Where Sweet Meets Zesty in Every Bite!",
    price: "₹269",
  },
  {
    img: "/straw.jpg",
    title: "Strawberry Cake ",
    desc: "Elevate Your Celebrations with a Slice of Strawberry Bliss!",
    price: "₹269",
  },
  {
    img: "/pine.jpg",
    title: "Pineapple Cake",
    desc: "A Slice of Summer: Experience the Joy of Pineapple Cake!",
    price: "₹269",
  },
  {
    img: "/mango.webp",
    title: "Mango Cake",
    desc: "Sweet, Juicy, and Irresistibly Fresh: Mango Cake Delight!",
    price: "₹269",
  },
  {
    img: "/butterscotch.jpg",
    title: "Butterscotch Cake",
    desc: "Life's Better with Butterscotch: Sweet, Smooth, Irresistible!",
    price: "₹289",
  },
  {
    img: "/chocolate.jpg",
    title: "Chocolate Cake",
    desc: "Unleash Your Sweetest Desires with Chocolate Delight!",
    price: "₹299",
  },
  {
    img: "/ros.jpg",
    title: "Rosmalai Cake",
    desc: "A Royal Fusion of Tradition and Temptation!",
    price: "₹299",
  },
  {
    img: "/doll.webp",
    title: "Doll Cake",
    desc: "Where Sweetness Takes Shape in Every Slice!",
    price: "₹319",
  },
  {
    img: "/truffle.webp",
    title: "Chocotruffle Cake",
    desc: "Dive Into Decadence, One Luxurious Bite!",
    price: "₹339",
  },

  {
    img: "/chocoblust.webp",
    title: "ChocoBlast Cake",
    desc: "Surrender Your Chocolate Cravings with Chocoblust Bliss!",
    price: "₹349",
  },
  {
    img: "/red velvet.webp",
    title: "Red Velvet Cake",
    desc: "Where Passion Meets Perfect Indulgence!",
    price: "₹359",
  },

  {
    img: "/blueberry.jpg",
    title: "Blueberry Cake",
    desc: "Indulge in the Sweetness of Blueberry Bliss!",
    price: "₹309",
  },
];

const Menu = () => {
  return (
    <div className="container pt-40">
      <div className="space-y-4 w-fit mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-bold">
          Our <span className="text-orange-600">Menu</span>
        </h2>
        <p className="text-gray-950">
          Explore our delectable menu, filled with a tempting array of cakes,
          pastries, and treats! <br /> Each item is crafted with love and the
          finest ingredients, making every bite a delightful experience. Dive in
          and discover your new favorites!
        </p>
        <div className="w-fit mx-auto">
          <Dash />
        </div>
      </div>

      <ul className="mt-10 hidden sm:flex gap-6 md:gap-10 lg:gap-20 w-fit mx-auto">
        <li className=" bg-orange-600 text-white p-1">Birthday Cakes</li>
        <li>Pestries</li>
        <li>Cupcakes</li>
        <li>Cookies</li>
        <li>Moose</li>
      </ul>

      <div className="grid lg:grid-cols-[35%,1fr] gap-10 pt-10">
        <div className="w-fit mx-auto">
          <Image
            className="w-[100%] max-w-[400px] h-auto"
            src="/homebaked.jpeg"
            width={500}
            height={500}
            alt="dish"
          />
        </div>

        <div className="grid w-fit mx-auto sm:grid-cols-2 gap-4">
          {menuData.map((item, index) => (
            <MenuCard
              key={index}
              img={item.img}
              title={item.title}
              desc={item.desc}
              price={item.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
