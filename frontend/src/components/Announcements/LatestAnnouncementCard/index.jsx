import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getLatestAnnouncement } from '../../../features/announcements/announcementsThunks';
import { useDispatch, useSelector } from 'react-redux';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock, FaBolt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import LoggingLoader from '../../LoggingLoader';

const LatestAnnouncementCard = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.announcements.isLoading);
  const error = useSelector((state) => state.announcements.error);
  const latestAnnouncement = useSelector(
    (state) => state.announcements.latestAnnouncement
  );

  useEffect(() => {
    const fetchLatestAnnouncement = async () => {
      try {
        await dispatch(getLatestAnnouncement()).unwrap();
      } catch (error) {
        console.error('Failed to fetch latest announcement:', error);
      }
    };
    if (!latestAnnouncement && !error) {
      fetchLatestAnnouncement();
    }
  }, [dispatch, latestAnnouncement, error]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 p-12 bg-white/5 rounded-[2.5rem] shadow-2xl backdrop-blur-md flex justify-center border border-white/10">
        <LoggingLoader />
      </div>
    );
  }

  if (error || !latestAnnouncement || !latestAnnouncement.active) {
    return null;
  }

  const convertTo12HourFormat = (time24) => {
    if (!time24 || !time24.includes(':')) return '';
    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('en-US', { month: 'short' }),
      full: date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  };

  const dateInfo = formatDate(latestAnnouncement.date);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="w-full max-w-5xl mx-auto mt-16 relative group"
    >
      {/* Dynamic Background Glow */}
      <div className="absolute -inset-1 bg-gradient-to-r from-sky-blue via-navy-blue to-dark-purple rounded-[3rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000" />

      <div className="relative bg-white/10 backdrop-blur-3xl rounded-[2.5rem] border border-white/20 shadow-2xl overflow-hidden">
        {/* Top Tag */}
        <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-sky-blue via-navy-blue to-dark-purple" />

        <div className="flex flex-col lg:flex-row">
          {/* visual Side */}
          <div className="lg:w-1/2 relative min-h-[350px]">
            <img
              src={latestAnnouncement.mainImageUrl}
              alt={latestAnnouncement.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/90 via-dark-purple/20 to-transparent" />

            <div className="absolute top-8 left-8">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2 rounded-2xl shadow-2xl">
                <FaBolt className="text-amber-400 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Latest Buzz
                </span>
              </div>
            </div>

            <div className="absolute bottom-8 left-8 right-8 text-white">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white rounded-3xl flex flex-col items-center justify-center text-dark-purple shadow-2xl">
                  <span className="text-xs font-black uppercase leading-none">
                    {dateInfo.month}
                  </span>
                  <span className="text-2xl font-black leading-none mt-1">
                    {dateInfo.day}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-sky-300 opacity-80 italic">
                    Category
                  </span>
                  <h4 className="text-xl font-black uppercase tracking-tighter">
                    {latestAnnouncement.category}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          {/* Content Side */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col justify-center">
            <h3 className="text-3xl lg:text-5xl font-black text-white mb-6 leading-tight drop-shadow-lg">
              {latestAnnouncement.title}
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="flex items-center gap-3 text-white/70">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <FaMapMarkerAlt size={12} className="text-sky-400" />
                </div>
                <span className="text-xs font-bold truncate tracking-tight">
                  {latestAnnouncement.location}
                </span>
              </div>
              <div className="flex items-center gap-3 text-white/70">
                <div className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                  <FaClock size={12} className="text-sky-400" />
                </div>
                <span className="text-xs font-bold tracking-tight">
                  {convertTo12HourFormat(latestAnnouncement.time)}
                </span>
              </div>
            </div>

            <p className="text-white/60 leading-relaxed mb-10 line-clamp-3 text-lg font-medium italic opacity-80 border-l-4 border-sky-blue pl-6">
              "{latestAnnouncement.description}"
            </p>

            <div className="flex items-center gap-4">
              <Link
                to={`/announcementDetails?id=${latestAnnouncement._id}`}
                state={{ event: latestAnnouncement }}
                className="flex-1 bg-white text-dark-purple py-4 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl hover:bg-sky-blue hover:text-white transition-all transform hover:-translate-y-1 active:translate-y-0"
              >
                Explore More
              </Link>

              {latestAnnouncement.hasRegistration && (
                <Link
                  to={`/registrationForm?formUrl=${encodeURIComponent(latestAnnouncement.registrationUrl)}`}
                  className="flex-1 bg-navy-blue text-white py-4 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 shadow-2xl border border-white/10 hover:bg-dark-purple transition-all transform hover:-translate-y-1 active:translate-y-0"
                >
                  Join Us
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LatestAnnouncementCard;
