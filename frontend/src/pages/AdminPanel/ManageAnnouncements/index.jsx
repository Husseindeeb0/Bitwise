import React, { useState, useEffect } from "react";
import {
  FaTrash,
  FaEdit,
  FaPlus,
  FaTimes,
  FaSave,
  FaExclamationCircle,
  FaCalendar,
} from "react-icons/fa";
import { useMyContext } from "../../../context";
import getAnnouncements from "../../../api/getAnnouncements";
import addAnnouncements from "../../../api/addAnnouncements";
import editAnnouncements from "../../../api/editAnnouncements";
import deleteAnnouncements from "../../../api/deleteAnnouncement";
import AnnouncementCardsLoader from "../../../components/AnnouncementCardsLoader";
import AnnouncementCard from "../../../components/AnnouncementCard";

const ManageAnnouncements = () => {
  const { accessToken } = useMyContext();

  // Sample initial announcements
  const [announcements, setAnnouncements] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [currentEvent, setCurrentEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    location: "",
    category: "workshop",
    mainImage: "/api/placeholder/400/220",
    organizers: [],
    active: true,
  });

  // Organizer form state
  const [currentOrganizer, setCurrentOrganizer] = useState({
    name: "",
    role: "",
    image: "/api/placeholder/80/80",
  });
  const [showOrganizerForm, setShowOrganizerForm] = useState(false);
  const [editingOrganizerIndex, setEditingOrganizerIndex] = useState(null);

  const [isDeleting, setIsDeleting] = useState(null);

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

  // Event form handling
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentEvent({
      ...currentEvent,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e) => {
    setCurrentEvent({
      ...currentEvent,
      active: e.target.checked,
    });
  };

  // Organizer form handling
  const handleOrganizerInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOrganizer({
      ...currentOrganizer,
      [name]: value,
    });
  };

  // CRUD operations for announcements
  const handleEventSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    
    if (isEditing) {
      await updateAnnouncements();
    } else {
      await newAnnouncements();
    }
  };

  const newAnnouncements = async () => {
    try {
      const newAnnouncement = {
        ...currentEvent
      };

      const response = await addAnnouncements(newAnnouncement, accessToken);
      if (response.state === "success") {
        await fetchData();
        resetForm();
      } else {
        console.log(response.message);
      }
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
        ...currentEvent
      };

      const response = await editAnnouncements(updatedAnnouncement, accessToken);
      if (response.state === "success") {
        await fetchData();
        resetForm();
      } else {
        console.error("Update failed:", response.message);
      }
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

      const response = await deleteAnnouncements(id, accessToken);
      if (response.state === "success") {
        await fetchData();
      } else {
        console.error("delete failed:", response.message);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setIsDeleting(null);
    }
  };

  const editEvent = (event) => {
    setIsEditing(true);
    setShowForm(true);
    setCurrentEvent({ ...event });
  };

  const handleOrganizerSubmit = (e) => {
    if (e) e.preventDefault(); // Prevent default form submission if event exists
    
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
      active: true,
    });
    resetOrganizerForm();
  };

  const resetOrganizerForm = () => {
    setCurrentOrganizer({
      id: null,
      name: "",
      role: "",
      image: "/api/placeholder/80/80",
    });
    setShowOrganizerForm(false);
    setEditingOrganizerIndex(null);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "workshop":
        return "bg-blue-100 text-blue-800";
      case "seminar":
        return "bg-purple-100 text-purple-800";
      case "conference":
        return "bg-orange-100 text-orange-800";
      case "networking":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Date formatting helper
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-6xl mx-auto pt-30 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Event Management</h1>
        <button
          onClick={() => {setShowForm(!showForm), showForm ? resetForm() : null}}
          className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-dark-purple transition-colors"
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
              Main Image URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                name="mainImage"
                value={currentEvent.mainImage}
                required={true}
                onChange={handleInputChange}
                className="flex-1 w-full px-3 py-2 border border-gray-300 bg-white rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                placeholder="Image URL for the event"
              />
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <img
                  src={currentEvent.mainImage}
                  alt="Event preview"
                  className="w-16 h-16 object-cover"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              For this demo, use placeholder URLs like
              "/api/placeholder/width/height"
            </p>
          </div>

          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Event Organizers
              </label>
              <button
                type="button"
                onClick={() => setShowOrganizerForm(!showOrganizerForm)}
                className="text-sm text-indigo-600 hover:text-indigo-900 flex items-center gap-1"
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
                      placeholder="Organizer name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={currentOrganizer.role}
                      required={true}
                      onChange={handleOrganizerInputChange}
                      className="w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                      placeholder="Organizer role"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Profile Image URL
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="text"
                      name="image"
                      value={currentOrganizer.image}
                      required={true}
                      onChange={handleOrganizerInputChange}
                      className="flex-1 w-full px-3 py-2 border border-gray-300 bg-light-purple rounded-md focus:outline-none focus:ring-2 focus:ring-navy-blue"
                      placeholder="Profile image URL"
                    />
                    <div className="border border-gray-300 rounded-full overflow-hidden">
                      <img
                        src={currentOrganizer.image}
                        alt="Organizer preview"
                        className="w-10 h-10 object-cover"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button" // Changed to button type to prevent form submission
                    onClick={handleOrganizerSubmit} // Direct click handler
                    className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
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
                          src={organizer.image}
                          alt={organizer.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-800">
                            {organizer.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {organizer.role}
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
                  No organizers added yet
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
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label
              htmlFor="active"
              className="ml-2 block text-sm text-gray-700"
            >
              Active Event
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-dark-purple"
            >
              <FaSave size={18} />
              {isEditing ? "Update Event" : "Create Event"}
            </button>
          </div>
        </form>
      )}

      {/* Announcements list with skeleton loading */}
      <div>
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
                <AnnouncementCard event={event} page="adminPanel" />
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