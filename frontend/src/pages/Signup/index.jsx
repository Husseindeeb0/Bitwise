import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";

export default function Signup() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-navy-blue to-light-purple p-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold text-navy-blue mb-5">
          Create an Account
        </h2>

        <form className="space-y-4">
          <div className="flex items-center border-b border-gray-300 p-2">
            <FaUser className="text-navy-blue" />
            <input
              type="text"
              placeholder="Username"
              className="w-full p-2 outline-none"
            />
          </div>

          <div className="flex items-center border-b border-gray-300 p-2">
            <FaEnvelope className="text-navy-blue" />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-2 outline-none"
            />
          </div>

          <div className="flex items-center border-b border-gray-300 p-2">
            <FaLock className="text-navy-blue" />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 outline-none"
            />
          </div>

          <button className="w-full bg-navy-blue text-white py-2 rounded-lg hover:bg-light-purple transition duration-300">
            Sign Up
          </button>
        </form>
        <p className="mt-4 text-gray-500">
          Already have an account?
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
