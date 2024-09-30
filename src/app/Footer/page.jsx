import React from "react";

import { FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import { BsTwitter, BsPinterest, BsWhatsapp } from "react-icons/bs";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="container pt-40">
      <div className="grid md:grid-cols-3 gap-16">
        <div className="space-y-4">
          <Link href="/aboutus">
            {" "}
            <h2 className="text-xl font-bold">About Us</h2>
          </Link>
          <p className="leading-[1.8]">
            Welcome to our cozy corner of sweetness! At{" "}
            <span className="text-orange-600">Grave the Crave</span>, we’re
            passionate about baking delightful treats made from scratch with
            love. Our journey started in a home kitchen, and we pride ourselves
            on blending tradition with creativity. Join us in celebrating every
            occasion with our handcrafted cakes and pastries that bring joy to
            your table!
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold  ">
            Grave the <span className="text-orange-600">Crave</span>
          </h2>

          <ul className="space-y-2">
            <Link href="/aboutus">
              <li>
                About <span className="text-orange-600">Us</span>
              </li>
            </Link>

            <Link href="/">
              {" "}
              <li>Events</li>
            </Link>

            <Link href="/">
              <li>Contacts</li>
            </Link>

            <Link href="/">
              {" "}
              <li>Chefs</li>
            </Link>
          </ul>
        </div>

        <div>
          <div className="flex gap-8 text-orange-600 text-2xl pt-16">
            <Link
              href={"https://www.facebook.com/profile.php?id=61552625923857"}
            >
              <FaFacebookF />
            </Link>
            <Link href={"https://wa.me/+917001480849"}>
              <BsWhatsapp />
            </Link>
            <BsTwitter />
            <BsPinterest />
            <FaLinkedinIn />
          </div>
        </div>
      </div>

      <div className="w-fit mx-auto pt-16 pb-8 text-[14px] sm:text-[16px]">
        &copy; Copyright 2024 All rights reserved
      </div>
    </div>
  );
};

export default Footer;
