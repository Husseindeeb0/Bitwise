import {
  FaCalendar,
  FaMapMarkerAlt,
  FaTicketAlt,
  FaClock,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AnnouncementCard = ({
  event,
  onDownloadTicket,
  isDownloadingTicket,
  variant = 'default',
}) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'workshop':
        return 'from-sky-500 to-navy-blue text-white';
      case 'seminar':
        return 'from-purple-500 to-indigo-600 text-white';
      case 'conference':
        return 'from-orange-400 to-red-500 text-white';
      case 'networking':
        return 'from-emerald-400 to-teal-600 text-white';
      default:
        return 'from-gray-400 to-gray-600 text-white';
    }
  };

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
      year: date.getFullYear(),
      full: date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      }),
    };
  };

  const dateInfo = formatDate(event.date);

  // Profile Variant - Compact & Elegant
  if (variant === 'profile') {
    return (
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_-15px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_40px_-20px_rgba(0,0,0,0.15)] transition-all duration-500 border border-gray-100/50 group"
      >
        <div className="relative h-44 overflow-hidden">
          <img
            src={event.mainImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          <div className="absolute top-3 right-3 flex flex-col items-center">
            <div className="bg-white/90 backdrop-blur-md px-2 py-1.5 rounded-2xl shadow-xl flex flex-col items-center min-w-[45px]">
              <span className="text-[10px] font-black text-navy-blue uppercase leading-none tracking-tighter">
                {dateInfo.month}
              </span>
              <span className="text-lg font-black text-dark-purple leading-none mt-0.5">
                {dateInfo.day}
              </span>
            </div>
          </div>

          <div className="absolute bottom-3 left-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.15em] shadow-lg bg-gradient-to-r ${getCategoryColor(event.category)}`}
            >
              {event.category}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-base font-black text-dark-purple group-hover:text-navy-blue transition-colors leading-tight mb-3 line-clamp-1">
            {event.title}
          </h3>

          <div className="space-y-2 mb-4">
            <div className="flex items-center text-[11px] text-gray-500 font-bold uppercase tracking-wide">
              <FaMapMarkerAlt className="mr-2 text-sky-blue" size={12} />
              <span className="truncate">{event.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-50">
            {onDownloadTicket ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDownloadTicket(event._id);
                }}
                disabled={isDownloadingTicket === event._id}
                className="flex-1 flex items-center justify-center gap-2 bg-navy-blue text-white py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-dark-purple transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-navy-blue/20"
              >
                {isDownloadingTicket === event._id ? (
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <FaTicketAlt />
                )}
                Get Ticket
              </button>
            ) : (
              <Link
                to={`/announcementDetails?id=${event._id}`}
                state={{ event: event }}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-50 text-navy-blue py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-navy-blue hover:text-white transition-all active:scale-95"
              >
                Details <span className="opacity-50">→</span>
              </Link>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  // Default Variant - The Showstopper
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_60px_-25px_rgba(0,0,0,0.1)] border border-gray-100/50 group"
    >
      <div className="flex flex-col md:flex-row">
        {/* Visual Content */}
        <div className="md:w-[40%] relative overflow-hidden min-h-[300px]">
          <img
            src={event.mainImageUrl}
            alt={event.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-dark-purple/80 via-dark-purple/20 to-transparent mix-blend-multiply" />

          {/* Dynamic Category Badge */}
          <div className="absolute top-6 left-6">
            <span
              className={`px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl backdrop-blur-xl bg-gradient-to-r ${getCategoryColor(event.category)} border border-white/20`}
            >
              {event.category}
            </span>
          </div>

          {/* Location & Time Floating UI */}
          <div className="absolute bottom-6 left-6 right-6">
            <div className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[1.5rem] p-4 flex items-center gap-4 text-white shadow-2xl">
              <div className="w-12 h-12 bg-white rounded-2xl flex flex-col items-center justify-center text-dark-purple shrink-0 shadow-lg">
                <span className="text-[10px] font-black uppercase leading-none">
                  {dateInfo.month}
                </span>
                <span className="text-xl font-black leading-none mt-0.5">
                  {dateInfo.day}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black truncate drop-shadow-md">
                  {event.location}
                </p>
                <p className="text-xs font-bold opacity-80 flex items-center gap-1.5 mt-0.5">
                  <FaClock className="text-sky-300" />{' '}
                  {convertTo12HourFormat(event.time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Content */}
        <div className="md:w-[60%] p-8 md:p-10 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <div
              className={`w-2 h-2 rounded-full ${event.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300'}`}
            />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              {event.active ? 'Registration Open' : 'Event Concluded'}
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-black text-dark-purple mb-4 leading-tight group-hover:text-navy-blue transition-colors">
            {event.title}
          </h2>

          <p className="text-gray-500 leading-relaxed mb-8 line-clamp-3 text-lg md:text-xl font-medium italic opacity-80 decoration-sky-blue/30 decoration-wavy">
            "{event.description}"
          </p>

          {/* Speakers Mini Preview */}
          {event.organizers && event.organizers.length > 0 && (
            <div className="flex items-center gap-4 mb-8">
              <div className="flex -space-x-4">
                {event.organizers.slice(0, 3).map((speaker, idx) => (
                  <img
                    key={speaker.id || idx}
                    src={speaker.imageUrl}
                    alt={speaker.name}
                    className="w-12 h-12 rounded-[1rem] border-4 border-white object-cover shadow-lg ring-1 ring-gray-100"
                  />
                ))}
                {event.organizers.length > 3 && (
                  <div className="w-12 h-12 rounded-[1rem] bg-navy-blue border-4 border-white flex items-center justify-center text-white text-[10px] font-black shadow-lg">
                    +{event.organizers.length - 3}
                  </div>
                )}
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 leading-none mb-1">
                  Featured Speakers
                </p>
                <p className="text-xs font-bold text-dark-purple">
                  {event.organizers[0].name}
                  {event.organizers.length > 1
                    ? ` & ${event.organizers.length - 1} more`
                    : ''}
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto flex items-center gap-4">
            <Link
              to={`/announcementDetails?id=${event._id}`}
              state={{ event: event }}
              className="flex-1 bg-navy-blue text-white py-4 rounded-[1.25rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-2xl shadow-navy-blue/30 hover:bg-dark-purple hover:scale-[1.02] active:scale-[0.98] transition-all group/link"
            >
              Learn More
              <span className="group-hover/link:translate-x-2 transition-transform duration-300 text-sky-400">
                →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementCard;
