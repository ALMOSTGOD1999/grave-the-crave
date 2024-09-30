import Image from "next/image";
import React from "react";

const MenuCard = ({ img, title, desc, price }) => {
  return (
    <div className="flex gap-2">
      <Image
        className="h-[80px] w-[80px]"
        src={img}
        alt="menu image"
        height={500}
        width={500}
      />
      <div className="space-y-2">
        <div>
          <h2>{title}</h2>
          <p className="text-[14px] text-gray-800 pt-1 ">{desc}</p>
        </div>
        <p className="text-orange-600">{price}</p>
      </div>
    </div>
  );
};

export default MenuCard;
