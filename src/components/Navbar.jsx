import Image from "next/image";
import Link from "next/link";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { ModeToggle } from "./toggle";

const Navbar = () => {
  return (
    <div className="container pt-6">
      <div className="flex justify-between items-center">
        <Image
          src="/logo.png"
          width={180}
          height={160}
          alt="logo"
          className=" md:flex hidden "
        />

        <ul className="md:flex hidden gap-8 items-center font-semibold text-[14px]">
          <Link href="/ ">Home</Link>
          <Link href="/Footer">About</Link>
          <Link href="/Featured">Cakes</Link>

          <Link href="/Survey">Survey</Link>
          <Link href="/Footer">Contact</Link>

          <ModeToggle />

          <Link href="/Signup">
            <button className="bg-orange-600 text-white px-6 py-2 rounded-3xl">
              Sign Up
            </button>
          </Link>
        </ul>
        <AiOutlineMenu
          size={30}
          className="md:hidden text-orange-700 "
          // onClick={whtgiwgh}
        />
      </div>
    </div>
  );
};

export default Navbar;
