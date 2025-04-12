import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Navbar from "../../components/Navbar";
import authenticateUser from "../../api/authenticateUser";
import { useMyContext } from "../../context";
import LoggingLoader from "../../components/LoggingLoader";

export default function Login() {
  const { setAccessToken, setIsAuthenticated } = useMyContext();
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setLoginDetails({
      ...loginDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await authenticateUser(loginDetails, "login");
      if (data.status === "failed") {
        setError(data.message);
        console.log(data.message);
      } else if (
        data.status === "success" &&
        data.accessToken &&
        data.refreshToken
      ) {
        localStorage.setItem("refreshToken", data.refreshToken);
        setAccessToken(data.accessToken);
        setIsAuthenticated(true);
        // After successful login, redirect the user to the desired page
        const redirectTo = sessionStorage.getItem("redirectAfterLogin") || "/";
        sessionStorage.removeItem("redirectAfterLogin");
        navigate(redirectTo);
      } else {
        setError(data.message);
        console.log(data.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoginDetails({ email: "", password: "" });
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
        <h2 className="text-2xl font-bold text-navy-blue mb-5">Welcome Back</h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex items-center border-b border-gray-300 p-2">
            <FaEnvelope className="text-navy-blue" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={loginDetails.email}
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
              value={loginDetails.password}
              onChange={handleChange}
              className="w-full p-2 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full ${
              loading ? "bg-light-purple" : "bg-navy-blue"
            } text-lg text-white py-2 rounded-lg hover:bg-light-purple transition duration-300`}
            disabled={loading}
          >
            {loading ? <LoggingLoader /> : "Login"}
          </button>
        </form>

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
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-navy-blue cursor-pointer hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
