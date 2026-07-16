import React from "react";

interface props {
  title?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  role: string;
}

const FeatureCard = (props: props) => {
  return (
    <div
      className={`flex flex-col items-center ${
        props.role === "expert" ? "bg-amber-50" : "bg-blue-200"
      } rounded-xl px-4 py-2 shadow-sm w-1/2`}
    >
      <span
        className={`font-bold text-lg ${
          props.role === "expert" ? "text-amber-600" : "text-blue-700"
        }`}
      >
        {props.title}
      </span>
      <span className="text-gray-700 text-sm">{props.description}</span>
    </div>
  );
};

export default FeatureCard;
