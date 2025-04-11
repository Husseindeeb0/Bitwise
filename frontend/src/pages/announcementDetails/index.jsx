import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaExternalLinkAlt,
  FaTimes,
  FaShare,
} from "react-icons/fa";

const AnnouncementDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    // Get event data from location state or fetch it
    if (location.state && location.state.event) {
      setEvent(location.state.event);
      setLoading(false);
    } else {
      // Fetch event data using the ID
      // For demo purposes, we'll just show an error
      setLoading(false);
    }
  }, [id, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy-blue"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mx-auto mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Event Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The event you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-navy-blue text-white rounded-md hover:bg-dark-purple transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "TBA";
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleShare = () => setShareOpen(!shareOpen);

  const copyEventLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 mt-20">
      {/* Hero section with full-width image */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <img
          src={event.mainImage || "/api/placeholder/1200/500"}
          alt={event.title}
          className="w-full h-full object-cover"
        />

        {/* Top navigation bar */}
        <div className="absolute top-0 left-0 right-0 z-20 p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 px-4 py-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
            >
              <FaChevronLeft /> Back
            </button>

            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all"
                  title="Share event"
                >
                  <FaShare />
                </button>
                {shareOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <button
                      onClick={copyEventLink}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Copy event link
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category badge and title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-black/70 to-transparent">
          <div className="max-w-5xl mx-auto">
            <div
              className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-3 
              ${
                event.category === "workshop"
                  ? "bg-blue-500 text-white"
                  : event.category === "seminar"
                  ? "bg-purple-500 text-white"
                  : event.category === "conference"
                  ? "bg-orange-500 text-white"
                  : "bg-green-500 text-white"
              }`}
            >
              {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left column - Event details */}
          <div className="md:col-span-2">
            {/* Event information card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  About this event
                </h2>
                <p className="text-gray-700 mb-6 whitespace-pre-line leading-relaxed">
                  {event.description}
                </p>

                {/* Registration section */}
                {event.hasRegistration && (
                  <div className="mt-6">
                    {event.active ? (
                      /* Active event with registration */
                      <Link
                        to={`/registrationForm?formUrl=${encodeURIComponent(
                          event.registrationUrl
                        )}`}
                        className="block w-full md:w-auto md:inline-block text-center px-6 py-3 bg-navy-blue text-white font-medium rounded-lg hover:bg-dark-purple transition-colors"
                      >
                        Register for this event{" "}
                        <FaExternalLinkAlt className="inline ml-2" size={14} />
                      </Link>
                    ) : (
                      /* Inactive event - registration closed */
                      <div className="flex items-center p-4 border border-gray-200 bg-gray-50 rounded-lg">
                        <div className="flex-shrink-0 mr-3">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <FaTimes className="text-gray-500" />
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">
                            Registration Closed
                          </p>
                          <p className="text-sm text-gray-600">
                            This event is no longer accepting registrations
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Organizers section */}
            {event.organizers && event.organizers.length > 0 && (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-4">
                    Organizers
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.organizers.map((organizer, index) => (
                      <div
                        key={index}
                        className="flex items-center p-3 bg-gray-50 rounded-lg"
                      >
                        <img
                          src={organizer.image}
                          alt={organizer.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-gray-900">
                            {organizer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {organizer.role}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right column - Event meta information */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Event Details
                </h3>

                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaCalendarAlt className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">Date</p>
                      <p className="text-gray-600">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaClock className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">Time</p>
                      <p className="text-gray-600">{event.time || "TBA"}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaMapMarkerAlt className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-gray-900 font-medium">Location</p>
                      <p className="text-gray-600">{event.location || "TBA"}</p>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        event.active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <p className="ml-2 text-sm text-gray-600">
                      {event.active
                        ? "This event is active"
                        : "This event is inactive"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementDetails;
