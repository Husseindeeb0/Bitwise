import { motion } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-navy-blue to-light-purple p-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
      >
        <h2 className="text-2xl font-bold text-navy-blue mb-5">Welcome Back</h2>

        <form className="space-y-4">
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
            Login
          </button>
        </form>

        <p className="mt-4 text-gray-500">
          Don't have an account?
          <Link
            to="/signup"
            className="text-light-purple cursor-pointer hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
