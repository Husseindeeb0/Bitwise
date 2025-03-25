import { useState, useEffect, useRef } from "react";
import { useMyContext } from "../../context";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logout from "../../api/logout";
import {
  FaBars,
  FaHome,
  FaBullhorn,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { GrAnnounce } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { GiAchievement } from "react-icons/gi";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, setIsAuthenticated, setAccessToken, role } =
    useMyContext();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropDownRef = useRef(null);
  const [isDisplay, setIsDisplay] = useState(false);

  const toggleDialog = () => {
    setIsDisplay(!isDisplay);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = async () => {
    try {
      const result = await logout();
      if (result?.status === "failed" || !result) {
        console.log("Logging out failed", result);
        return;
      }
      localStorage.removeItem("refreshToken");
      setAccessToken("");
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDisplay(false);
      }
    };

    if (isDisplay) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDisplay]);

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
        {!isAuthenticated ? (
          <>
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
          </>
        ) : (
          <button
            className="flex items-center gap-2 cursor-pointer transition hover:scale-110"
            onClick={() => handleLogout()}
          >
            <FiLogOut /> Logout
          </button>
        )}

        {/* {true ? ( */}
        {role === "admin" || role === "top-admin" ? (
          <div className="relative" ref={dropDownRef}>
            {/* Management Button */}
            <button
              className="px-4 py-2 flex gap-2 items-center text-lg text-white bg-navy-blue rounded-md hover:bg-dark-purple"
              onClick={toggleDialog}
            >
              <MdManageAccounts />
              Management
            </button>
            {/* Dialog Dropdown */}
            <dialog
              open={isDisplay}
              className="absolute top-full -left-16 w-52 mt-2 bg-white shadow-lg border border-gray-300 rounded-md p-2"
              onClose={() => setIsDisplay(false)}
            >
              <ul className="space-y-2 mt-2 text-sm">
                <li className="cursor-pointer text-navy-blue hover:bg-light p-2 rounded-md">
                  <Link to="/manageAdmins" className="flex gap-2 items-center">
                    <RiAdminFill />
                    Manage Admins
                  </Link>
                </li>
                <li className="cursor-pointer flex gap-2 items-center text-navy-blue hover:bg-light p-2 rounded-md">
                  <GrAnnounce />
                  Announcements Center
                </li>
                <li className="cursor-pointer flex gap-2 items-center text-navy-blue hover:bg-light p-2 rounded-md">
                  <GiAchievement className="text-lg" />
                  Achievements Center
                </li>
              </ul>
            </dialog>
          </div>
        ) : null}
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
            {!isAuthenticated ? (
              <>
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
              </>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  toggleSidebar();
                }}
                className="flex items-center gap-2 transition hover:text-dark-purple"
              >
                <FaUserPlus /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
