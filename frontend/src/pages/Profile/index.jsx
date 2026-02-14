import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUser,
  FaEnvelope,
  FaCamera,
  FaEdit,
  FaLock,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaBriefcase,
  FaInfoCircle,
} from 'react-icons/fa';
import { getMe } from '../../features/profile/profileThunks';
import AnnouncementCard from '../../components/Announcements/AnnouncementCard';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { userData, isLoading } = useSelector((state) => state.profile);

  // Local state for editing
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);

  useEffect(() => {
    if (!userData) {
      dispatch(getMe());
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        description: userData.description || 'No description provided.',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setProfilePreview(userData.profileImage || null);
      setCoverPreview(
        userData.coverImage ||
          'https://images.unsplash.com/photo-1557683316-973673baf926?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
      );
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'profile') {
          setProfileImage(file);
          setProfilePreview(reader.result);
        } else {
          setCoverImage(file);
          setCoverPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation for password match
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      toast.error("Passwords don't match!");
      return;
    }

    // Simulate API call
    console.log('Updating profile:', { formData, profileImage, coverImage });

    // Show success message
    toast.success('Profile updated successfully (Frontend only)');

    setIsEditing(false);
    // In a real scenario, we would dispatch an update thunk here
  };

  if (isLoading && !userData) {
    return <Loader />;
  }

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background1">
        <div className="text-center p-8 bg-white rounded-2xl shadow-xl">
          <FaInfoCircle className="text-navy-blue text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-dark-purple mb-2">
            Unauthorized
          </h2>
          <p className="text-gray-600 mb-6">
            Please log in to view your profile.
          </p>
          <button
            onClick={() => (window.location.href = '/login')}
            className="px-6 py-2 bg-navy-blue text-white rounded-lg hover:bg-sky-blue transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  // Mock booked announcements for demonstration
  const bookedAnnouncements = userData?.bookedAnnouncements || [];

  return (
    <div className="min-h-screen bg-background1 pb-12">
      {/* Hero / Cover Section */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden group">
        <img
          src={coverPreview}
          alt="Cover"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300" />

        {isEditing && (
          <button
            onClick={() => coverInputRef.current.click()}
            className="absolute top-4 right-4 bg-white/20 backdrop-blur-md hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 shadow-lg border border-white/30"
            title="Change Cover Image"
          >
            <FaCamera size={20} />
          </button>
        )}
        <input
          type="file"
          ref={coverInputRef}
          className="hidden"
          accept="image/*"
          onChange={(e) => handleImageChange(e, 'cover')}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative -mt-24 md:-mt-32 mb-8">
          <div className="flex flex-col md:flex-row items-end md:items-center gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-white">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt={userData.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-light text-navy-blue">
                    <FaUser size={64} />
                  </div>
                )}
              </div>
              {isEditing && (
                <button
                  onClick={() => profileInputRef.current.click()}
                  className="absolute bottom-2 right-2 bg-navy-blue text-white p-2 rounded-lg shadow-lg hover:bg-sky-blue transition-all duration-300 border-2 border-white"
                  title="Change Profile Image"
                >
                  <FaCamera size={16} />
                </button>
              )}
              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageChange(e, 'profile')}
              />
            </div>

            {/* Profile Header Info */}
            <div className="flex-1 pb-2">
              <div className="flex justify-between items-start w-full">
                <div>
                  <h1 className="text-3xl md:text-4xl font-black text-dark-purple drop-shadow-sm">
                    {userData.name}
                  </h1>
                  <p className="text-navy-blue font-semibold flex items-center gap-2 mt-1">
                    <span className="px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full text-xs uppercase tracking-wider border border-navy-blue/20">
                      {userData.role || 'Member'}
                    </span>
                    <span className="text-sm text-gray-500 font-normal ml-2 flex items-center gap-1">
                      <FaCalendarAlt size={12} /> Joined{' '}
                      {new Date(userData.createdAt).toLocaleDateString(
                        'en-US',
                        { month: 'long', year: 'numeric' }
                      )}
                    </span>
                  </p>
                </div>
                {!isEditing && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsEditing(true)}
                    className="bg-white text-navy-blue border-2 border-navy-blue px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-navy-blue hover:text-white transition-all duration-300"
                  >
                    <FaEdit /> Edit Profile
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Edit Form */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-navy-blue p-4 text-white flex items-center gap-2">
                <FaInfoCircle />
                <h3 className="font-bold">Personal Information</h3>
              </div>

              <div className="p-6">
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.form
                      key="edit-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      onSubmit={handleSubmit}
                      className="space-y-4"
                    >
                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
                          Full Name
                        </label>
                        <div className="relative">
                          <FaUser className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-transparent transition-all outline-none"
                            placeholder="Full Name"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
                          Email Address
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-transparent transition-all outline-none"
                            placeholder="Email"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-1 ml-1">
                          About Me
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-transparent transition-all outline-none resize-none"
                          rows="4"
                          placeholder="Tell us about yourself..."
                        />
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-dark-purple mb-4 flex items-center gap-2">
                          <FaLock className="text-sky-blue" /> Change Password
                        </h4>
                        <div className="space-y-3">
                          <input
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleInputChange}
                            placeholder="Current Password"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-blue outline-none text-sm transition-all"
                          />
                          <input
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleInputChange}
                            placeholder="New Password"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-blue outline-none text-sm transition-all"
                          />
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            placeholder="Confirm New Password"
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-navy-blue outline-none text-sm transition-all"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 pt-6">
                        <button
                          type="submit"
                          className="flex-1 bg-navy-blue text-white py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
                        >
                          <FaCheck /> Save Changes
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="view-details"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-light p-3 rounded-xl text-navy-blue">
                            <FaEnvelope size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Email
                            </p>
                            <p className="text-dark-purple font-medium">
                              {userData.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="bg-light p-3 rounded-xl text-navy-blue">
                            <FaBriefcase size={18} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                              Role
                            </p>
                            <p className="text-dark-purple font-medium capitalize">
                              {userData.role || 'General Member'}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-gray-100">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                          About Me
                        </p>
                        <p className="text-gray-600 leading-relaxed italic border-l-4 border-sky-blue pl-4 py-1">
                          "{userData.description || 'No description provided.'}"
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Booked Announcements */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-black text-dark-purple flex items-center gap-3">
                <span className="w-2 h-8 bg-sky-blue rounded-full"></span>
                My Booked Events
              </h2>
              <span className="bg-white px-3 py-1 rounded-full text-xs font-bold text-navy-blue border border-navy-blue/10 shadow-sm">
                {bookedAnnouncements.length} Events
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {bookedAnnouncements.length > 0 ? (
                bookedAnnouncements.map((event, index) => (
                  <motion.div
                    key={event._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <AnnouncementCard event={event} variant="profile" />
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center">
                  <div className="bg-light p-6 rounded-full text-navy-blue mb-4">
                    <FaCalendarAlt size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-dark-purple mb-1">
                    No bookings found
                  </h3>
                  <p className="text-gray-500 max-w-xs px-4">
                    You haven't booked for any event yet. Check our latest
                    news to find events!
                  </p>
                  <button
                    onClick={() => (window.location.href = '/announcements')}
                    className="mt-6 px-6 py-2 bg-navy-blue text-white rounded-xl font-bold hover:bg-sky-blue transition-colors shadow-lg shadow-navy-blue/20"
                  >
                    Explore Announcements
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
