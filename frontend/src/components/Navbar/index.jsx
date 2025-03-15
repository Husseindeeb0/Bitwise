import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaHome, FaBullhorn, FaSignInAlt, FaUserPlus } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import logo from "../../assets/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-3xl bg-white/10 shadow-lg py-2 px-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link to="/">
        <img src={logo} alt="Bitwise" className="w-16" />
      </Link>

      {/* Large screens Nav */}
      <nav className="hidden md:flex gap-6 text-navy-blue text-xl font-semibold">
        <Link to="/" className="flex items-center gap-2 cursor-pointer transition hover:scale-110">
          <FaHome /> Home
        </Link>
        <Link to="/announcements" className="flex items-center gap-2 cursor-pointer transition hover:scale-110">
          <FaBullhorn /> Announcements
        </Link>
        <Link to="/login" className="flex items-center gap-2 cursor-pointer transition hover:scale-110">
          <FaSignInAlt /> Login
        </Link>
        <Link to="/signup" className="flex items-center gap-2 cursor-pointer transition hover:scale-110">
          <FaUserPlus /> Signup
        </Link>
      </nav>

      {/* Open & Close nav button for mobiles */}
      <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white text-2xl z-10">
        {isOpen ? <IoClose /> : <FaBars />}
      </button>

      {/* Mobile Nav */}
      {isOpen && (
        <div
          className="fixed top-0 right-0 h-screen w-2/3 bg-black/80 p-6 flex flex-col items-center gap-6 text-white text-lg"
        >
          <Link to="roadmaps" className="flex items-center gap-2 transition">
            <FaHome /> Home
          </Link>
          <Link to="Resources" className="flex items-center gap-2 transition">
            <FaBullhorn /> Announcements
          </Link>
          <Link to="Resources" className="flex items-center gap-2 transition">
            <FaSignInAlt /> Login
          </Link>
          <Link to="Resources" className="flex items-center gap-2 transition">
            <FaUserPlus /> Signup
          </Link>
        </div>
      )}
    </header>
  );
};

export default Navbar;
