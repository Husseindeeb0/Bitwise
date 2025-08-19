import { useEffect } from "react";
import AnnouncementCardsLoader from "../../components/AnnouncementCardsLoader";
import { getAnnouncements } from "../../features/announcements/announcementsThunks";
import { FaCalendar } from "react-icons/fa";
import AnnouncementCard from "../../components/AnnouncementCard";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "@dr.pogodin/react-helmet";

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
      {/* Meta tags for SEO + social */}
      <Helmet>
        {/* Title & Description */}
        <title>Announcements</title>
        <meta
          name="description"
          content="Check out the latest announcements on BitwiseClub! Stay updated on events, workshops, and programming insights that can accelerate your coding journey and help you grow."
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Announcements – Stay Updated on Life Changing Programming Events"
        />
        <meta
          property="og:description"
          content="Check out the latest announcements on BitwiseClub! Stay updated on events, workshops, and programming insights that can accelerate your coding journey and help you grow."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bitwiseclub.com/" />
        <meta property="og:image" content="https://bitwiseclub.com/logo.png" />

        {/* Twitter (X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Announcements – Stay Updated on Life Changing Programming Events"
        />
        <meta
          name="twitter:description"
          content="Check out the latest announcements on BitwiseClub! Stay updated on events, workshops, and programming insights that can accelerate your coding journey and help you grow."
        />
        <meta name="twitter:image" content="https://bitwiseclub.com/logo.png" />
        <meta name="twitter:creator" content="@BitwiseClub" />
      </Helmet>
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
