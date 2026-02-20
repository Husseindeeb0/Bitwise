import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUsers,
  FaSearch,
  FaArrowLeft,
  FaEnvelope,
  FaUser,
  FaIdCard,
  FaChevronDown,
  FaChevronUp,
  FaCalendarAlt,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { getBookSubmissions } from '../../../features/bookSubmission/bookSubThunks';
import { getAnnouncementById } from '../../../features/announcements/announcementsThunks';
import Loader from '../../../components/Loader';
import toast from 'react-hot-toast';

const Attendees = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { submissions, isLoading, error } = useSelector(
    (state) => state.bookSubmission
  );
  const [announcement, setAnnouncement] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedAttendee, setExpandedAttendee] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(getBookSubmissions(id));
      const fetchAnnouncement = async () => {
        try {
          const result = await dispatch(getAnnouncementById(id)).unwrap();
          setAnnouncement(result);
        } catch (err) {
          toast.error('Failed to fetch announcement details');
        }
      };
      fetchAnnouncement();
    }
  }, [id, dispatch]);

  const filteredSubmissions = (submissions || [])?.filter((sub) => {
    const user = sub.userId;
    const searchStr = `${user?.username} ${user?.email}`.toLowerCase();
    return searchStr.includes(searchTerm.toLowerCase());
  });

  const toggleExpand = (attendeeId) => {
    setExpandedAttendee(expandedAttendee === attendeeId ? null : attendeeId);
  };

  if (isLoading && (!submissions || submissions.length === 0))
    return <Loader />;

  return (
    <div className="min-h-screen bg-slate-50/50 pt-28 pb-20 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button & Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <button
              onClick={() => navigate('/manageAnnouncements')}
              className="flex items-center gap-2 text-navy-blue font-bold hover:text-sky-blue transition-colors group mb-4"
            >
              <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
              Back to Management
            </button>
            <div className="flex items-center gap-4">
              <div className="p-4 bg-navy-blue text-white rounded-2xl shadow-xl shadow-navy-blue/20">
                <FaUsers size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-dark-purple tracking-tight">
                  Event Attendees
                </h1>
                <p className="text-gray-500 font-medium">
                  {announcement?.title || 'Loading announcement...'}
                </p>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white/70 backdrop-blur-xl border border-white p-6 rounded-3xl shadow-xl shadow-navy-blue/5 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Total Bookings
              </p>
              <p className="text-2xl font-black text-navy-blue">
                {submissions?.length || 0}
              </p>
            </div>
            <div className="w-px h-10 bg-gray-100" />
            <div className="text-left hidden sm:block">
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                <FaCalendarAlt />
                {announcement?.date &&
                  new Date(announcement.date).toLocaleDateString()}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                <FaMapMarkerAlt />
                {announcement?.location}
              </div>
            </div>
          </div>
        </div>

        {/* Search & Bulk Actions */}
        <div className="mb-8 relative group">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-navy-blue transition-colors">
            <FaSearch />
          </div>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-2 border-transparent focus:border-navy-blue/20 focus:bg-white px-14 py-5 rounded-[2rem] shadow-lg shadow-navy-blue/5 outline-none transition-all font-medium text-dark-purple placeholder:text-gray-300"
          />
        </div>

        {/* Attendees List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredSubmissions.length > 0 ? (
            filteredSubmissions.map((sub, index) => (
              <motion.div
                key={sub._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white border-2 transition-all duration-300 rounded-[2rem] overflow-hidden ${
                  expandedAttendee === sub._id
                    ? 'border-navy-blue shadow-2xl shadow-navy-blue/10 scale-[1.01]'
                    : 'border-transparent shadow-md hover:shadow-xl'
                }`}
              >
                <div
                  className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6"
                  onClick={() => toggleExpand(sub._id)}
                >
                  <div className="flex items-center gap-5">
                    <div className="relative">
                      <img
                        src={
                          sub.userId?.profileImage?.url ||
                          'https://via.placeholder.com/150'
                        }
                        alt={sub.userId?.username}
                        className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                      />
                      <div className="absolute -bottom-2 -right-2 bg-sky-400 text-white p-1.5 rounded-lg shadow-lg">
                        <FaUser size={10} />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-dark-purple mb-0.5">
                        {sub.userId?.username}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-400 font-bold">
                        <span className="flex items-center gap-1.5">
                          <FaEnvelope className="text-navy-blue/50" />
                          {sub.userId?.email}
                        </span>
                        <span className="hidden sm:inline-block w-1.5 h-1.5 bg-gray-200 rounded-full" />
                        <span className="hidden sm:flex items-center gap-1.5 capitalize">
                          <FaIdCard className="text-navy-blue/50" />
                          {sub.userId?.role || 'Member'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden lg:block text-right">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">
                        Registered On
                      </p>
                      <p className="text-sm font-bold text-dark-purple">
                        {new Date(sub.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <div
                      className={`p-3 rounded-xl transition-all ${
                        expandedAttendee === sub._id
                          ? 'bg-navy-blue text-white rotate-180'
                          : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                      }`}
                    >
                      <FaChevronDown />
                    </div>
                  </div>
                </div>

                {/* Expanded Content: Registration Answers */}
                <AnimatePresence>
                  {expandedAttendee === sub._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 pt-2 border-t border-gray-50 bg-slate-50/30">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-inner">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-6 bg-sky-400 rounded-full" />
                            <h4 className="text-sm font-black text-navy-blue uppercase tracking-widest">
                              Registration Details
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {sub.bookFormId?.questions.map((q) => (
                              <div key={q._id} className="space-y-2">
                                <p className="text-xs font-black text-gray-400 uppercase tracking-wider">
                                  {q.label}
                                </p>
                                <div className="bg-gray-50/50 rounded-2xl p-4 border border-gray-100">
                                  {Array.isArray(sub.answers[q._id]) ? (
                                    <div className="flex flex-wrap gap-2">
                                      {sub.answers[q._id].map((ans, i) => (
                                        <span
                                          key={i}
                                          className="bg-navy-blue/10 text-navy-blue px-3 py-1 rounded-lg text-xs font-bold"
                                        >
                                          {ans}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-dark-purple font-bold">
                                      {sub.answers[q._id] || 'N/A'}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <div className="py-20 text-center bg-white rounded-[3rem] border-2 border-dashed border-gray-200">
              <div className="bg-gray-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
                <FaUsers size={40} />
              </div>
              <h3 className="text-xl font-black text-dark-purple mb-2">
                {searchTerm ? 'No matching attendees' : 'No attendees yet'}
              </h3>
              <p className="text-gray-500 font-medium max-w-xs mx-auto">
                {searchTerm
                  ? `We couldn't find any results for "${searchTerm}".`
                  : 'Wait for users to start booking this event.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendees;
