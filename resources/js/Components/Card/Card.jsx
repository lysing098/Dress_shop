import React from 'react';
import { FaRegHeart } from "react-icons/fa";

const Card = ({ name, price, image_path }) => {
  return (
    <div className="w-[300px]">
      <div className="relative bg-gray-300">
        <img
          src={image_path}
          alt={name}
          className="w-full h-[300px] object-cover rounded"
        />
        {/* Heart icon positioned top-right */}
        <FaRegHeart className="absolute top-2 right-5 text-white text-xl cursor-pointer hover:text-pink-500" />
      </div>
      <div className="px-3 py-1">
        <p className="line-clamp-1 capitalize font-medium">{name}</p>
        <p className="text-red-600 font-semibold">${price}</p>
      </div>
    </div>
  );
};

export default Card;
