import {
  FaTrash,
  FaEdit,
  FaCalendar,
  FaMapMarkerAlt,
} from "react-icons/fa";

const AnnouncementCard = ({ event, page }) => {
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
    <div
      className="bg-light-purple border border-gray-200 rounded-lg shadow-sm overflow-hidden"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/3">
          <img
            src={event.mainImage}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-4">
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

          <h2 className="text-xl font-bold text-gray-900 mt-2">
            {event.title}
          </h2>
          <p className="text-gray-700 mt-1 line-clamp-2">{event.description}</p>

          <div className="mt-3 flex flex-col space-y-2">
            <div className="flex items-center text-gray-700">
              <FaCalendar size={16} className="mr-2" />
              <span>
                {formatDate(event.date)} {event.time && `at ${event.time}`}
              </span>
            </div>
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt size={16} className="mr-2" />
              <span>{event.location}</span>
            </div>
          </div>

          {event.organizers && event.organizers.length > 0 && (
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Organizers
              </h3>
              <div className="flex flex-wrap gap-2">
                {event.organizers.map((organizer, idx) => (
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnnouncementCard;
