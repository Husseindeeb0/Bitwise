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
  FaChevronRight,
  FaGraduationCap,
  FaUserCircle,
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
  // New states for dropdowns
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const profileTimerRef = useRef(null);
  const dashboardTimerRef = useRef(null);

  const handleProfileEnter = () => {
    if (profileTimerRef.current) clearTimeout(profileTimerRef.current);
    setIsProfileOpen(true);
  };

  const handleProfileLeave = () => {
    profileTimerRef.current = setTimeout(() => {
      setIsProfileOpen(false);
      setIsDashboardOpen(false);
    }, 300);
  };

  const handleDashboardEnter = () => {
    if (dashboardTimerRef.current) clearTimeout(dashboardTimerRef.current);
    setIsDashboardOpen(true);
  };

  const handleDashboardLeave = () => {
    dashboardTimerRef.current = setTimeout(() => {
      setIsDashboardOpen(false);
    }, 100);
  };

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
  const NavDropdownItem = ({ to, icon, label, isSubMenu = false }) => {
    const active = isActive(to);
    return (
      <Link
        to={to}
        className={`flex gap-3 items-center px-4 py-3 transition-all duration-200 group ${
          isSubMenu ? 'hover:bg-sky-blue/10' : 'hover:bg-gray-50'
        } ${
          active
            ? 'text-navy-blue font-bold bg-sky-blue/5'
            : 'text-dark-purple group-hover:text-navy-blue font-medium'
        }`}
      >
        <span
          className={`text-lg transition-transform duration-300 group-hover:scale-110 ${active ? 'text-sky-blue' : 'text-navy-blue/60 group-hover:text-sky-blue'}`}
        >
          {icon}
        </span>
        <span className="text-[14px]">{label}</span>
      </Link>
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
          <div
            className="relative"
            onMouseEnter={handleProfileEnter}
            onMouseLeave={handleProfileLeave}
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl cursor-pointer transition-all duration-300 border-2 ${
                isProfileOpen
                  ? 'bg-navy-blue/5 border-navy-blue/20'
                  : isActive('/profile')
                    ? 'bg-sky-blue/10 border-sky-blue/30'
                    : 'border-transparent hover:bg-gray-100/50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-navy-blue/5 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                {userData.profileImage ? (
                  <img
                    src={userData.profileImage}
                    alt={userData?.name || 'User'}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUserCircle className="text-navy-blue text-2xl" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[14px] font-black text-dark-purple leading-tight">
                  {userData?.name?.split(' ')[0] || 'User'}
                </span>
                <span className="text-[10px] text-sky-blue font-bold uppercase tracking-wider">
                  {userData.role?.replace('_', ' ') || 'Member'}
                </span>
              </div>
              <motion.div
                animate={{ rotate: isProfileOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaChevronDown className="text-[10px] text-navy-blue/50" />
              </motion.div>
            </motion.div>

            {/* Profile Dropdown */}
            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-full right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-visible z-50 transform-gpu"
                >
                  <div className="p-2 space-y-1">
                    <NavDropdownItem
                      to="/profile"
                      icon={<FaUserCircle />}
                      label="My Profile"
                    />

                    {(role === 'admin' || role === 'top_admin') && (
                      <div
                        className="relative"
                        onMouseEnter={handleDashboardEnter}
                        onMouseLeave={handleDashboardLeave}
                      >
                        <div
                          className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                            isDashboardOpen || isManagementActive()
                              ? 'bg-navy-blue text-white shadow-lg'
                              : 'text-dark-purple hover:bg-gray-50 hover:text-navy-blue'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-lg transition-colors ${isDashboardOpen || isManagementActive() ? 'text-white' : 'text-navy-blue/60 group-hover:text-sky-blue'}`}
                            >
                              <MdManageAccounts />
                            </span>
                            <span className="text-[14px] font-bold">
                              Dashboard
                            </span>
                          </div>
                          <FaChevronRight
                            className={`text-[10px] transition-transform duration-300 ${isDashboardOpen ? 'rotate-90 md:rotate-0 translate-x-1' : ''}`}
                          />
                        </div>

                        {/* Management Sub-menu */}
                        <AnimatePresence>
                          {isDashboardOpen && (
                            <motion.div
                              initial={{ opacity: 0, x: 10 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 10 }}
                              className="md:absolute md:top-0 md:right-full md:mr-2 w-full md:w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
                            >
                              <div className="bg-navy-blue/5 px-4 py-2 border-b border-gray-100">
                                <span className="text-[10px] font-black text-navy-blue uppercase tracking-widest">
                                  Management
                                </span>
                              </div>
                              <div className="p-1">
                                {role === 'top_admin' && (
                                  <NavDropdownItem
                                    to="/manageAdmins"
                                    icon={<RiAdminFill />}
                                    label="Admins"
                                    isSubMenu={true}
                                  />
                                )}
                                <NavDropdownItem
                                  to="/manageAnnouncements"
                                  icon={<GrAnnounce />}
                                  label="Announcements"
                                  isSubMenu={true}
                                />
                                <NavDropdownItem
                                  to="/manageCourses"
                                  icon={<FaGraduationCap />}
                                  label="Courses"
                                  isSubMenu={true}
                                />
                                <NavDropdownItem
                                  to="/manageAchievements"
                                  icon={<GiAchievement />}
                                  label="Achievements"
                                  isSubMenu={true}
                                />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    )}

                    <div className="h-px bg-gray-100 my-1 mx-2" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                      <FiLogOut className="text-lg group-hover:rotate-[-12deg] transition-transform" />
                      <span className="text-[14px] font-bold">Logout</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                  <div className="space-y-2">
                    <MobileNavItem
                      to="/profile"
                      icon={<FaUserCircle />}
                      label="My Profile"
                      onClick={toggleSidebar}
                      index={7}
                    />
                    <motion.button
                      initial={{ opacity: 0, x: 40 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.64, duration: 0.3 }}
                      onClick={() => {
                        handleLogout();
                        toggleSidebar();
                      }}
                      className="flex items-center gap-3 w-full p-3 rounded-xl text-red-300 hover:bg-red-500/10 hover:text-red-200 border border-red-400/20 hover:border-red-400/30 transition-all duration-200"
                    >
                      <FiLogOut className="text-lg" />
                      <span className="font-medium">Logout</span>
                    </motion.button>
                  </div>
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
