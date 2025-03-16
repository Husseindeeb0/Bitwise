import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaHome,
  FaBullhorn,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-3xl bg-white/10 shadow-lg py-2 px-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Bitwise" className="w-16" />
      </Link>

      {/* Large screens Nav */}
      <nav className="hidden md:flex gap-6 text-navy-blue text-xl font-semibold">
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer transition hover:scale-110"
        >
          <FaHome /> Home
        </Link>
        <Link
          to="/announcements"
          className="flex items-center gap-2 cursor-pointer transition hover:scale-110"
        >
          <FaBullhorn /> Announcements
        </Link>
        <Link
          to="/login"
          className="flex items-center gap-2 cursor-pointer transition hover:scale-110"
        >
          <FaSignInAlt /> Login
        </Link>
        <Link
          to="/signup"
          className="flex items-center gap-2 cursor-pointer transition hover:scale-110"
        >
          <FaUserPlus /> Signup
        </Link>
      </nav>

      {/* Open & Close nav button for mobiles */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-white text-2xl z-50"
      >
        {isOpen ? <IoClose /> : <FaBars />}
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={sidebarRef}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="fixed top-0 right-0 h-screen w-2/3 bg-navy-blue/80 p-6 flex flex-col items-center gap-6 text-white text-lg shadow-lg transform"
        >
          <Link
            to="/"
            onClick={toggleSidebar}
            className="flex items-center gap-2 transition hover:text-dark-purple"
          >
            <FaHome /> Home
          </Link>
          <Link
            to="/announcements"
            onClick={toggleSidebar}
            className="flex items-center gap-2 transition hover:text-dark-purple"
          >
            <FaBullhorn /> Announcements
          </Link>
          <Link
            to="/login"
            onClick={toggleSidebar}
            className="flex items-center gap-2 transition hover:text-dark-purple"
          >
            <FaSignInAlt /> Login
          </Link>
          <Link
            to="/signup"
            onClick={toggleSidebar}
            className="flex items-center gap-2 transition hover:text-dark-purple"
          >
            <FaUserPlus /> Signup
          </Link>
        </motion.div>
      )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
