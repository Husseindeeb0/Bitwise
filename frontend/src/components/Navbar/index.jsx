import { useState, useEffect, useRef } from "react";
import { useMyContext } from "../../context";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logout from "../../api/logout";
import {
  FaBars,
  FaHome,
  FaBullhorn,
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FiLogOut, FiArrowUpRight } from "react-icons/fi";
import { GrAnnounce } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { GiAchievement } from "react-icons/gi";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const {
    isAuthenticated,
    setIsAuthenticated,
    setAccessToken,
    accessToken,
    setLoading,
  } = useMyContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropDownRef = useRef(null);
  const [isDisplay, setIsDisplay] = useState(false);

  const toggleDialog = () => setIsDisplay((prev) => !prev);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      setLoading(true);
      const result = await logout(accessToken);
      if (result?.status === "failed" || !result) {
        console.log("Logging out failed", result.message);
      }
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("role");
      setAccessToken(null);
      setIsAuthenticated(false);
      navigate("/login");
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target)) {
        setIsDisplay(false);
      }
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Reusable Nav Components for desktop
  const NavItem = ({ to, label, onClick }) => (
    <Link
      to={to}
      className="group relative flex items-center gap-2 text-dark-purple hover:text-sky-blue transition py-2 px-3"
      onClick={onClick}
    >
      {label}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-blue transition-all duration-300 group-hover:w-full"></span>
    </Link>
  );

  // Mobile nav item
  const MobileNavItem = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 transition-colors group"
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>
      <FiArrowUpRight className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </Link>
  );

  const NavDropdownItem = ({ to, icon, label }) => (
    <li className="cursor-pointer flex gap-2 items-center text-navy-blue hover:bg-sky-blue/30 py-3 p-2">
      <Link
        to={to}
        className="flex gap-2 items-center w-full"
        onClick={toggleDialog}
      >
        {icon} {label}
      </Link>
    </li>
  );

  return (
    <header className="fixed top-0 left-0 w-full h-20 backdrop-blur-3xl bg-white/10 shadow-lg py-2 px-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link to="/">
        <img src="/Bitwise_logo.png" alt="Bitwise" className="w-28" />
      </Link>

      {/* Large screens Nav */}
      <nav className="hidden md:flex gap-6 text-navy-blue text-xl font-semibold">
        <NavItem to="/" label="Home" />
        <NavItem to="/announcements" label="Announcements" />

        {role === "admin" || role === "top_admin" ? (
          <div className="relative" ref={dropDownRef}>
            <button
              className="px-5 py-2 flex items-center gap-3 text-white bg-gradient-to-r from-navy-blue to-sky-blue rounded-lg hover:shadow-md transition-all duration-300 group"
              onClick={toggleDialog}
            >
              <div className="flex items-center justify-center bg-white/20 rounded-full p-1.5">
                <MdManageAccounts className="text-lg" />
              </div>
              <span>Management</span>
              {
                isDisplay ? <FaChevronUp className="text-sm" /> : <FaChevronDown className="text-sm" />
              }
            </button>

            <AnimatePresence>
              {isDisplay && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full right-0 w-72 mt-2 bg-white shadow-xl border border-gray-100 rounded-lg overflow-hidden z-50"
                >
                  <div className="bg-navy-blue py-2 px-4 border-b border-gray-100">
                    <p className="text-sm font-medium text-white">
                      Management Tools
                    </p>
                  </div>
                  <ul className="">
                    {role === "top_admin" && (
                      <NavDropdownItem
                        to="/manageAdmins"
                        icon={<RiAdminFill className="text-navy-blue" />}
                        label="Manage Admins"
                      />
                    )}
                    <NavDropdownItem
                      to="/manageAnnouncements"
                      icon={<GrAnnounce className="text-navy-blue" />}
                      label="Manage Announcements"
                    />
                    <NavDropdownItem
                      to="/manageAchievements"
                      icon={<GiAchievement className="text-navy-blue" />}
                      label="Manage Achievements"
                    />
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : null}

        {!isAuthenticated ? (
          <>
            <NavItem to="/login" label="Login" />
            <NavItem to="/signup" label="Signup" />
          </>
        ) : (
          <button
            className="group relative flex items-center gap-2 text-dark-purple transition hover:text-sky-blue py-2 px-3"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-sky-blue transition-all duration-300 group-hover:w-full"></span>
          </button>
        )}
      </nav>

      {/* Open & Close nav button for mobiles */}
      <button
        onClick={toggleSidebar}
        className="md:hidden text-navy-blue text-2xl z-50"
      >
        {isOpen ? null : <FaBars />}
      </button>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "ease"}}
            className="fixed top-0 right-0 h-screen w-3/4 max-w-sm bg-navy-blue p-6 flex flex-col items-start gap-2 text-white text-lg shadow-lg backdrop-blur-lg"
          >
            <div className="flex justify-between items-center w-full mb-8 border-b border-white/20 pb-6">
              <Link
                to="/"
                className="flex items-center gap-3"
                onClick={toggleSidebar}
              >
                <img src="/logo.png" alt="Bitwise" className="w-12 h-12" />
              </Link>
              <button
                onClick={toggleSidebar}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white"
              >
                <IoClose />
              </button>
            </div>

            <div className="w-full">
              <MobileNavItem
                to="/"
                icon={<FaHome />}
                label="Home"
                onClick={toggleSidebar}
              />

              <MobileNavItem
                to="/announcements"
                icon={<FaBullhorn />}
                label="Announcements"
                onClick={toggleSidebar}
              />
            </div>

            {role === "admin" || role === "top_admin" ? (
              <div className="w-full mt-6 border-t border-white/20 pt-6 space-y-2">
                <h3 className="text-sm uppercase font-bold text-white/70 mb-4 px-3">
                  Management
                </h3>

                {role === "top_admin" && (
                  <MobileNavItem
                    to="/manageAdmins"
                    icon={<RiAdminFill />}
                    label="Manage Admins"
                    onClick={toggleSidebar}
                  />
                )}

                <MobileNavItem
                  to="/manageAnnouncements"
                  icon={<GrAnnounce />}
                  label="Manage Announcements"
                  onClick={toggleSidebar}
                />

                <MobileNavItem
                  to="/manageAchievements"
                  icon={<GiAchievement />}
                  label="Manage Achievements"
                  onClick={toggleSidebar}
                />
              </div>
            ) : null}

            <div className="mt-6 w-full border-t border-white/20 pt-6 space-y-2">
              {!isAuthenticated ? (
                <>
                  <MobileNavItem
                    to="/login"
                    icon={<FaSignInAlt />}
                    label="Login"
                    onClick={toggleSidebar}
                  />

                  <MobileNavItem
                    to="/signup"
                    icon={<FaUserPlus />}
                    label="Signup"
                    onClick={toggleSidebar}
                  />
                </>
              ) : (
                <button
                  onClick={() => {
                    handleLogout();
                    toggleSidebar();
                  }}
                  className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-white/10 text-white transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <FiLogOut />
                    <span>Logout</span>
                  </div>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
