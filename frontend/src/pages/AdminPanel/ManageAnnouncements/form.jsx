import { useState, useEffect } from 'react';
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaSave,
  FaExclamationCircle,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import {
  addAnnouncements,
  editAnnouncements,
} from '../../../features/announcements/announcementsThunks';

const AnnouncementForm = ({ isEditing, eventData, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.announcements.isLoading);

  const [currentEvent, setCurrentEvent] = useState(eventData);

  // Organizer form state
  const [currentOrganizer, setCurrentOrganizer] = useState({
    name: '',
    expertise: '',
    description: '',
    instaLink: '',
    linkedinLink: '',
    startTime: '',
    title: '',
    imageUrl: '',
  });
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [editingOrganizerIndex, setEditingOrganizerIndex] = useState(null);

  // Schedule form state
  const [currentScheduleItem, setCurrentScheduleItem] = useState({
    startTime: '',
    endTime: '',
    date: '',
    title: '',
    description: '',
    presenter: '',
    type: 'session',
  });
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingScheduleIndex, setEditingScheduleIndex] = useState(null);
  const [scheduleError, setScheduleError] = useState('');

  // Update internal state if eventData changes (for editing)
  useEffect(() => {
    setCurrentEvent(eventData);
  }, [eventData]);

  const formatDateForInput = (date) => {
    if (!date) return '';
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleInputChange = (e) => {
    let { name, value, files } = e.target;

    if (name === 'mainImageUrl') {
      const file = files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setCurrentEvent((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
    } else {
      setCurrentEvent((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    setCurrentEvent({
      ...currentEvent,
      active: e.target.checked,
    });
  };

  const handleRegistrationCheckboxChange = (e) => {
    setCurrentEvent({
      ...currentEvent,
      hasRegistration: e.target.checked,
      registrationUrl: e.target.checked ? currentEvent.registrationUrl : '',
    });
  };

  const handleOrganizerInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'imageUrl') {
      const file = files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setCurrentOrganizer((prev) => ({
          ...prev,
          [name]: reader.result,
        }));
      };
    } else {
      setCurrentOrganizer((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleEventSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      if (isEditing) {
        if (!currentEvent._id) {
          console.error('Missing event ID for update operation');
          return;
        }
        await dispatch(editAnnouncements(currentEvent)).unwrap();
      } else {
        await dispatch(addAnnouncements(currentEvent)).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  const handleOrganizerSubmit = (e) => {
    if (e) e.preventDefault();
    if (!currentOrganizer.name) return;

    if (editingOrganizerIndex !== null) {
      const updatedOrganizers = [...currentEvent.organizers];
      updatedOrganizers[editingOrganizerIndex] = {
        ...currentOrganizer,
        id: currentOrganizer.id || Date.now(),
      };
      setCurrentEvent({ ...currentEvent, organizers: updatedOrganizers });
    } else {
      setCurrentEvent({
        ...currentEvent,
        organizers: [
          ...currentEvent.organizers,
          { ...currentOrganizer, id: Date.now() },
        ],
      });
    }
    resetOrganizerForm();
  };

  const editOrganizer = (index) => {
    setCurrentOrganizer({ ...currentEvent.organizers[index] });
    setEditingOrganizerIndex(index);
    setShowOrganizerForm(true);
  };

  const removeOrganizer = (index) => {
    const updatedOrganizers = [...currentEvent.organizers];
    updatedOrganizers.splice(index, 1);
    setCurrentEvent({ ...currentEvent, organizers: updatedOrganizers });
  };

  const resetOrganizerForm = () => {
    setCurrentOrganizer({
      id: null,
      name: '',
      expertise: '',
      description: '',
      instaLink: '',
      linkedinLink: '',
      startTime: '',
      title: '',
      imageUrl: '',
    });
    setShowOrganizerForm(false);
    setEditingOrganizerIndex(null);
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentScheduleItem((prev) => ({ ...prev, [name]: value }));
    if (scheduleError) setScheduleError('');
  };

  const addScheduleItem = () => {
    const { startTime, title, presenter } = currentScheduleItem;
    if (
      !startTime ||
      !title ||
      (currentScheduleItem.type === 'session' && !presenter)
    ) {
      setScheduleError(
        'Please fill in required fields (Start Time, Title, and Presenter for sessions).'
      );
      return;
    }

    if (editingScheduleIndex !== null) {
      const updatedSchedule = [...currentEvent.schedule];
      updatedSchedule[editingScheduleIndex] = currentScheduleItem;
      setCurrentEvent((prev) => ({ ...prev, schedule: updatedSchedule }));
      setEditingScheduleIndex(null);
    } else {
      setCurrentEvent((prev) => ({
        ...prev,
        schedule: [...prev.schedule, currentScheduleItem],
      }));
    }
    setCurrentScheduleItem({
      startTime: '',
      endTime: '',
      date: '',
      title: '',
      description: '',
      presenter: '',
      type: 'session',
    });
    setScheduleError('');
    setShowScheduleForm(false);
  };

  const editScheduleItem = (index) => {
    const scheduleItem = currentEvent.schedule[index];
    setCurrentScheduleItem({
      ...scheduleItem,
      date: scheduleItem.date ? formatDateForInput(scheduleItem.date) : '',
    });
    setEditingScheduleIndex(index);
    setShowScheduleForm(true);
  };

  const removeScheduleItem = (index) => {
    setCurrentEvent((prev) => ({
      ...prev,
      schedule: prev.schedule.filter((_, i) => i !== index),
    }));
  };

  return (
    <form
      className="bg-light-purple p-6 rounded-lg mb-16 border-2 border-navy-blue"
      onSubmit={handleEventSubmit}
    >
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Edit Event' : 'Create New Event'}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Event Title
          </label>
          <input
            type="text"
            name="title"
            value={currentEvent.title}
            required
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
            placeholder="Title of the event"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            name="category"
            value={currentEvent.category}
            required
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
          >
            <option value="workshop">Workshop</option>
            <option value="seminar">Seminar</option>
            <option value="conference">Conference</option>
            <option value="networking">Networking Event</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={currentEvent.description}
          required
          onChange={handleInputChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
          placeholder="Describe the event"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={currentEvent.date}
            required
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={currentEvent.time}
            required
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={currentEvent.location}
          required
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
          placeholder="Event venue and address"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Choose your Poster Image
        </label>
        <div className="flex items-center gap-3">
          <input
            type="file"
            name="mainImageUrl"
            accept="image/*"
            required={!isEditing}
            onChange={handleInputChange}
            className="flex-1 max-w-56 px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue cursor-pointer"
          />
          {currentEvent.mainImageUrl && (
            <div className="border border-gray-300 rounded-md overflow-hidden">
              <img
                src={currentEvent.mainImageUrl}
                alt="Event preview"
                className="w-16 h-16 object-cover"
              />
            </div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Event Speakers
          </label>
          <button
            type="button"
            onClick={() => setShowOrganizerForm(!showOrganizerForm)}
            className="text-sm text-navy-blue hover:text-sky-blue flex items-center gap-1"
          >
            <FaPlus size={16} />
            {showOrganizerForm ? 'Cancel' : 'Add Organizer'}
          </button>
        </div>

        {showOrganizerForm && (
          <div className="bg-white p-4 rounded-md border border-gray-200 mb-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={currentOrganizer.name}
                  required
                  onChange={handleOrganizerInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  placeholder="Speaker name"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Area of expertise
                </label>
                <input
                  type="text"
                  name="expertise"
                  value={currentOrganizer.expertise}
                  required
                  onChange={handleOrganizerInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  placeholder="Speaker expertise"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={currentOrganizer.description}
                required
                onChange={handleOrganizerInputChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                placeholder="Describe the speaker"
              ></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Instagram Link
                </label>
                <input
                  type="text"
                  name="instaLink"
                  value={currentOrganizer.instaLink}
                  onChange={handleOrganizerInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  placeholder="Link"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Linkedin Link
                </label>
                <input
                  type="text"
                  name="linkedinLink"
                  value={currentOrganizer.linkedinLink}
                  onChange={handleOrganizerInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  placeholder="Link"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Time
                </label>
                <input
                  type="time"
                  name="startTime"
                  value={currentOrganizer.startTime}
                  required
                  onChange={handleOrganizerInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentOrganizer.title}
                  required
                  onChange={handleOrganizerInputChange}
                  className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  placeholder="Title"
                />
              </div>
            </div>
            <div className="my-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Profile Image URL
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  name="imageUrl"
                  required={!currentOrganizer.imageUrl}
                  onChange={handleOrganizerInputChange}
                  className="flex-1 max-w-56 px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                />
                {currentOrganizer.imageUrl && (
                  <div className="border border-gray-300 rounded-full overflow-hidden">
                    <img
                      src={currentOrganizer.imageUrl}
                      alt="Organizer preview"
                      className="w-10 h-10 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleOrganizerSubmit}
                className="px-3 py-1 bg-navy-blue text-white text-sm rounded-md hover:bg-sky-blue"
              >
                {editingOrganizerIndex !== null ? 'Update' : 'Add'}
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-md border border-gray-200">
          {currentEvent.organizers.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {currentEvent.organizers.map((organizer, index) => (
                <li
                  key={organizer.id || index}
                  className="p-3 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={organizer.imageUrl}
                      alt={organizer.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-800">
                        {organizer.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {organizer.expertise}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => editOrganizer(index)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOrganizer(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-3 text-center text-sm text-gray-500">
              No Speakers added yet
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="checkbox"
          id="active"
          checked={currentEvent.active}
          onChange={handleCheckboxChange}
          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 accent-navy-blue"
        />
        <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
          Active Event
        </label>
      </div>

      <div className="mb-4">
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            id="hasRegistration"
            checked={currentEvent.hasRegistration}
            onChange={handleRegistrationCheckboxChange}
            className="h-4 w-4 text-indigo-600 bg-navy-blue focus:ring-indigo-500 border-gray-300 accent-navy-blue"
          />
          <label
            htmlFor="hasRegistration"
            className="ml-2 block text-sm text-gray-700"
          >
            Enable Registration
          </label>
        </div>

        {currentEvent.hasRegistration && (
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Registration URL
            </label>
            <input
              type="url"
              name="registrationUrl"
              value={currentEvent.registrationUrl}
              required={currentEvent.hasRegistration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
              placeholder="https://example.com/register"
            />
          </div>
        )}
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Event Schedule</h3>
          <button
            type="button"
            onClick={() => setShowScheduleForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue/90"
          >
            <FaPlus size={16} />
            Add Schedule Item
          </button>
        </div>

        {currentEvent.schedule.length > 0 && (
          <div className="space-y-4">
            {currentEvent.schedule.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.title}</span>
                    <span className="text-sm text-gray-500">
                      ({item.startTime}{' '}
                      {item.endTime ? `- ${item.endTime}` : ''})
                    </span>
                    {item.type === 'break' && (
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        Break
                      </span>
                    )}
                  </div>
                  {item.presenter && (
                    <p className="text-sm text-gray-600">
                      Presenter: {item.presenter}
                    </p>
                  )}
                  {item.description && (
                    <p className="text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => editScheduleItem(index)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeScheduleItem(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showScheduleForm && (
          <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingScheduleIndex !== null
                    ? 'Edit Schedule Item'
                    : 'Add Schedule Item'}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowScheduleForm(false);
                    setEditingScheduleIndex(null);
                    setCurrentScheduleItem({
                      startTime: '',
                      endTime: '',
                      title: '',
                      description: '',
                      presenter: '',
                      type: 'session',
                    });
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <div className="space-y-4">
                {scheduleError && (
                  <div className="flex items-center gap-2 p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                    <FaExclamationCircle />
                    <span>{scheduleError}</span>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    name="type"
                    value={currentScheduleItem.type}
                    onChange={handleScheduleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  >
                    <option value="session">Session</option>
                    <option value="break">Break</option>
                    <option value="opening">Opening</option>
                    <option value="closing">Closing</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Start Time
                    </label>
                    <input
                      type="time"
                      name="startTime"
                      value={currentScheduleItem.startTime}
                      onChange={handleScheduleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      End Time(Optional)
                    </label>
                    <input
                      type="time"
                      name="endTime"
                      value={currentScheduleItem.endTime}
                      onChange={handleScheduleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date(Optional)
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={currentScheduleItem.date}
                    onChange={handleScheduleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentScheduleItem.title}
                    onChange={handleScheduleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                    placeholder="Session title"
                  />
                </div>

                {currentScheduleItem.type === 'session' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Presenter
                    </label>
                    <input
                      type="text"
                      name="presenter"
                      value={currentScheduleItem.presenter}
                      onChange={handleScheduleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                      placeholder="Presenter name"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowScheduleForm(false);
                      setEditingScheduleIndex(null);
                      setCurrentScheduleItem({
                        startTime: '',
                        endTime: '',
                        date: '',
                        title: '',
                        description: '',
                        presenter: '',
                        type: 'session',
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={addScheduleItem}
                    className="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue/90"
                  >
                    {editingScheduleIndex !== null ? 'Update' : 'Add'} Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-dark-purple hover:bg-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center gap-2 px-4 py-2 ${
            isLoading ? 'bg-navy-blue/30' : 'bg-navy-blue hover:bg-sky-blue'
          } text-white rounded-md`}
        >
          <FaSave size={18} />
          {isEditing ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
