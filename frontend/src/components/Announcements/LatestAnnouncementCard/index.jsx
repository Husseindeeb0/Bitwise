import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getLatestAnnouncement } from "../../../features/announcements/announcementsThunks";
import { useDispatch, useSelector } from "react-redux";
import { FaCalendar, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";
import LoggingLoader from "../../LoggingLoader";

// Component to be added within your homepage section
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
        console.error("Failed to fetch latest announcement:", error);
      }
    };
    if (!latestAnnouncement && !error) {
      fetchLatestAnnouncement();
    }
  }, [dispatch]);

  const convertTo12HourFormat = (time24) => {
    if (!time24 || !time24.includes(":")) return "";

    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 p-6 bg-dark-purple/30 rounded-xl shadow-lg backdrop-blur-sm flex justify-center">
        <LoggingLoader />
      </div>
    );
  }

  if (error || !latestAnnouncement) {
    return (
      <div className="w-full max-w-4xl mx-auto mt-12 p-6 bg-dark-purple/30 rounded-xl shadow-lg backdrop-blur-sm flex justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const {
    title,
    description,
    time,
    date,
    location,
    mainImageUrl,
    organizers,
    active,
    category,
    hasRegistration,
    registrationUrl,
  } = latestAnnouncement;

  // If the announcement is not active, don't display it
  if (!active) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-4xl mx-auto mt-12 bg-light/30 rounded-xl shadow-lg overflow-hidden backdrop-blur-sm"
    >
      <div className="bg-navy-blue text-white py-2 px-4 text-sm font-semibold">
        LATEST {category?.toUpperCase() || "ANNOUNCEMENT"}
      </div>

      <div className="flex flex-col md:flex-row">
        {mainImageUrl && (
          <div>
            <img
              src={mainImageUrl}
              alt={title}
              className=" h-full object-fit overflow-hidden min-w-80 w-full md:w-96 max-h-72"
            />
          </div>
        )}

        {/* Content section */}
        <div className={`p-6 overflow-hidden`}>
          <h3 className="text-2xl font-bold text-navy-blue mb-2">{title}</h3>

          <div className="flex flex-wrap gap-4 my-3 text-sm text-dark-purple">
            {date && (
              <div className="flex items-center">
                <FaCalendar size={16} className="mr-1 text-navy-blue" />
                <span>{formatDate(date)}</span>
              </div>
            )}

            {time && (
              <div className="flex items-center">
                <FaClock size={16} className="mr-1 text-navy-blue" />
                <span>{convertTo12HourFormat(time)}</span>
              </div>
            )}

            {location && (
              <div className="flex items-center">
                <FaMapMarkerAlt size={16} className="mr-1 text-navy-blue" />
                <span>{location}</span>
              </div>
            )}

            {organizers && (
              <div className="flex justify-between items-end">
                <div className="flex flex-wrap gap-2 line">
                  {organizers.slice(0, 3).map((organizer, idx) => (
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
                          <span className="text-dark-purple text-xs">
                            {" "}
                            · {organizer.role}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                  {organizers.length > 3 && (
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md text-sm text-navy-blue">
                      +{organizers.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          <p className="text-dark-purple mb-4 text-start line-clamp-2">
            {description}
          </p>

          <div className="flex flex-wrap gap-3 mt-4">
            <Link
              to={`/announcementDetails?id=${latestAnnouncement._id}`}
              state={{ event: latestAnnouncement }}
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-navy-blue text-white font-medium rounded-lg"
              >
                View Details
              </motion.button>
            </Link>

            {hasRegistration && (
              <Link
                to={`/registrationForm?formUrl=${encodeURIComponent(
                  registrationUrl
                )}`}
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-navy-blue text-white font-medium rounded-lg"
                >
                  Register Now
                </motion.button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default LatestAnnouncementCard;
