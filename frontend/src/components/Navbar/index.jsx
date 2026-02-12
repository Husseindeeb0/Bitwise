import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { logout } from '../../features/auth/authThunks';
import { useDispatch, useSelector } from 'react-redux';
import {
  FaBars,
  FaHome,
  FaBullhorn,
  FaSignInAlt,
  FaUserPlus,
  FaChevronDown,
  FaGraduationCap,
} from 'react-icons/fa';
import { MdManageAccounts } from 'react-icons/md';
import { IoClose } from 'react-icons/io5';
import { FiLogOut, FiBookOpen } from 'react-icons/fi';
import { GrAnnounce } from 'react-icons/gr';
import { RiAdminFill } from 'react-icons/ri';
import { GiAchievement } from 'react-icons/gi';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const userData = useSelector((state) => state.auth.userData);
  const role = userData?.role;
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const dropDownRef = useRef(null);
  const [isDisplay, setIsDisplay] = useState(false);

  const toggleDialog = () => setIsDisplay((prev) => !prev);
  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      navigate('/login');
    } catch (error) {
      console.log('Logout failed:', error);
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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Check if a path is currently active
  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  // Check if any management route is active
  const isManagementActive = () => {
    return [
      '/manageAdmins',
      '/manageAnnouncements',
      '/manageCourses',
      '/manageAchievements',
    ].some((p) => location.pathname.startsWith(p));
  };

  // Desktop nav link with active indicator
  const NavItem = ({ to, label, onClick }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className="relative flex items-center gap-2 py-2 px-3 group"
        onClick={onClick}
      >
        <span
          className={`relative z-10 transition-colors duration-300 ${
            active
              ? 'text-sky-blue font-bold'
              : 'text-dark-purple group-hover:text-navy-blue'
          }`}
        >
          {label}
        </span>
        {/* Animated active indicator pill */}
        {active && (
          <motion.span
            layoutId="activeNavIndicator"
            className="absolute bottom-0 left-1 right-1 h-[3px] rounded-full bg-gradient-to-r from-sky-blue to-navy-blue"
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          />
        )}
        {/* Hover underline (only when not active) */}
        {!active && (
          <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-full bg-sky-blue/40 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        )}
      </Link>
    );
  };

  // Staggered mobile nav item with slide-in animation
  const MobileNavItem = ({ to, icon, label, onClick, index = 0 }) => {
    const active = isActive(to);
    return (
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.08 * index, duration: 0.3, ease: 'easeOut' }}
      >
        <Link
          to={to}
          className={`flex items-center justify-between w-full p-3 rounded-xl transition-all duration-200 group ${
            active
              ? 'bg-white/15 border border-white/20 shadow-lg shadow-sky-blue/5'
              : 'hover:bg-white/10'
          }`}
          onClick={onClick}
        >
          <div className="flex items-center gap-3">
            <span
              className={`text-lg ${
                active
                  ? 'text-sky-blue'
                  : 'text-white/70 group-hover:text-white'
              }`}
            >
              {icon}
            </span>
            <span
              className={`${
                active ? 'text-white font-semibold' : 'text-white/90'
              }`}
            >
              {label}
            </span>
          </div>
          {active && <span className="w-1.5 h-1.5 rounded-full bg-sky-blue" />}
        </Link>
      </motion.div>
    );
  };

  // Desktop dropdown item
  const NavDropdownItem = ({ to, icon, label }) => {
    const active = isActive(to);
    return (
      <li>
        <Link
          to={to}
          className={`flex gap-3 items-center px-4 py-3 transition-all duration-200 group ${
            active
              ? 'bg-sky-blue/15 text-navy-blue border-l-[3px] border-sky-blue'
              : 'text-dark-purple hover:bg-sky-blue/10 hover:text-navy-blue border-l-[3px] border-transparent hover:border-sky-blue/50'
          }`}
          onClick={toggleDialog}
        >
          <span
            className={`text-lg ${active ? 'text-sky-blue' : 'text-navy-blue/70 group-hover:text-navy-blue'}`}
          >
            {icon}
          </span>
          <span className="font-medium text-[15px]">{label}</span>
        </Link>
      </li>
    );
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 py-2 px-6 flex justify-between items-center z-50 bg-white/80 backdrop-blur-xl shadow-lg shadow-navy-blue/5 border-b border-white/50">
      <Link to="/" className="relative group">
        <motion.img
          src="/Bitwise_logo.png"
          alt="Bitwise"
          className="w-28 transition-transform duration-300 group-hover:scale-105"
          whileTap={{ scale: 0.95 }}
        />
        {/* Subtle glow on hover */}
        <div className="absolute inset-0 bg-sky-blue/10 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-1 text-navy-blue text-[17px] font-semibold">
        <NavItem to="/" label="Home" />
        <NavItem to="/announcements" label="Announcements" />
        <NavItem to="/courses" label="Courses" />

        {/* Management Dropdown */}
        {(role === 'admin' || role === 'top_admin') && (
          <div className="relative ml-1" ref={dropDownRef}>
            <button
              className={`px-4 py-2 flex items-center gap-2.5 rounded-xl transition-all duration-300 group ${
                isManagementActive()
                  ? 'bg-gradient-to-r from-navy-blue to-sky-blue text-white shadow-lg shadow-navy-blue/25'
                  : 'bg-gradient-to-r from-navy-blue to-sky-blue text-white shadow-md shadow-navy-blue/15 hover:shadow-lg hover:shadow-navy-blue/25 hover:scale-[1.02]'
              }`}
              onClick={toggleDialog}
            >
              <div className="flex items-center justify-center bg-white/20 rounded-lg p-1.5">
                <MdManageAccounts className="text-base" />
              </div>
              <span className="text-[15px]">Management</span>
              <motion.div
                animate={{ rotate: isDisplay ? 180 : 0 }}
                transition={{ duration: 0.25 }}
              >
                <FaChevronDown className="text-xs" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isDisplay && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full right-0 w-72 mt-3 bg-white/95 backdrop-blur-xl shadow-2xl shadow-navy-blue/10 border border-gray-100/80 rounded-2xl overflow-hidden z-50"
                >
                  {/* Dropdown header with gradient */}
                  <div className="bg-gradient-to-r from-navy-blue to-sky-blue/80 py-3 px-4">
                    <p className="text-sm font-semibold text-white tracking-wide">
                      Management Tools
                    </p>
                    <p className="text-[11px] text-white/70 mt-0.5">
                      Manage your platform content
                    </p>
                  </div>
                  <ul className="py-1">
                    {role === 'top_admin' && (
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
                      to="/manageCourses"
                      icon={<FaGraduationCap />}
                      label="Manage Courses"
                    />
                    <NavDropdownItem
                      to="/manageAchievements"
                      icon={<GiAchievement />}
                      label="Manage Achievements"
                    />
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Divider */}
        <div className="w-px h-6 bg-gray-300/60 mx-2" />

        {/* Auth buttons */}
        {!userData ? (
          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className={`relative px-4 py-2 rounded-xl text-[15px] transition-all duration-300 ${
                isActive('/login')
                  ? 'text-navy-blue font-bold bg-sky-blue/10'
                  : 'text-dark-purple hover:text-navy-blue hover:bg-gray-100/60'
              }`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2 bg-gradient-to-r from-navy-blue to-sky-blue text-white text-[15px] rounded-xl shadow-md shadow-navy-blue/15 hover:shadow-lg hover:shadow-navy-blue/25 hover:scale-[1.02] transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-dark-purple hover:text-red-500 hover:bg-red-50/60 transition-all duration-300 group"
            onClick={handleLogout}
          >
            <FiLogOut className="group-hover:rotate-[-12deg] transition-transform duration-300" />
            <span className="text-[15px]">Logout</span>
          </button>
        )}
      </nav>

      {/* Mobile Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-navy-blue/5 hover:bg-navy-blue/10 transition-colors duration-200 z-50"
      >
        {!isOpen && <FaBars className="text-navy-blue text-lg" />}
      </button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 bg-dark-purple/40 backdrop-blur-sm z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={sidebarRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-screen w-[80%] max-w-sm z-50 md:hidden"
          >
            {/* Sidebar background with gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-navy-blue via-navy-blue to-dark-purple" />
            {/* Decorative accent */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-sky-blue/10 to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-sky-blue/5 to-transparent" />

            {/* Content */}
            <div className="relative h-full p-6 flex flex-col overflow-y-auto">
              {/* Header */}
              <div className="flex justify-between items-center mb-8 pb-5 border-b border-white/10">
                <Link
                  to="/"
                  className="flex items-center gap-3"
                  onClick={toggleSidebar}
                >
                  <div className="w-11 h-11 rounded-xl bg-white/10 border border-white/10 p-1.5 flex items-center justify-center">
                    <img
                      src="/logo.png"
                      alt="Bitwise"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-white font-bold text-lg tracking-wide">
                      Bitwise
                    </span>
                    <span className="block text-sky-blue/70 text-[10px] font-medium tracking-widest uppercase">
                      Club
                    </span>
                  </div>
                </Link>
                <button
                  onClick={toggleSidebar}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-white transition-all duration-200"
                >
                  <IoClose className="text-lg" />
                </button>
              </div>

              {/* Navigation Label */}
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-3 px-3">
                Navigation
              </p>

              {/* Main Nav Links */}
              <div className="w-full space-y-1">
                <MobileNavItem
                  to="/"
                  icon={<FaHome />}
                  label="Home"
                  onClick={toggleSidebar}
                  index={0}
                />
                <MobileNavItem
                  to="/announcements"
                  icon={<FaBullhorn />}
                  label="Announcements"
                  onClick={toggleSidebar}
                  index={1}
                />
                <MobileNavItem
                  to="/courses"
                  icon={<FiBookOpen />}
                  label="Courses"
                  onClick={toggleSidebar}
                  index={2}
                />
              </div>

              {/* Management Section */}
              {(role === 'admin' || role === 'top_admin') && (
                <div className="w-full mt-6 pt-5 border-t border-white/10">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-semibold mb-3 px-3">
                    Management
                  </p>
                  <div className="space-y-1">
                    {role === 'top_admin' && (
                      <MobileNavItem
                        to="/manageAdmins"
                        icon={<RiAdminFill />}
                        label="Manage Admins"
                        onClick={toggleSidebar}
                        index={3}
                      />
                    )}
                    <MobileNavItem
                      to="/manageAnnouncements"
                      icon={<GrAnnounce />}
                      label="Manage Announcements"
                      onClick={toggleSidebar}
                      index={4}
                    />
                    <MobileNavItem
                      to="/manageCourses"
                      icon={<FaGraduationCap />}
                      label="Manage Courses"
                      onClick={toggleSidebar}
                      index={5}
                    />
                    <MobileNavItem
                      to="/manageAchievements"
                      icon={<GiAchievement />}
                      label="Manage Achievements"
                      onClick={toggleSidebar}
                      index={6}
                    />
                  </div>
                </div>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* Auth Section at Bottom */}
              <div className="mt-6 pt-5 border-t border-white/10">
                {!userData ? (
                  <div className="space-y-2">
                    <MobileNavItem
                      to="/login"
                      icon={<FaSignInAlt />}
                      label="Login"
                      onClick={toggleSidebar}
                      index={7}
                    />
                    <motion.div
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.64, duration: 0.3 }}
                    >
                      <Link
                        to="/signup"
                        onClick={toggleSidebar}
                        className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-gradient-to-r from-sky-blue to-sky-blue/80 text-navy-blue font-semibold shadow-lg shadow-sky-blue/20 hover:shadow-xl transition-all duration-200"
                      >
                        <FaUserPlus />
                        <span>Sign Up</span>
                      </Link>
                    </motion.div>
                  </div>
                ) : (
                  <motion.button
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.56, duration: 0.3 }}
                    onClick={() => {
                      handleLogout();
                      toggleSidebar();
                    }}
                    className="flex items-center gap-3 w-full p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 border border-red-400/20 hover:border-red-400/30 transition-all duration-200"
                  >
                    <FiLogOut className="text-lg" />
                    <span className="font-medium">Logout</span>
                  </motion.button>
                )}
              </div>

              {/* Bottom branding */}
              <p className="text-center text-white/20 text-[10px] mt-4 tracking-widest">
                © {new Date().getFullYear()} BITWISE
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
