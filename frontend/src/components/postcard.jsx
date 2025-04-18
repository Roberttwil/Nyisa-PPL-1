import React from "react";

function PostCard ({image, logo, text}){
    return(
        <div className="bg-white rounded-xl overflow-hidden w-60 shadow-md">
            <img src={image} alt="Produk" className="w-full h-36 object-cover" />
            <div className="flex flex-row justify-start items-center py-4 px-4">
                <img src={logo} alt="Logo Brand" className="h-6" />
                <h1 className="font-semibold ml-3">{text}</h1>
            </div>
        </div>
    );
}

export default PostCard;