import { useState } from "react";
import { useNavigate } from "react-router-dom";
import nyisaLogo from "../assets/nyisaLogo.png";
import { registerRestaurant } from "../services/AuthService"; // Assuming you have this function to handle registration

const Partner = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    
    restaurantName: "",
    email: "",
    phone: "",
    address: "",
    genre: "",
    photo: null,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    // Mengubah formData ketika ada perubahan input
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  
  const handleRegister = async (e) => {
    e.preventDefault();
  
    // Log the address to verify its format
    console.log("Address to geocode:", formData.address);
  
    // Cek apakah semua field telah diisi
    if (
      !formData.username ||
      !formData.password ||
      !formData.restaurantName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.genre
    ) {
      setMessage("All fields are required!");
      return;
    }
  
    setLoading(true);
    setMessage("");
    try {
      // Buat formData untuk mengirimkan data ke backend
      const formDataToSend = new FormData();
      formDataToSend.append("restaurantName", formData.restaurantName);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      formDataToSend.append("genre", formData.genre);
  
      if (formData.photo) {
        formDataToSend.append("photo", formData.photo);
      }
  
      // Lakukan request untuk registrasi restoran
      const response = await registerRestaurant({
        username: formData.username,
        password: formData.password,
        email: formData.email,
        phone: formData.phone,
        restaurantName: formData.restaurantName,
        restaurantType: formData.genre,
        address: formData.address,
      });
  
      // Cek jika registrasi berhasil berdasarkan response message
      if (response.message && response.message.includes("OTP sent to your email")) {
        setMessage(response.message);
  
        // Navigasi ke halaman OTP setelah registrasi berhasil
        setTimeout(() => navigate("/resto-otp"), 2000, { state: { email: formData.email } });
      } else {
        setMessage(response.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      const errorMessage =
        error.message || "Registration failed. Please try again.";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      className="relative flex justify-center items-center min-h-screen"
      style={{
        backgroundImage:
          "linear-gradient(to bottom,rgb(220, 235, 226) 50%, #68D391 80%)",
      }}
    >
      <div className="max-w-md w-full p-8 text-center">
        <img src={nyisaLogo} alt="Logo" className="mb-5 w-30 mx-auto" />
        <h2 className="text-2xl font-semibold text-green-900 mb-2">
          Partner Sign Up
        </h2>
        <p className="text-green-800 text-sm mb-4">
          Please enter your restaurant details to create your partner account
        </p>
        <form onSubmit={handleRegister}>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Username</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Password</label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter a secure password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">
              Restaurant Name
            </label>
            <input
              type="text"
              name="restaurantName"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter restaurant name"
              value={formData.restaurantName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Email</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Phone</label>
            <input
              type="text"
              name="phone"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Address</label>
            <input
              type="text"
              name="address"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter restaurant address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">Genre</label>
            <input
              type="text"
              name="genre"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter restaurant genre"
              value={formData.genre}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-green-900 font-medium">
              Upload Restaurant Photo
            </label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              className="w-full px-4 py-2 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-900 text-white py-2 rounded-lg hover:bg-green-800 transition duration-200 cursor-pointer mt-5"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && <p className="text-black font-bold mt-4">{message}</p>}
      </div>
    </div>
  );
};

export default Partner;
