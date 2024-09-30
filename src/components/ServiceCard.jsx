import Image from "next/image";
import React from "react";

const ServiceCard = ({ img, title, desc }) => {
  return (
    <div>
      <div className="space-y-3 text-center">
        <Image
          className="mx-auto"
          src={img}
          width={70}
          height={70}
          alt={title}
        />

        <div className="uppercase">
          {title}
          <div className="fles gap-2 w-fit mx-auto mt-2">
            <div className=" w-[7px], h-[7px] rounded-full" />
            <div className=" w-[7px], h-[7px] rounded-full" />
            <div className=" w-[7px], h-[7px] rounded-full" />
          </div>
        </div>

        <p className="mx-auto">{desc}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
