import { FaTrash, FaEdit, FaCalendar, FaMapMarkerAlt, FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";

const AchievementCard = ({ achievement, page, editAchievement, setIsDeleting, deleteAchievements, isDeleting }) => {
  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800";
      case "business":
        return "bg-purple-100 text-purple-800";
      case "design":
        return "bg-orange-100 text-orange-800";
      case "science":
        return "bg-green-100 text-green-800";
      case "workshop":
        return "bg-teal-100 text-teal-800";
      case "certification":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Date formatting
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format time if needed
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="flex flex-col md:flex-row">
        {/* Image Section */}
        <div className="md:w-1/3 relative">
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-64 md:h-full object-cover"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
            }}
          />
          {/* Category Badge on Image */}
          <div className="absolute top-3 left-3">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(
                achievement.category
              )}`}
            >
              {achievement.category.charAt(0).toUpperCase() +
                achievement.category.slice(1)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="md:w-2/3 p-5 flex flex-col">
          {/* Header with Admin Controls */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  achievement.completed 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {achievement.completed ? "Completed" : "In Progress"}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                ID: {achievement._id?.substring(0, 8)}
              </span>
            </div>
            
            {page === "adminPanel" && (
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => editAchievement(achievement)}
                  className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-50 rounded"
                  title="Edit Achievement"
                >
                  <FaEdit size={18} />
                </button>
                <button
                  type="button"
                   onClick={() => {
                    if (window.confirm("Are you sure you want to delete this achievement?")) {
                    deleteAchievements(achievement._id);
                    }
                }}
                 disabled={isDeleting}
                className={`text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded ${
                  isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                title="Delete Achievement"
                >
                  <FaTrash size={18} />
                </button>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
            {achievement.title}
          </h2>

          {/* Description */}
          <p className="text-gray-600 mb-4 line-clamp-3">
            {achievement.description}
          </p>

          {/* Time and Location Info */}
          <div className="mt-auto space-y-3">
            <div className="flex items-center text-gray-700">
              <FaCalendar className="mr-3 text-navy-blue flex-shrink-0" size={16} />
              <span className="font-medium">Achieved:</span>
              <span className="ml-2">
                {formatDate(achievement.time)}
                {achievement.time && ` at ${formatTime(achievement.time)}`}
              </span>
            </div>
            
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-3 text-navy-blue flex-shrink-0" size={16} />
              <span className="font-medium">Location:</span>
              <span className="ml-2">{achievement.location}</span>
            </div>

            {/* Instructors */}
            {achievement.instructors && achievement.instructors.length > 0 && (
              <div className="flex items-center text-gray-700">
                <FaUsers className="mr-3 text-navy-blue flex-shrink-0" size={16} />
                <div className="flex-1">
                  <span className="font-medium">Instructors:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {achievement.instructors.slice(0, 3).map((instructor, idx) => (
                      <div
                        key={instructor._id || idx}
                        className="flex items-center gap-2 bg-navy-blue px-3 py-1.5 rounded-md"
                      >
                        {instructor.avatarUrl ? (
                          <img
                            src={instructor.avatarUrl}
                            alt={instructor.name}
                            className="w-6 h-6 rounded-full object-cover border border-white"
                            onError={(e) => {
                              e.target.style.display = 'none';
                                e.target.nextElementSibling &&
                                (e.target.nextElementSibling.style.display = "flex");
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-6 h-6 rounded-full bg-light flex items-center justify-center text-navy-blue font-bold text-xs ${instructor.avatarUrl ? 'hidden' : 'flex'}`}
                        >
                          {instructor.name?.charAt(0) || '?'}
                        </div>
                        <div className="text-sm text-light">
                          <span className="font-medium">{instructor.name}</span>
                          {instructor.role && (
                            <span className="text-xs ml-1 opacity-90">
                              · {instructor.role}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                    {achievement.instructors.length > 3 && (
                      <span className="flex items-center gap-1 bg-gray-50 px-3 py-1.5 rounded-md text-sm text-navy-blue font-medium border border-gray-200">
                        +{achievement.instructors.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* View Details Link */}
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-gray-100">
              <div className="text-xs text-gray-500">
                <span className="font-medium">Image ID:</span> {achievement.imageId || 'N/A'}
              </div>
<Link
  to={`/achievement/${achievement._id}`}
  state={{ achievement: achievement }}
  className="text-navy-blue font-semibold text-sm hover:text-dark-purple flex items-center group"
>
  View achievement details
  <span className="ml-1 group-hover:translate-x-1 transition-transform duration-200">→</span>
</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementCard;