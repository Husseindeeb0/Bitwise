import {
  FaTrash,
  FaEdit,
  FaCalendar,
  FaMapMarkerAlt,
  FaWpforms,
  FaCheckCircle,
  FaQrcode,
  FaUsers,
  FaClock,
  FaExclamationCircle,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminAnnouncementCard = ({
  event,
  editEvent,
  setIsDeleting,
  manageForm,
}) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'workshop':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'seminar':
        return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'conference':
        return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'networking':
        return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default:
        return 'bg-gray-50 text-gray-600 border-gray-100';
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="group bg-white border border-gray-100 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-navy-blue/5 transition-all duration-500 relative">
      <div className="flex flex-col lg:flex-row">
        {/* Left: Event Visual Recap */}
        <div className="lg:w-72 h-48 lg:h-auto relative overflow-hidden">
          <img
            src={event.mainImageUrl}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-purple/60 to-transparent" />

          <div className="absolute top-4 left-4">
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getCategoryColor(event.category)} shadow-sm backdrop-blur-md bg-white/80`}
            >
              {event.category}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex flex-col items-center justify-center text-dark-purple shrink-0">
                <span className="text-[10px] font-black uppercase">
                  {new Date(event.date).toLocaleString('en-US', {
                    month: 'short',
                  })}
                </span>
                <span className="text-sm font-black -mt-1">
                  {new Date(event.date).getDate()}
                </span>
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold truncate opacity-90">
                  {event.location}
                </p>
                <p className="text-[10px] opacity-70 flex items-center gap-1">
                  <FaClock size={8} /> {convertTo12HourFormat(event.time)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Management Controls */}
        <div className="flex-1 p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-xl font-black text-dark-purple group-hover:text-navy-blue transition-colors leading-tight">
                {event.title}
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => editEvent(event)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-sky-blue/10 text-sky-blue hover:bg-sky-blue hover:text-white transition-all shadow-sm"
                  title="Quick Edit"
                >
                  <FaEdit size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleting(event._id)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                  title="Remove Announcement"
                >
                  <FaTrash size={16} />
                </button>
              </div>
            </div>
            <p className="text-gray-500 text-sm line-clamp-2 mb-6 italic">
              {event.description}
            </p>

            {/* Quick Stats/Badges */}
            <div className="flex flex-wrap gap-3 mb-6">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-bold ${event.active ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-gray-50 text-gray-500 border-gray-100'}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${event.active ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'}`}
                ></div>
                {event.active ? 'VISITS ACTIVE' : 'HIDDEN'}
              </div>

              {event.bookFormId ? (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold">
                  <FaCheckCircle className="text-blue-500" /> REGISTRATION LIVE
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold">
                  <FaExclamationCircle className="text-amber-500" /> FORM
                  PENDING
                </div>
              )}
            </div>
          </div>

          {/* Action Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-gray-50">
            <button
              onClick={() => manageForm(event)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 text-dark-purple hover:bg-navy-blue hover:text-white transition-all group/btn"
            >
              <FaWpforms className="text-lg group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                Registration Form
              </span>
            </button>

            <Link
              to={`/manageAnnouncements/attendees/${event._id}`}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-gray-50 text-dark-purple hover:bg-navy-blue hover:text-white transition-all group/btn"
            >
              <FaUsers className="text-lg group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                View Attendees
              </span>
            </Link>

            <Link
              to={`/manageAnnouncements/scanner/${event._id}`}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-sky-blue text-white hover:bg-navy-blue transition-all group/btn shadow-xl shadow-sky-blue/20"
            >
              <FaQrcode className="text-lg group-hover/btn:scale-110 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-tighter">
                Scan Tickets
              </span>
            </Link>

            <Link
              to={`/announcementDetails?id=${event._id}`}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 border-dashed border-gray-100 text-gray-400 hover:border-navy-blue hover:text-navy-blue transition-all group/btn"
            >
              <div className="text-lg font-black italic">i</div>
              <span className="text-[10px] font-black uppercase tracking-tighter">
                Public View
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncementCard;
