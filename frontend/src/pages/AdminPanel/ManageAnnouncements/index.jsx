import { useState, useEffect } from 'react';
import { FaPlus, FaTimes, FaCalendar } from 'react-icons/fa';
import {
  getAnnouncements,
  deleteAnnouncements,
} from '../../../features/announcements/announcementsThunks';
import AnnouncementCardsLoader from '../../../components/Announcements/AnnouncementCardsLoader';
import AdminAnnouncementCard from './AdminAnnouncementCard';
import { useDispatch, useSelector } from 'react-redux';
import AnnouncementForm from './form';
import BookForm from './BookForm';
import { AnimatePresence } from 'framer-motion';
import ConfirmationModal from '../../../components/ConfirmationModal';

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
                <AdminAnnouncementCard
                  event={event}
                  editEvent={editEvent}
                  setIsDeleting={setIsDeleting}
                  manageForm={handleBookForm}
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

      <ConfirmationModal
        isOpen={!!isDeleting}
        onClose={() => setIsDeleting(null)}
        onConfirm={() => deleteEvent(isDeleting)}
        title="Delete Event"
        message="Are you sure you want to delete this event? This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ManageAnnouncements;
