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
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { FiLogOut } from "react-icons/fi";
import { GrAnnounce } from "react-icons/gr";
import { RiAdminFill } from "react-icons/ri";
import { GiAchievement } from "react-icons/gi";

const Navbar = () => {
  const role = localStorage.getItem("role");
  const { isAuthenticated, setIsAuthenticated, setAccessToken, accessToken, setLoading } =
    useMyContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropDownRef = useRef(null);
  const [isDisplay, setIsDisplay] = useState(false);

  const toggleDialog = () => setIsDisplay((prev) => !prev);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      setLoading(true)
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

  // Reusable Nav Components
  const NavItem = ({ to, icon, label, onClick }) => (
    <Link
      to={to}
      className="flex items-center gap-2 transition hover:text-dark-purple text-center"
      onClick={onClick}
    >
      {icon} {label}
    </Link>
  );

  const NavDropdownItem = ({ to, icon, label }) => (
    <li className="cursor-pointer flex gap-2 items-center text-navy-blue hover:bg-light p-2 rounded-md">
      <Link to={to} className="flex gap-2 items-center" onClick={toggleDialog}>
        {icon} {label}
      </Link>
    </li>
  );

  return (
    <header className="fixed top-0 left-0 w-full backdrop-blur-3xl bg-white/10 shadow-lg py-2 px-4 flex justify-between items-center z-50">
      {/* Logo */}
      <Link to="/">
        <img src="/logo.png" alt="Bitwise" className="w-16" />
      </Link>

      {/* Large screens Nav */}
      <nav className="hidden md:flex gap-6 text-navy-blue text-xl font-semibold">
        <NavItem to="/" icon={<FaHome />} label="Home" />
        <NavItem
          to="/announcements"
          icon={<FaBullhorn />}
          label="Announcements"
        />

        {!isAuthenticated ? (
          <>
            <NavItem to="/login" icon={<FaSignInAlt />} label="Login" />
            <NavItem to="/signup" icon={<FaUserPlus />} label="Signup" />
          </>
        ) : (
          <button
            className="flex items-center gap-2 transition hover:text-dark-purple"
            onClick={handleLogout}
          >
            <FiLogOut /> Logout
          </button>
        )}

        {role === "admin" || role === "top_admin" ? (
          <div className="relative" ref={dropDownRef}>
            <button
              className="px-4 py-2 flex gap-2 items-center text-lg text-white bg-navy-blue rounded-md hover:bg-dark-purple"
              onClick={toggleDialog}
            >
              <MdManageAccounts />
              Management
            </button>

            {isDisplay && (
              <div className="absolute top-full -left-16 w-56 mt-2 bg-white shadow-lg border border-gray-300 rounded-md p-2">
                <ul className="space-y-2 text-sm">
                  {role === "top_admin" && (
                    <NavDropdownItem
                      to="/manageAdmins"
                      icon={<RiAdminFill />}
                      label="Manage Admins"
                    />
                  )}
                  <NavDropdownItem
                    to="/manageAnnouncements"
                    icon={<GrAnnounce />}
                    label="Manage Announcements"
                  />
                  <NavDropdownItem
                    to="/manageAchievements"
                    icon={<GiAchievement />}
                    label="Manage Achievements"
                  />
                </ul>
              </div>
            )}
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
            <NavItem
              to="/"
              icon={<FaHome />}
              label="Home"
              onClick={toggleSidebar}
            />
            <NavItem
              to="/announcements"
              icon={<FaBullhorn />}
              label="Announcements"
              onClick={toggleSidebar}
            />

            {role === "admin" || role === "top_admin" ? (
              <div className="flex flex-col items-center gap-6">
                {role === "top_admin" && (
                  <NavItem
                    to="/manageAdmins"
                    icon={<RiAdminFill />}
                    label="Manage Admins"
                    onClick={toggleSidebar}
                  />
                )}
                <NavItem
                  to="/manageAnnouncements"
                  icon={<GrAnnounce />}
                  label="Manage Announcements"
                  onClick={toggleSidebar}
                />
                <NavItem
                  to="/manageAchievements"
                  icon={<GiAchievement />}
                  label="Manage Achievements"
                  onClick={toggleSidebar}
                />
              </div>
            ) : null}

            {!isAuthenticated ? (
              <>
                <NavItem
                  to="/login"
                  icon={<FaSignInAlt />}
                  label="Login"
                  onClick={toggleSidebar}
                />
                <NavItem
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
                className="flex items-center gap-2 transition hover:text-dark-purple"
              >
                <FiLogOut /> Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
