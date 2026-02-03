import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useLocation, useNavigate } from 'react-router-dom';
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
} from 'react-icons/fa';
import { getAnnouncementById } from '../../../features/announcements/announcementsThunks';
import AnnouncementDetailsLoader from '../../../components/Announcements/AnnouncementDetailsLoader';
import SpeakerDetails from '../../../components/SpeakerDetails';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from '@dr.pogodin/react-helmet';

const AnnouncementDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [selectedSpeaker, setSelectedSpeaker] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const [stateEvent, setStateEvent] = useState(null);
  const { announcementById, isLoading, error } = useSelector(
    (state) => state.announcements
  );
  let event = stateEvent || announcementById;
  const fetchAnnouncementData = useCallback(
    async (id) => {
      try {
        await dispatch(getAnnouncementById(id)).unwrap();
      } catch (error) {
        console.error('Error fetching announcement:', error);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    const loadEvent = async () => {
      if (location.state && location.state.event) {
        setStateEvent(location.state.event);
      } else {
        // If not in state, fetch it using the ID
        if (!announcementById && !error) {
          fetchAnnouncementData(id);
        }
      }
    };
    loadEvent();
  }, [location, fetchAnnouncementData, dispatch]);

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
        console.error('Could not copy URL: ', err);
      }
    );
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const convertTo12HourFormat = (time24) => {
    if (!time24 || !time24.includes(':')) return 'TBA';

    const [hours, minutes] = time24.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
  };

  if (isLoading || (!event && !error)) {
    return <AnnouncementDetailsLoader />;
  }

  if (error) {
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
      {/* Meta tags for SEO + social */}
      <title>{event.title}</title>
      <Helmet>
        <meta name="description" content={event.description} />

        {/* Open Graph */}
        <meta property="og:title" content={event.title} />
        <meta property="og:description" content={event.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://bitwiseclub.com/" />
        <meta property="og:image" content="https://bitwiseclub.com/logo.png" />

        {/* Twitter (X) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={event.title} />
        <meta name="twitter:description" content={event.description} />
        <meta name="twitter:image" content="https://bitwiseclub.com/logo.png" />
        <meta name="twitter:creator" content="@BitwiseClub" />
      </Helmet>
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
          src={event.mainImageUrl}
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
                event.category === 'workshop'
                  ? 'bg-blue-500 text-white'
                  : event.category === 'seminar'
                    ? 'bg-purple-500 text-white'
                    : event.category === 'conference'
                      ? 'bg-orange-500 text-white'
                      : 'bg-green-500 text-white'
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

                {/* Schedule timeline */}
                <div className="mt-6 mb-8">
                  <h3 className="text-xl font-bold text-dark-purple mb-4 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Event Schedule
                  </h3>

                  <div className="space-y-4">
                    {event.schedule && event.schedule.length > 0 ? (
                      event.schedule.map((item, index) => (
                        <div
                          key={index}
                          className={`border-l-4 rounded-lg ${
                            item.type !== 'session'
                              ? 'border-light bg-gray-50 p-4 rounded-r-lg'
                              : 'border-navy-blue'
                          } pl-4 pb-4`}
                        >
                          <div className="flex flex-col mb-1">
                            <span
                              className={`${
                                item.type !== 'session'
                                  ? 'bg-light text-dark-purple'
                                  : 'bg-navy-blue text-white'
                              } px-3 py-1 rounded-lg text-sm font-medium mb-2 inline-block w-fit`}
                            >
                              {convertTo12HourFormat(item.startTime)}{' '}
                              {item.endTime ? `- ${item.endTime}` : ''}
                              <span>
                                {item.date ? `On ${formatDate(item.date)}` : ''}
                              </span>
                            </span>
                            <h4 className="font-bold text-dark-purple mt-1">
                              {item.title}
                            </h4>
                          </div>
                          {item.presenter && (
                            <p className="text-dark-purple text-sm mt-1">
                              <span className="font-semibold">Presenter:</span>{' '}
                              {item.presenter}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No schedule available for this event.
                      </div>
                    )}
                  </div>
                </div>
                <hr />

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
                        Register for this event{' '}
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
                            src={
                              organizer.imageUrl || '/api/placeholder/100/100'
                            }
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
                      <p className="text-dark-purple/70">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>

                  {/* Time */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaClock className="h-5 w-5 text-navy-blue" />
                    </div>
                    <div className="ml-3">
                      <p className="text-dark-purple font-medium">Time</p>
                      <p className="text-dark-purple/70">
                        {convertTo12HourFormat(event.time)}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <FaMapMarkerAlt className="h-5 w-5 text-navy-blue font" />
                    </div>
                    <div className="ml-3">
                      <p className="text-dark-purple font-medium">Location</p>
                      <p className="text-dark-purple/70">
                        {event.location || 'TBA'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-6 pt-4 border-t border-dark-purple">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        event.active ? 'bg-green-500' : 'bg-gray-400'
                      }`}
                    ></div>
                    <p className="ml-2 text-sm text-dark-purple/70">
                      {event.active
                        ? 'This event is active'
                        : 'This event is inactive'}
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
