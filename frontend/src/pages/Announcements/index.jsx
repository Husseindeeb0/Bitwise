import { useState, useEffect } from "react";
import AnnouncementCardsLoader from "../../components/AnnouncementCardsLoader";
import { useMyContext } from "../../context";
import getAnnouncements from "../../api/getAnnouncements";
import { FaCalendar } from "react-icons/fa";
import AnnouncementCard from "../../components/AnnouncementCard";

function Announcements() {
  const { accessToken } = useMyContext();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await getAnnouncements(accessToken);

      // Check if the response contains the expected data
      if (response.state === "success") {
        const sortedData = [...response.data].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setAnnouncements(sortedData);
      } else {
        console.error(response.message);
        setAnnouncements([]);
      }
    } catch (error) {
      console.error("Error fetching announcements:", error);
      setAnnouncements([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [accessToken]);

  return (
    <div className="w-full px-10 py-30">
      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <>
            {/* Show multiple skeleton loaders */}
            {[...Array(3)].map((_, index) => (
              <AnnouncementCardsLoader key={index} />
            ))}
          </>
        ) : announcements.length > 0 ? (
          announcements.map((event) => (
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
