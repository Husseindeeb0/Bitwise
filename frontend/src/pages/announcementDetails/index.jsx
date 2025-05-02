import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { useMyContext } from "../../context";
import {
  FaCalendarAlt,
  FaClock,
  FaMapMarkerAlt,
  FaChevronLeft,
  FaExternalLinkAlt,
  FaTimes,
  FaLink,
  FaCheck,
  FaInfoCircle,
} from "react-icons/fa";
import getAnnouncementById from "../../api/getAnnouncementById";
import SpeakerDetails from "../../components/SpeakerDetails";

const AnnouncementDetails = () => {
  const { accessToken, setLoading } = useMyContext();
  const location = useLocation();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAnnouncementData = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await getAnnouncementById(accessToken, id);

      // Check if the response contains the expected data
      if (response.state === "success") {
        // Enhance organizers with additional mock data for our new modal
        if (response.data.organizers && response.data.organizers.length > 0) {
          response.data.organizers = response.data.organizers.map(organizer => ({
            ...organizer,
            bio: organizer.bio || "An experienced professional with extensive knowledge in their field. They have contributed to numerous projects and initiatives in the industry.",
            expertise: organizer.expertise || ["Technology", "Leadership", "Innovation"],
            linkedin: organizer.linkedin || "https://linkedin.com",
            instagram: organizer.instagram || "https://instagram.com",
            education: organizer.education || "Master's Degree, Computer Science"
          }));
        }
        setEvent(response.data);
      } else {
        console.error(response.message);
        setEvent([]);
      }
    } catch (error) {
      console.error("Error fetching announcement:", error);
      setEvent([]);
    } finally {
      setLoading(false);
    }
  }, [accessToken, setLoading]);

  useEffect(() => {
    const loadEvent = async () => {
      // First check if the event data is in location state
      const searchParams = new URLSearchParams(location.search);
      const id = searchParams.get("id");
      if (location.state && location.state.event) {
        // Enhance organizers with additional mock data
        if (location.state.event.organizers && location.state.event.organizers.length > 0) {
          location.state.event.organizers = location.state.event.organizers.map(organizer => ({
            ...organizer,
            bio: organizer.bio || "An experienced professional with extensive knowledge in their field. They have contributed to numerous projects and initiatives in the industry.",
            expertise: organizer.expertise || ["Technology", "Leadership", "Innovation"],
            linkedin: organizer.linkedin || "https://linkedin.com",
            instagram: organizer.instagram || "https://instagram.com",
            education: organizer.education || "Master's Degree, Computer Science"
          }));
        }
        setEvent(location.state.event);
        setLoading(false);
      } else {
        // If not in state, fetch it using the ID
        await fetchAnnouncementData(id);
      }
    };
    loadEvent();
  }, [location, fetchAnnouncementData, setLoading]);

  // Function to open the speaker modal
  const openSpeakerModal = (speaker) => {
    setSelectedSpeaker(speaker);
    setIsModalOpen(true);
  };

  // Function to close the speaker modal
  const closeSpeakerModal = () => {
    setIsModalOpen(false);
  };

  // Function to copy the current URL to clipboard
  const copyEventLink = () => {
    navigator.clipboard.writeText(window.location.href).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (err) => {
        console.error("Could not copy URL: ", err);
      }
    );
  };

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

  const convertTo12HourFormat = (time24) => {
    if (!time24 || !time24.includes(":")) return "TBA";

    const [hours, minutes] = time24.split(":");
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

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

  return (
    <div className="min-h-screen mt-20">
      {/* Speaker Modal */}
      <SpeakerDetails 
        isOpen={isModalOpen} 
        onClose={closeSpeakerModal} 
        speaker={selectedSpeaker}
        convertTo12HourFormat={convertTo12HourFormat}
      />

      {/* Hero section with full-width image */}
      <div className="relative h-80 md:h-96 lg:h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-dark-purple/20 z-10"></div>
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
              className="flex items-center gap-2 px-4 py-2 bg-navy-blue/50 hover:bg-navy-blue/70 text-white rounded-full transition-all"
            >
              <FaChevronLeft /> Back
            </button>

            <button
              onClick={copyEventLink}
              className="flex items-center gap-2 px-4 py-2 bg-navy-blue/50 hover:bg-navy-blue/70 text-white rounded-full transition-all"
              title="Copy event link"
            >
              {copied ? (
                <>
                  <FaCheck size={14} /> Copied!
                </>
              ) : (
                <>
                  <FaLink size={14} /> Copy Link
                </>
              )}
            </button>
          </div>
        </div>

        {/* Category badge and title overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 bg-gradient-to-t from-sky-blue/70 to-transparent">
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
            <div className="bg-light/50 rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-dark-purple mb-4">
                  About this event
                </h2>
                <p className="text-dark-purple mb-6 whitespace-pre-line leading-relaxed">
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
                        className="block w-full md:w-auto md:inline-block text-center px-6 py-3 bg-navy-blue text-white font-medium rounded-lg hover:bg-sky-blue transition-colors"
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
                          <p className="font-medium text-dark-purple">
                            Registration Closed
                          </p>
                          <p className="text-sm text-dark-purple">
                            This event is no longer accepting registrations
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Speakers section - ENHANCED */}
            {event.organizers && event.organizers.length > 0 && (
              <div className="bg-light/50 rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold capitalize text-dark-purple">
                      {event.category} Speakers
                    </h2>
                    <div className="text-navy-blue/70 text-sm flex items-center gap-1">
                      <FaInfoCircle size={14} />
                      <span>Click on speaker for details</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {event.organizers.map((organizer, index) => (
                      <div
                        key={index}
                        onClick={() => openSpeakerModal(organizer)}
                        className="flex items-center h-20 p-4 bg-white rounded-lg border border-transparent hover:border-sky-blue hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="relative">
                          <img
                            src={organizer.image || "/api/placeholder/100/100"}
                            alt={organizer.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-navy-blue group-hover:border-sky-blue transition-colors"
                          />
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-navy-blue group-hover:bg-sky-blue text-white rounded-full flex items-center justify-center transition-colors">
                            <FaInfoCircle size={12} />
                          </div>
                        </div>
                        <div className="ml-4">
                          <p className="font-medium text-dark-purple group-hover:text-sky-blue transition-colors">
                            {organizer.name}
                          </p>
                          <p className="text-sm text-dark-purple/70">
                            {organizer.expertise}
                          </p>
                          <div className="h-0.5 w-8 bg-sky-blue/30 group-hover:bg-sky-blue mt-1 transition-colors"></div>
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
            <div className="bg-light/50 rounded-xl shadow-lg overflow-hidden sticky top-8">
              <div className="p-6">
                <h3 className="text-lg font-bold text-dark-purple mb-4">
                  Event Details
                </h3>

                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaCalendarAlt className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-dark-purple font-medium">Date</p>
                      <p className="text-dark-purple/70">{formatDate(event.date)}</p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaClock className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-dark-purple font-medium">Time</p>
                      <p className="text-dark-purple/70">{convertTo12HourFormat(event.time)}</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaMapMarkerAlt className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-dark-purple font-medium">Location</p>
                      <p className="text-dark-purple/70">{event.location || "TBA"}</p>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-6 pt-4 border-t border-dark-purple">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        event.active ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></div>
                    <p className="ml-2 text-sm text-dark-purple/70">
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