import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import authenticateUser from "../../api/authenticateUser";
import { useMyContext } from "../../context";
import LoggingLoader from "../../components/LoggingLoader";

export default function Signup() {
  const { setAccessToken, setIsAuthenticated } = useMyContext();
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    http://localhost:5173/#/announcementDetails?id=67f8186e33742f4a96dc96a7
    try {
      const data = await authenticateUser(userDetails, "signup");
      if (data.status === "failed") {
        setError(data.message)
        console.log(data.message)
      } else if (data.status === "success" && data.accessToken && data.refreshToken){
        localStorage.setItem("refreshToken", data.refreshToken);
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);
        // After successful login, redirect the user to the desired page
        const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectTo);
      } else {
        setError(data.message)
        console.log(data.message)
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setUserDetails({ username: "", email: "", password: "" });
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-navy-blue to-light-purple p-5">
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold text-navy-blue mb-5">
          Create an Account
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center border-b border-gray-300 p-2">
            <FaUser className="text-navy-blue" />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={userDetails.username}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            />
          </div>

          <div className="flex items-center border-b border-gray-300 p-2">
            <FaEnvelope className="text-navy-blue" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userDetails.email}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            />
          </div>

          <div className="flex items-center border-b border-gray-300 p-2">
            <FaLock className="text-navy-blue" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={userDetails.password}
              minLength={6}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-navy-blue text-white py-2 rounded-lg hover:bg-light-purple transition duration-300"
            disabled={loading}
          >
            {loading ? <LoggingLoader /> : "Sign Up"}
          </button>
        </form>
        
        {/* Error message section */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 bg-red-100 text-red-700 p-3 rounded-lg border border-red-400"
          >
            {error}
          </motion.div>
        )}

        <p className="mt-4 text-gray-500">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-navy-blue cursor-pointer hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
