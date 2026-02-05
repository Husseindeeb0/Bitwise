import {
  FaTrash,
  FaEdit,
  FaCalendar,
  FaMapMarkerAlt,
  FaUsers,
  FaTrophy,
} from 'react-icons/fa';
import { motion } from 'framer-motion';

const AchievementCard = ({
  achievement,
  page,
  editAchievement,
  deleteAchievements,
  isDeleting,
}) => {
  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'technology':
        return 'bg-navy-blue/10 text-navy-blue border-navy-blue/20';
      case 'business':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'design':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'science':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'workshop':
        return 'bg-sky-blue/20 text-dark-purple border-sky-blue/30';
      case 'certification':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'education':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'sports':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Date formatting
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group bg-white rounded-xl border border-sky-blue/20 shadow-sm hover:shadow-md hover:border-sky-blue/40 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row">
        {/* Image Section - Compact */}
        <div className="sm:w-40 md:w-48 flex-shrink-0 relative">
          <img
            src={achievement.imageUrl}
            alt={achievement.title}
            className="w-full h-32 sm:h-full sm:rounded-l-xl sm:rounded-r-none rounded-t-xl object-cover"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
            }}
          />
          {/* Category Badge */}
          <span
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium border ${getCategoryColor(achievement.category)}`}
          >
            {achievement.category?.charAt(0).toUpperCase() +
              achievement.category?.slice(1) || 'General'}
          </span>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col min-w-0">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-bold text-dark-purple truncate flex-1">
              {achievement.title}
            </h3>

            {/* Admin Controls */}
            {page === 'adminPanel' && (
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => editAchievement(achievement)}
                  className="p-2 text-navy-blue hover:bg-navy-blue/10 rounded-lg transition-colors"
                  title="Edit"
                >
                  <FaEdit size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => deleteAchievements(achievement._id)}
                  disabled={isDeleting}
                  className={`p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ${
                    isDeleting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  title="Delete"
                >
                  <FaTrash size={14} />
                </button>
              </div>
            )}
          </div>

          {/* Description - Compact */}
          <p className="text-navy-blue/70 text-sm line-clamp-2 mb-3">
            {achievement.description}
          </p>

          {/* Meta Info Row */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-navy-blue/80">
            <div className="flex items-center gap-1.5">
              <FaCalendar className="text-sky-blue" size={12} />
              <span>{formatDate(achievement.time)}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <FaMapMarkerAlt className="text-sky-blue" size={12} />
              <span className="truncate max-w-[120px]">
                {achievement.location}
              </span>
            </div>

            {achievement.instructors && achievement.instructors.length > 0 && (
              <div className="flex items-center gap-1.5">
                <FaUsers className="text-sky-blue" size={12} />
                <span>
                  {achievement.instructors.length} instructor
                  {achievement.instructors.length > 1 ? 's' : ''}
                </span>
              </div>
            )}
          </div>

          {/* Instructors Preview */}
          {achievement.instructors && achievement.instructors.length > 0 && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <div className="flex -space-x-2">
                {achievement.instructors.slice(0, 3).map((instructor, idx) => (
                  <div
                    key={instructor._id || idx}
                    className="w-7 h-7 rounded-full bg-navy-blue flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                    title={instructor.name}
                  >
                    {instructor.avatarUrl ? (
                      <img
                        src={instructor.avatarUrl}
                        alt={instructor.name}
                        className="w-full h-full rounded-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      instructor.name?.charAt(0) || '?'
                    )}
                  </div>
                ))}
                {achievement.instructors.length > 3 && (
                  <div className="w-7 h-7 rounded-full bg-sky-blue flex items-center justify-center text-dark-purple text-xs font-medium border-2 border-white">
                    +{achievement.instructors.length - 3}
                  </div>
                )}
              </div>
              <span className="text-xs text-navy-blue/60">
                {achievement.instructors
                  .map((i) => i.name)
                  .slice(0, 2)
                  .join(', ')}
                {achievement.instructors.length > 2 &&
                  ` +${achievement.instructors.length - 2} more`}
              </span>
            </div>
          )}

          {/* View Details Link */}
        </div>
      </div>
    </motion.div>
  );
};

export default AchievementCard;
