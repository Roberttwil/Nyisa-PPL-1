import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebookF,FaGoogle } from "react-icons/fa";
import nyisaLogo from "../assets/nyisaLogo.png";
import { login } from "../services/AuthService"; // Import login from AuthService
import Geometric from "../assets/Union.svg";
import geoStar from "../assets/starGeo.svg";
import halfCirc from "../assets/circleHalf.svg";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Load username and rememberMe from localStorage if it exists
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    const savedRememberMe = localStorage.getItem("rememberMe") === "true";

    if (savedUsername && savedRememberMe) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Tunggu sejenak untuk simulasi loading
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Panggil fungsi login dari AuthService
      const response = await login(username, password);
      console.log("Login Response:", response);

      // Simpan data ke localStorage jika remember me dipilih
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
        localStorage.setItem("username", username);
      } else {
        localStorage.removeItem("rememberMe");
        localStorage.removeItem("username");
      }

      navigate("/"); // Redirect ke halaman utama setelah login berhasil
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    // <div
    //   className="flex justify-center items-center min-h-screen"
    // >
    //   <div className="max-w-md w-full p-8 text-center">
    //     {/* <img src={nyisaLogo} alt="Logo" className="relative -top-10 w-40 mx-auto" /> */}
    //     <h2 className="text-2xl font-bold text-green-900 -my-10 mb-2">Sign In</h2>
    //     <p className="text-green-800 text-lg font-medium">
    //         Hello, please enter your details to get sign in to your <span className="italic">NYISA</span> account
    //     </p>
    //     {/* <div className="flex flex-row justify-center">
    //       <p className="text-green-800 text-lg font-medium">
    //         your 
    //       </p>
    //       <img src={nyisaLogo} alt="Logo" className="relative bottom-6 h-20" />
    //       <p className="text-green-800 text-lg mb-4 font-medium">
    //         account
    //       </p>
    //     </div> */}
        
    //     <form onSubmit={handleLogin}>
    //       <div className="mb-4 text-left">
    //         <label className="block text-green-900 font-medium">Username</label>
    //         <input
    //           type="text"
    //           className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    //           placeholder="Enter your username"
    //           value={username}
    //           onChange={(e) => setUsername(e.target.value)}
    //         />
    //       </div>
    //       <div className="mb-4 text-left relative">
    //         <label className="block text-green-900 font-medium">Password</label>
    //         <input
    //           type={showPassword ? "text" : "password"}
    //           className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
    //           placeholder="Enter your password"
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //         />
    //         <span
    //           className="absolute top-8 right-4 cursor-pointer text-green-700"
    //           onClick={() => setShowPassword(!showPassword)}
    //         >
    //           {showPassword ? "👁️" : "👁️‍🗨️"}
    //         </span>
    //       </div>
    //       <div className="flex justify-between text-sm text-green-900 mb-4">
    //         <label className="flex items-center">
    //           <input
    //             type="checkbox"
    //             className="mr-2 cursor-pointer"
    //             checked={rememberMe}
    //             onChange={() => setRememberMe(!rememberMe)}
    //           />{" "}
    //           Remember me
    //         </label>
    //         <Link to="/forgot" className="font-semibold hover:underline">
    //           Forgot password?
    //         </Link>
    //       </div>
    //       <button
    //         type="submit"
    //         className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer"
    //         disabled={loading}
    //       >
    //         {loading ? "Logging in..." : "Sign In"}
    //       </button>
    //     </form>
    //     <div className="my-4 text-green-900 font-medium">Or Sign In With</div>
    //     <div className="flex gap-3 justify-center">
    //       <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
    //         <img src={googleLogo} alt="Google" className="w-5" /> Google
    //       </button>
    //       <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-gray-100">
    //         <img src={facebookLogo} alt="Facebook" className="w-5" /> Facebook
    //       </button>
    //     </div>
    //     <p className="mt-4 text-green-900 text-sm">
    //       Don't have an account?{" "}
    //       <Link to="/register" className="font-semibold hover:underline">
    //         Sign up here
    //       </Link>
    //     </p>
    //   </div>
    // </div>

    <div>
      <img src={nyisaLogo} alt="Logo" className="relative bottom-5 w-35" />
      <div className="flex flex-col items-center justify-center -my-10">
        <h1 className="font-bold text-3xl">Sign in</h1>
        <p className="w-70 text-center mt-5">Hello, please enter you details to get sign in to your account</p>
        <input type="email" placeholder="Email" className="pl-3 border-2 border-[#103B28] rounded-xl w-70 h-8 my-5"></input>
        <input type="Password" placeholder="Password" className="pl-3 border-2 border-[#103B28] rounded-xl w-70 h-8"></input>
          <div className="flex flex-row gap-20 justify-between mt-2 mb-5">
            <label className="flex items-center gap-1 cursor-pointer">
                <input type="checkbox" className="accent-green-500 w-3 h-3 rounded border-white"/> 
                <span className="text-xs">RememberMe</span>
            </label>    
                <a href=""className="text-xs hover:text-[#145c3c] hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="bg-[#103B28] hover:bg-[#145c3c] w-70 h-8 mb-5 rounded-xl text-white font-medium cursor-pointer transition duration-200">Sign in </button>
          <h2 className="text-l font-semibold text-[#103B28] mb-5">Or sign with</h2>
          <div className="flex flex-row gap-5 mb-10">
            <button className="bg-[#103B28] hover:bg-[#145c3c] px-7 py-2 rounded-full cursor-pointer ">
              <FaGoogle className="text-white w-4 h-4"/>
            </button>
            <button className="bg-[#103B28] hover:bg-[#145c3c] px-7 py-2 rounded-full cursor-pointer ">
              <FaFacebookF className="text-white w-4 h-4"/>
            </button>
          </div>
          <p>Don`t have an account? <a href="/register" className="hover:text-[#145c3c] hover:underline ">Create here</a></p>
          <img src={Geometric} className="absolute left-0 bottom-15 w-30"></img>
          <img src={geoStar} className="absolute right-90 top-25 w-15"></img>
          <img src={geoStar} className="absolute left-90 bottom-25 w-15"></img>
          <img src={halfCirc} className="absolute right-0 bottom-0 w-25"></img>
      </div>
    </div>
  );
};

export default Login;