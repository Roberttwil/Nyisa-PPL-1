import React from "react";

function PostCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden w-full sm:w-44 md:w-52 lg:w-60 shadow-md mx-auto">
      <img src={image} alt="Produk" className="w-full h-36 object-cover" />
      <div className="flex flex-col py-4 px-4 gap-1">
        <h1 className="font-semibold text-base sm:text-sm md:text-base">{title}</h1>
        <div className="text-sm text-gray-600 sm:text-xs md:text-sm">{description}</div>
      </div>
    </div>
  );
}

export default PostCard;
