import React from "react";

function Profile (){
    return (
        <div className="w-full flex justify-center items-center my-10">
            <div className="flex flex-row gap-2">
                <div className="bg-amber-400 px-8 py-10 rounded-xl">
                    <img src="" alt="" className="rounded-full w-32 h-32 object-cover bg-black mx-auto"/>
                    <h2 className="text-center text-4xl font-bold mt-5 mb-20 text-white">Robert ganteng</h2>
                    <label className="text-sm font-medium bg-lime-400 px-10 py-1 rounded-full cursor-pointer">
                        Change Picture
                        <input type="file" accept="image/*" className="hidden"/>
                    </label>
                </div>
                <div className="bg-blue-400 rounded-xl p-5 w-full ">
                    <h1 className="text-4xl font-semibold text-left text-white">Personal Information</h1>
                    <div className="flex flex-col">
                        <div className="flex flex-row gap-10 my-15">
                            <div className="bg-[#0D3B2E] h-20 w-50 pt-3 pl-3 rounded-lg">
                                <h2 className="text-white font-bold text-xl">Username</h2>
                                <p className="text-white">Robert Ganteng</p>
                            </div>
                            <div className="bg-[#0D3B2E] h-20 w-50 pt-3 pl-3 rounded-lg">
                                <h2 className="text-white font-bold text-xl">Email</h2>
                                <p className="text-white">Robertganskuy@gmail.com</p>
                            </div>
                            <div className="bg-[#0D3B2E] h-20 w-50 pt-3 pl-3 rounded-lg">
                                <h2 className="text-white font-bold text-xl">Address</h2>
                                <p className="text-white">Robert Ganteng</p>
                            </div>
                        </div>
                        <div className="flex flex-row gap-10 -my-10">
                            <div className="bg-[#0D3B2E] h-20 w-50 pt-3 pl-3 rounded-lg">
                                <h2 className="text-white font-bold text-xl">Phone Number</h2>
                                <p className="text-white">Robert Ganteng</p>
                            </div>
                            <div className="bg-[#0D3B2E] h-20 w-50 pt-3 pl-3 rounded-lg">
                                <h2 className="text-white font-bold text-xl">Status</h2>
                                <p className="text-white">Robert Ganteng</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
}

export default Profile;