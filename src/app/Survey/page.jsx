import Image from "next/image";
import React from "react";

const Survey = () => {
  return (
    <div className="container pt-40">
      <div className=" grid lg:grid-cols-[50% ,1fr] gap-20">
        <div>
          <Image
            src="/survey.png"
            alt="survey image"
            height={600}
            width={600}
            className="w-[100%] h-auto lg:w-auto lg:h-[90vh]"
          />
        </div>

        <div className="self-center">
          <h2 className="text-4xl md:text-6xl font-bold ">Survey </h2>
          <h2 className="text-4xl md:text-6xl font-bold pt-3">
            about our <span className="text-orange-600">Food</span>
          </h2>

          <p className="text-gray-950 pt-16">
            Our website's food page survey aims to gather valuable feedback from
            visitors to enhance their experience. We seek insights on content
            quality, recipe variety, ease of navigation, and overall
            satisfaction.
          </p>

          <p className="text-gray-700 pt-8">
            Your input will help us refine our offerings and better meet your
            culinary needs.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Survey;
