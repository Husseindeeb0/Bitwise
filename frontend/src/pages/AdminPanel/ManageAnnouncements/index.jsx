import { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaSave,
  FaExclamationCircle,
  FaCalendar,
} from "react-icons/fa";
import {
  getAnnouncements,
  addAnnouncements,
  editAnnouncements,
  deleteAnnouncements,
} from "../../../features/announcements/announcementsThunks";
import AnnouncementCardsLoader from "../../../components/AnnouncementCardsLoader";
import AnnouncementCard from "../../../components/AnnouncementCard";
import { useDispatch, useSelector } from "react-redux";

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
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "workshop",
    mainImageUrl: "",
    organizers: [],
    schedule: [],
    active: true,
    hasRegistration: false,
    registrationUrl: "",
  });

  // Organizer form state
  const [currentOrganizer, setCurrentOrganizer] = useState({
    name: "",
    expertise: "",
    description: "",
    instaLink: "",
    linkedinLink: "",
    startTime: "",
    title: "",
    imageUrl: "",
  });
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [editingOrganizerIndex, setEditingOrganizerIndex] = useState(null);

  const [isDeleting, setIsDeleting] = useState(null);

  // Schedule form state
  const [currentScheduleItem, setCurrentScheduleItem] = useState({
    startTime: "",
    endTime: "",
    title: "",
    description: "",
    presenter: "",
    type: "session",
  });
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [editingScheduleIndex, setEditingScheduleIndex] = useState(null);

  const fetchData = async () => {
    try {
      await dispatch(getAnnouncements()).unwrap();
    } catch (error) {
      console.error("Error fetching announcements:", error);
    }
  };

  useEffect(() => {
    if (!announcementsData && !error) {
      fetchData();
    }
  }, [dispatch]);

  // Event form handling
  const handleInputChange = (e) => {
    let { name, value, files } = e.target;

    if (name === "mainImageUrl") {
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
      // Clear the URL if unchecking
      registrationUrl: e.target.checked ? currentEvent.registrationUrl : "",
    });
  };

  // Organizer form handling
  const handleOrganizerInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "imageUrl") {
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

  // CRUD operations for announcements
  const handleEventSubmit = async (e) => {
    if (e) e.preventDefault(); // Prevent default form submission

    if (isEditing) {
      await updateAnnouncements();
    } else {
      await newAnnouncements();
    }
    resetForm();
  };

  const newAnnouncements = async () => {
    try {
      const newAnnouncement = {
        ...currentEvent,
      };
      await dispatch(addAnnouncements(newAnnouncement)).unwrap();
      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const updateAnnouncements = async () => {
    try {
      // Ensure we have the ID for the event being updated
      if (!currentEvent._id) {
        console.error("Missing event ID for update operation");
        return;
      }

      const updatedAnnouncement = {
        ...currentEvent,
      };

      await dispatch(editAnnouncements(updatedAnnouncement)).unwrap();
      await fetchData();
      resetForm();
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      // Ensure we have the ID for the event being updated
      if (!id) {
        console.error("Missing event ID for deleting operation");
        return;
      }
      await dispatch(deleteAnnouncements(id)).unwrap();
      await fetchData();
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const formatDateForInput = (date) => {
    const parsedDate = new Date(date);
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
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

  const handleOrganizerSubmit = (e) => {
    if (e) e.preventDefault();

    if (!currentOrganizer.name) {
      return;
    }

    if (editingOrganizerIndex !== null) {
      // Update existing organizer
      const updatedOrganizers = [...currentEvent.organizers];
      updatedOrganizers[editingOrganizerIndex] = {
        ...currentOrganizer,
        id: currentOrganizer.id || Date.now(),
      };

      setCurrentEvent({
        ...currentEvent,
        organizers: updatedOrganizers,
      });
    } else {
      // Add new organizer
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
    setCurrentEvent({
      ...currentEvent,
      organizers: updatedOrganizers,
    });
  };

  // Reset forms
  const resetForm = () => {
    setIsEditing(false);
    setShowForm(false);
    setCurrentEvent({
      id: null,
      title: "",
      description: "",
      date: "",
      time: "",
      location: "",
      category: "workshop",
      mainImage: "/api/placeholder/400/220",
      organizers: [],
      schedule: [],
      active: true,
      hasRegistration: false,
      registrationUrl: "",
    });
    resetOrganizerForm();
  };

  const resetOrganizerForm = () => {
    setCurrentOrganizer({
      id: null,
      name: "",
      expertise: "",
      description: "",
      instaLink: "",
      linkedinLink: "",
      startTime: "",
      title: "",
      image: "/api/placeholder/80/80",
    });
    setShowOrganizerForm(false);
    setEditingOrganizerIndex(null);
  };

  const handleScheduleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentScheduleItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addScheduleItem = () => {
    if (editingScheduleIndex !== null) {
      const updatedSchedule = [...currentEvent.schedule];
      updatedSchedule[editingScheduleIndex] = currentScheduleItem;
      setCurrentEvent((prev) => ({
        ...prev,
        schedule: updatedSchedule,
      }));
      setEditingScheduleIndex(null);
    } else {
      setCurrentEvent((prev) => ({
        ...prev,
        schedule: [...prev.schedule, currentScheduleItem],
      }));
    }
    setCurrentScheduleItem({
      startTime: "",
      endTime: "",
      title: "",
      description: "",
      presenter: "",
      type: "session",
    });
    setShowScheduleForm(false);
  };

  const editScheduleItem = (index) => {
    setCurrentScheduleItem(currentEvent.schedule[index]);
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
    <div className="max-w-6xl mx-auto pt-30 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm), showForm ? resetForm() : null;
          }}
          className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-sky-blue transition-colors"
        >
          {showForm ? <FaTimes size={18} /> : <FaPlus size={18} />}
          {showForm ? "Cancel" : "New Event"}
        </button>
      </div>

      {/* Form for adding/editing announcements */}
      {showForm && (
        <form
          className="bg-light-purple p-6 rounded-lg mb-16 border-2 border-navy-blue"
          onSubmit={handleEventSubmit} // Add form submission handler
        >
          <h2 className="text-xl font-semibold mb-4">
            {isEditing ? "Edit Event" : "Create New Event"}
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
                required={true}
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
                required={true}
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
              required={true}
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
                required={true}
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
                required={true}
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
              required={true}
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
                {showOrganizerForm ? "Cancel" : "Add Organizer"}
              </button>
            </div>

            {/* Organizer form */}
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
                      required={true}
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
                      required={true}
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
                    required={true}
                    onChange={handleOrganizerInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                    placeholder="Describe the event"
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
                      required={false}
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
                      required={false}
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
                      required={true}
                      onChange={handleOrganizerInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                      placeholder="Start time"
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
                      required={true}
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
                      required={true}
                      onChange={handleOrganizerInputChange}
                      className="flex-1 max-w-56 px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                      placeholder="Profile image URL"
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
                    type="button" // Changed to button type to prevent form submission
                    onClick={handleOrganizerSubmit} // Direct click handler
                    className="px-3 py-1 bg-navy-blue text-white text-sm rounded-md hover:bg-sky-blue"
                  >
                    {editingOrganizerIndex !== null ? "Update" : "Add"}
                  </button>
                </div>
              </div>
            )}

            {/* Organizers list */}
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
            <label
              htmlFor="active"
              className="ml-2 block text-sm text-gray-700"
            >
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
                <p className="text-xs text-gray-500 mt-1">
                  Enter the URL where users can register for this event
                </p>
              </div>
            )}
          </div>

          {/* Schedule Management Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Event Schedule
              </h3>
              <button
                type="button"
                onClick={() => setShowScheduleForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue/90"
              >
                <FaPlus size={16} />
                Add Schedule Item
              </button>
            </div>

            {/* Schedule Items List */}
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
                          ({item.startTime} - {item.endTime})
                        </span>
                        {item.type === "break" && (
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

            {/* Schedule Item Form Modal */}
            {showScheduleForm && (
              <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 w-full max-w-md">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {editingScheduleIndex !== null
                        ? "Edit Schedule Item"
                        : "Add Schedule Item"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        setShowScheduleForm(false);
                        setEditingScheduleIndex(null);
                        setCurrentScheduleItem({
                          startTime: "",
                          endTime: "",
                          title: "",
                          description: "",
                          presenter: "",
                          type: "session",
                        });
                      }}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>

                  <div className="space-y-4">
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
                          End Time
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

                    {currentScheduleItem.type === "session" && (
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
                            startTime: "",
                            endTime: "",
                            title: "",
                            description: "",
                            presenter: "",
                            type: "session",
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
                        {editingScheduleIndex !== null ? "Update" : "Add"} Item
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
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-dark-purple hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading ? true : false}
              className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-sky-blue"
            >
              <FaSave size={18} />
              {isEditing ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      )}

      {/* Announcements list with skeleton isLoading */}
      <div>
        <div className="grid grid-cols-1 gap-6">
          {isLoading ? (
            <>
              {/* Show multiple skeleton loaders */}
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
      </div>

      {/* Delete confirmation modal */}
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
