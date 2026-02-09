import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaTimes,
  FaExclamationCircle,
  FaCalendar,
} from 'react-icons/fa';
import {
  getAnnouncements,
  deleteAnnouncements,
} from '../../../features/announcements/announcementsThunks';
import AnnouncementCardsLoader from '../../../components/Announcements/AnnouncementCardsLoader';
import AnnouncementCard from '../../../components/Announcements/AnnouncementCard';
import { useDispatch, useSelector } from 'react-redux';
import AnnouncementForm from './form';
import BookForm from './BookForm';
import { AnimatePresence } from 'framer-motion';

const ManageAnnouncements = () => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.announcements.isLoading);
  const error = useSelector((state) => state.announcements.error);
  const announcementsData = useSelector(
    (state) => state.announcements.announcementsData
  );

  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'workshop',
    mainImageUrl: '',
    organizers: [],
    schedule: [],
    active: true,
    hasRegistration: false,
    registrationUrl: '',
  });

  const [isDeleting, setIsDeleting] = useState(null);
  const [managedEvent, setManagedEvent] = useState(null);

  const handleBookForm = (event) => {
    setManagedEvent(event);
  };

  const fetchData = async () => {
    try {
      await dispatch(getAnnouncements()).unwrap();
    } catch (error) {
      console.error('Error fetching announcements:', error);
    }
  };

  useEffect(() => {
    if (!announcementsData && !error) {
      fetchData();
    }
  }, [dispatch]);

  const deleteEvent = async (id) => {
    try {
      if (!id) {
        console.error('Missing event ID for deleting operation');
        return;
      }
      await dispatch(deleteAnnouncements(id)).unwrap();
      await fetchData();
    } catch (error) {
      console.error('Error deleting event:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDateForInput = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const editEvent = (event) => {
    const date = formatDateForInput(event.date);

    setIsEditing(true);
    setShowForm(true);
    setCurrentEvent({
      ...event,
      date: date,
    });
  };

  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setCurrentEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      category: 'workshop',
      mainImageUrl: '',
      organizers: [],
      schedule: [],
      active: true,
      hasRegistration: false,
      registrationUrl: '',
    });
  };

  const handleFormSuccess = () => {
    fetchData();
    resetForm();
  };

  return (
    <div className="max-w-6xl mx-auto pt-30 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-sky-blue transition-colors"
        >
          {showForm ? <FaTimes size={18} /> : <FaPlus size={18} />}
          {showForm ? 'Cancel' : 'New Event'}
        </button>
      </div>

      {showForm && (
        <AnnouncementForm
          isEditing={isEditing}
          eventData={currentEvent}
          onSuccess={handleFormSuccess}
          onCancel={resetForm}
        />
      )}

      {!showForm ? (
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, index) => (
                <AnnouncementCardsLoader key={index} />
              ))}
            </>
          ) : Array.isArray(announcementsData) &&
            announcementsData.length > 0 ? (
            announcementsData.map((event) => (
              <div key={event._id}>
                <AnnouncementCard
                  event={event}
                  editEvent={editEvent}
                  setIsDeleting={setIsDeleting}
                  manageForm={handleBookForm}
                  page="adminPanel"
                />
              </div>
            ))
          ) : (
            <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
              <div className="flex flex-col items-center">
                <FaCalendar size={40} className="text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-900">
                  No announcements found
                </h3>
                <p className="text-gray-500 mt-1">
                  Start by creating your first event!
                </p>
                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  <FaPlus size={18} />
                  Create New Event
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      <AnimatePresence>
        {managedEvent && (
          <BookForm
            announcement={managedEvent}
            onClose={() => setManagedEvent(null)}
            onSuccess={() => {
              fetchData();
              setManagedEvent(null);
            }}
          />
        )}
      </AnimatePresence>

      {isDeleting && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">
              &#8203;
            </span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FaExclamationCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Delete Event
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete this event? This action
                        cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => deleteEvent(isDeleting)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setIsDeleting(null)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageAnnouncements;
