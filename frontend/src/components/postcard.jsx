import React from "react";

function PostCard({ image, title, description }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden w-60 shadow-md">
      <img src={image} alt="Produk" className="w-full h-36 object-cover" />
      <div className="flex flex-col py-4 px-4 gap-1">
        <h1 className="font-semibold text-base">{title}</h1>
        <div className="text-sm text-gray-600">{description}</div>
      </div>
    </div>
  );
}

export default PostCard;
