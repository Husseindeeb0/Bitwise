import { FaTrash, FaEdit, FaCalendar, FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const AnnouncementCard = ({ event, page, editEvent, setIsDeleting }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case "workshop":
        return "bg-blue-100 text-blue-800";
      case "seminar":
        return "bg-purple-100 text-purple-800";
      case "conference":
        return "bg-orange-100 text-orange-800";
      case "networking":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Date formatting helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  return (
    <div className="bg-light-purple border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={event.mainImage}
            alt={event.title}
            className="w-full h-full object-cover overflow-hidden max-h-80"
          />
        </div>
        <div className="md:w-2/3 p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(
                  event.category
                )}`}
              >
                {event.category.charAt(0).toUpperCase() +
                  event.category.slice(1)}
              </span>
              <span
                className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  event.active
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {event.active ? "Active" : "Inactive"}
              </span>
            </div>
            {page === "adminPanel" ? (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => editEvent(event)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleting(event._id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            ) : null}
          </div>

          {/* Title */}
          {event.title && (
            <h2 className="text-xl font-bold text-gray-900 mt-2">
              {event.title}
            </h2>
          )}

          {/* Description */}
          <p className="text-gray-700 mt-1 line-clamp-2">{event.description}</p>

          {/* Time */}
          {event.time && (
            <div className="mt-3 flex flex-col space-y-2">
              <div className="flex items-center text-gray-700">
                <FaCalendar size={16} className="mr-2 text-navy-blue" />
                <span>
                  {formatDate(event.date)} {event.time && `at ${event.time}`}
                </span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaMapMarkerAlt size={16} className="mr-2 text-navy-blue" />
                <span>{event.location}</span>
              </div>
            </div>
          )}

          {/* Organizers */}
          {event.organizers && event.organizers.length > 0 && (
            <div className="flex justify-between items-end">
              <div className="mt-3">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Organizers
                </h3>
                <div className="flex flex-wrap gap-2 line">
                  {event.organizers.slice(0, 3).map((organizer, idx) => (
                    <div
                      key={organizer.id || idx}
                      className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded-md"
                    >
                      <img
                        src={organizer.image}
                        alt={organizer.name}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <div className="text-sm">
                        <span className="font-medium">{organizer.name}</span>
                        {organizer.role && (
                          <span className="text-gray-500 text-xs">
                            {" "}
                            · {organizer.role}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {event.organizers.length > 3 && (
                    <span
                      className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-sm text-navy-blue"
                    >
                      +{event.organizers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}
          {/* View Announcement Details */}
          <Link
            to={`/announcementDetails?id=${event._id}`}
            state={{ event: event }}
            className="mt-4 text-navy-blue font-medium text-sm ml-auto hover:brightness-75"
          >
            View announcement details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
