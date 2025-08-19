import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import { signup } from "../../features/auth/authThunks";
import LoggingLoader from "../../components/LoggingLoader";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../features/auth/authSlice";
import { Helmet } from "@dr.pogodin/react-helmet";

export default function Signup() {
  const dispatch = useDispatch();
  const isAuthenticating = useSelector((state) => state.auth.isAuthenticating);
  const error = useSelector((state) => state.auth.error);

  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(authActions.clearError());
    try {
      await dispatch(signup(userDetails)).unwrap();
    } catch (error) {
      console.log("Sign up failed:", error);
    } finally {
      setUserDetails({ username: "", email: "", password: "" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-background1 to-background2 p-5">
      {/* Meta tags for SEO + social */}
      <Helmet>
        {/* Title & Description */}
        <title>Signup</title>
        <meta
          name="description"
          content="Join BitwiseClub today and start your programming journey! Get access to exclusive events, updates, and resources to grow your coding skills and connect with like minded learners."
        />

        {/* Open Graph */}
        <meta property="og:title" content="Signup – BitwiseClub" />
        <meta
          property="og:description"
          content="Join BitwiseClub today and start your programming journey! Get access to exclusive events, updates, and resources to grow your coding skills and connect with like-minded learners."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bitwiseclub.com/" />
        <meta property="og:image" content="https://bitwiseclub.com/logo.png" />

        {/* Twitter (X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Signup - BitwiseClub" />
        <meta
          name="twitter:description"
          content="Join BitwiseClub today and start your programming journey! Get access to exclusive events, updates, and resources to grow your coding skills and connect with like-minded learners."
        />
        <meta name="twitter:image" content="https://bitwiseclub.com/logo.png" />
        <meta name="twitter:creator" content="@BitwiseClub" />
      </Helmet>
      <Navbar />
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/50 shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
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
            className={`w-full ${
              isAuthenticating ? "bg-navy-blue/80" : "bg-navy-blue"
            } text-lg text-white py-2 rounded-lg hover:bg-navy-blue/80 transition duration-300`}
            disabled={isAuthenticating}
          >
            {isAuthenticating ? <LoggingLoader /> : "Sign Up"}
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
