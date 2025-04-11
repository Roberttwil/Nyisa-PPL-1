import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Welcome to Home Page</h1>
        <p className="text-gray-600 mb-6">This is a simple home page using React and Tailwind CSS.</p>
        <Link to="/login" className="text-blue-500 underline">Go to Login</Link>
      </div>
    </div>
  );
};

export default Home;
