import { useEffect } from "react";
import AnnouncementCardsLoader from "../../components/AnnouncementCardsLoader";
import { getAnnouncements } from "../../features/announcements/announcementsThunks";
import { FaCalendar } from "react-icons/fa";
import AnnouncementCard from "../../components/AnnouncementCard";
import { useDispatch, useSelector } from "react-redux";

function Announcements() {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.announcements.isLoading);
  const announcementsData = useSelector(
    (state) => state.announcements.announcementsData
  );

  const fetchData = async () => {
    try {
      await dispatch(getAnnouncements());
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    if (!announcementsData) {
      fetchData();
    }
  }, [dispatch]);

  return (
    <div className="w-full px-10 py-30">
      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <>
            {/* Show multiple skeleton loaders */}
            {[...Array(3)].map((_, index) => (
              <AnnouncementCardsLoader key={index} />
            ))}
          </>
        ) : Array.isArray(announcementsData) && announcementsData.length > 0 ? (
          announcementsData.map((event) => (
            <div key={event._id}>
              <AnnouncementCard event={event} page="announcements" />
            </div>
          ))
        ) : (
          <div className="border border-gray-200 rounded-lg p-6 text-center">
            <div className="flex flex-col items-center">
              <FaCalendar size={40} className="text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">
                No announcements added yet
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Announcements;
