import React, { useEffect, useState } from "react";
import { FaPlus, FaTrophy, FaCalendar, FaMapMarkerAlt, FaUser, FaTimes, FaUpload, FaTrash, FaChevronDown, FaChevronUp, FaSave, FaUsers } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AchievementCard from "../../../components/AchievementCard/index";
import { addAchievements, getAchievements, deleteAchievements, editAchievements } from "../../../features/achievements/achievementsThunks";

function ManageAchievements() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  // modal mode : add or edit
  const [modalMode, setModalMode] = useState("add"); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInstructorForm, setShowInstructorForm] = useState(false);
  const [editingAchievementId, setEditingAchievementId] = useState(null);
  const [newAchievement, setNewAchievement] = useState({
    title: "",
    description: "",
    time: "",
    category: "",
    location: "",
    imageUrl: "",
    imageId: "",
    instructors: []
  });
  const [newInstructor, setNewInstructor] = useState({
    name: "",
    email: "",
    avatarUrl: "",
    role: ""
  });

// const achievementsData = useSelector((state) => {
//   const data = state.achievements?.achievementsData;
//   console.log("Raw achievementsData from Redux:", data);
//   console.log("Type:", typeof data);
//   return data;
// });

const achievementsData = useSelector((state) => {
  const data = state.achievements?.achievementsData;
  // Handle both: direct array OR { message, achievementsData } object
  if (Array.isArray(data)) return data;
  if (data?.achievementsData) return data.achievementsData;
  return [];
});

const [isDeleting, setIsDeleting] = useState(null);

// delete achievements
const handleDeleteAchievements = async (id) =>{
  try {
    if(!id) {
      console.error("Missing event ID for deletind operation");
      return;
    }
    setIsDeleting(id)
    await dispatch(deleteAchievements(id)).unwrap();
    console.log("deleting Achievement completed");
    }
  catch(error){
    toast.error(error || "Failed to delete achievement")
  } finally{
    setIsDeleting(null);
  }
}



// Get Achievements
useEffect(() => {
  dispatch(getAchievements());
}, [dispatch]);


  const handleAddAchievement = () => {
    resetForm();
    setModalMode("add");                  
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    if (isSubmitting) return;
    
    if (
      newAchievement.title ||
      newAchievement.description ||
      newAchievement.time ||
      newAchievement.imageUrl ||
      newAchievement.instructors.length > 0
    ) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        resetForm();
      }
    } else {
      resetForm();
    }
  };



const resetForm = () => {
  setIsModalOpen(false);
  setShowInstructorForm(false);
  setModalMode('add');
  setEditingAchievementId(null);
  setNewAchievement({
    title: "",
    description: "",
    time: "",
    category: "",
    location: "",
    imageUrl: "",
    imageId: "",
    instructors: []
  });
  setNewInstructor({ name: "", email: "", avatarUrl: "", role: "" });
};

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInstructorInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddInstructor = () => {
    if (!newInstructor.name.trim()) {
      toast.error("Instructor name is required");
      return;
    }

    // Generate a temporary ID if not present
    const instructorWithId = {
      ...newInstructor,
      _id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    setNewAchievement(prev => ({
      ...prev,
      instructors: [...prev.instructors, instructorWithId]
    }));
    
    setNewInstructor({ name: "", email: "", avatarUrl: "", role: "" });
    setShowInstructorForm(false);
    toast.success("Instructor added successfully");
  };

// edit achievements hanlde
const handleEditAchievement = (achievement) =>{

    let formattedTime = "";
    if (achievement.time) {
      const date = new Date(achievement.time);
      formattedTime = date.toISOString().slice(0,16);
    } 

      setNewAchievement({
      _id : achievement._id,
      title : achievement.title || "",
      description : achievement.description || "",
      time: formattedTime,
      category: achievement.category || "",
      location: achievement.location || "",
      imageUrl: achievement.imageUrl || "",
      imageId: achievement.imageId || "",
      instructors: achievement.instructors || []
    })

    setModalMode('edit');
    setEditingAchievementId(achievement._id);
    setIsModalOpen(true);

}

  const handleEditInstructor = (index) => {
    const instructor = newAchievement.instructors[index];
    setNewInstructor(instructor);
    setShowInstructorForm(true);
    
    // Remove the instructor from list (will be re-added when saved)
    handleRemoveInstructor(index);
  };

  const handleRemoveInstructor = (index) => {
    const updatedInstructors = [...newAchievement.instructors];
    updatedInstructors.splice(index, 1);
    
    setNewAchievement(prev => ({
      ...prev,
      instructors: updatedInstructors
    }));
    
    toast.info("Instructor removed");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result;
      setNewAchievement(prev => ({
        ...prev,
        imageUrl: imageUrl,
        imageId: `img_${Date.now()}_${file.name.replace(/\s+/g, '_')}`
      }));
    };
    reader.onerror = () => {
      toast.error("Failed to read image file");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setNewAchievement(prev => ({
      ...prev,
      imageUrl: "",
      imageId: ""
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Validation
    const errors = [];
    if (!newAchievement.title.trim()) errors.push("Title is required");
    if (!newAchievement.description.trim()) errors.push("Description is required");
    if (!newAchievement.time) errors.push("Date & Time is required");
    if (!newAchievement.category) errors.push("Category is required");
    if (!newAchievement.location.trim()) errors.push("Location is required");
    if (!newAchievement.imageUrl) errors.push("Achievement image is required");

    if (errors.length > 0) throw new Error(errors.join(", "));

    // console.log("Submitting achievement:", newAchievement);
    console.log("FRONTEND DATA:", newAchievement);

    if (modalMode === "add") {
    // Dispatch the async thunk
    await dispatch(addAchievements(newAchievement)).unwrap()
    toast.success("achievement added successfully");
    } else if (modalMode === "edit") {
      await dispatch(editAchievements({
        id:editingAchievementId,
        achievementData: newAchievement
      })).unwrap();
      toast.success("Achievement updated successfully!");
    };

    resetForm();
  dispatch(getAchievements()); // Refresh the list
  } catch (error) {
    toast.error(error.message || "Failed to add achievement");
  } finally {
    setIsSubmitting(false);
  }
};

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Get category options
  const categoryOptions = [
    "Technology", "Business", "Design", "Science", 
    "Education", "Sports", "Arts", "Certification",
    "Workshop", "Seminar", "Conference", "Training"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Achievements</h1>
            <p className="text-gray-600">Add, edit, and organize your achievements and certifications</p>
          </div>
          
          <button
            onClick={handleAddAchievement}
            className="group relative flex items-center justify-center px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></span>
            <span className="relative flex items-center">
              <FaTrophy className="mr-2" />
              Add Achievement
              <FaPlus className="ml-2 text-sm opacity-80" />
            </span>
          </button>
        </div>

        {/* Empty State */}
  {achievementsData.length === 0 ? (
  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center">
      <FaTrophy className="text-4xl text-blue-600" />
    </div>
    <h2 className="text-2xl font-bold text-gray-800 mb-3">
      No achievements yet
    </h2>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      Start building your portfolio by adding your first achievement
    </p>
  </div>
) : (
  <div className="grid grid-cols-1 gap-6">
    {achievementsData.map((achievement) => (
      <AchievementCard
        key={achievement?._id || Math.random()}
        achievement={achievement}
        page="adminPanel"
        editAchievement={handleEditAchievement}
        // setIsDeleting={() => {}}
         deleteAchievements={handleDeleteAchievements}  
         isDeleting={isDeleting === achievement._id} 
      />
    ))}
  </div>
)}

      </div>

      {/* Add Achievement Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={handleCloseModal}
            ></div>

            {/* Modal panel */}
            <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <FaTrophy className="text-white text-2xl mr-3" />
                    <div>
                      <h3 className="text-2xl font-bold text-white">{modalMode == 'add' ? 'Add New Achievement': 'Edit Achievement'}</h3>
                      <p className="text-blue-100 text-sm">{modalMode == 'add'? 'Fill in the achievement details': 'Update the achievement details'}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCloseModal}
                    className="text-white hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-white/10"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="bg-white p-6">
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Achievement Title <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={newAchievement.title}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="e.g., Full Stack Web Development Certification"
                          required
                        />
                      </div>

                      {/* Description */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={newAchievement.description}
                          onChange={handleInputChange}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Describe what you achieved and what you learned..."
                          required
                        />
                      </div>

                      {/* Date & Time */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date & Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="datetime-local"
                            name="time"
                            value={newAchievement.time}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            required
                          />
                        </div>
                      </div>

                      {/* Category */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="category"
                          value={newAchievement.category}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>

                      {/* Location */}
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Location <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                          <input
                            type="text"
                            name="location"
                            value={newAchievement.location}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            placeholder="e.g., Online Platform, University Name, Conference Center"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Image Upload Section */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Achievement Image <span className="text-red-500">*</span>
                      </label>
                      <div className="space-y-4">
                        {newAchievement.imageUrl ? (
                          <div className="relative group">
                            <img
                              src={newAchievement.imageUrl}
                              alt="Preview"
                              className="w-full h-64 object-cover rounded-lg border-2 border-gray-200"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                              <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all duration-300 transform scale-0 group-hover:scale-100"
                              >
                                <FaTrash size={20} />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="border-3 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-300">
                            <div className="max-w-xs mx-auto">
                              <FaUpload className="mx-auto text-gray-400 text-4xl mb-4" />
                              <p className="text-gray-600 mb-2 font-medium">Upload achievement image</p>
                              <p className="text-gray-500 text-sm mb-4">Supports JPG, PNG up to 5MB</p>
                              <label className="cursor-pointer inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300">
                                <FaUpload className="mr-2" />
                                Choose Image
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleImageUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Instructors Section */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                      {/* Section Header */}
                      <div 
                        className="bg-gray-50 px-5 py-4 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => setShowInstructorForm(!showInstructorForm)}
                      >
                        <div className="flex items-center">
                          <FaUsers className="text-blue-600 mr-3" />
                          <div>
                            <h4 className="font-semibold text-gray-800">Instructors</h4>
                            <p className="text-sm text-gray-600">
                              {newAchievement.instructors.length} instructor(s) added
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className="text-sm text-gray-500 mr-3">(Optional)</span>
                          {showInstructorForm ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>

                      {/* Instructor List */}
                      {newAchievement.instructors.length > 0 && (
                        <div className="p-5 bg-gray-50 border-t border-gray-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {newAchievement.instructors.map((instructor, index) => (
                              <div key={instructor._id || index} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between group hover:border-blue-300 transition-colors">
                                <div className="flex items-center">
                                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center mr-3">
                                    {instructor.avatarUrl ? (
                                      <img
                                        src={instructor.avatarUrl}
                                        alt={instructor.name}
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-blue-600 font-bold">
                                        {getInitials(instructor.name)}
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-800">{instructor.name}</p>
                                    <div className="flex items-center text-sm text-gray-600">
                                      {instructor.email && (
                                        <span className="mr-3">{instructor.email}</span>
                                      )}
                                      {instructor.role && (
                                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                                          {instructor.role}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button
                                    type="button"
                                    onClick={() => handleEditInstructor(index)}
                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                    title="Edit"
                                  >
                                    <FaSave size={14} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInstructor(index)}
                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                                    title="Remove"
                                  >
                                    <FaTimes size={14} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Add Instructor Form */}
                      {showInstructorForm && (
                        <div className="p-5 border-t border-gray-200 bg-blue-50">
                          <h5 className="font-semibold text-gray-800 mb-4">Add New Instructor</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="name"
                                value={newInstructor.name}
                                onChange={handleInstructorInputChange}
                                placeholder="John Doe"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={newInstructor.email}
                                onChange={handleInstructorInputChange}
                                placeholder="john@example.com"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Role/Position
                              </label>
                              <input
                                type="text"
                                name="role"
                                value={newInstructor.role}
                                onChange={handleInstructorInputChange}
                                placeholder="Lead Instructor"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Avatar URL
                              </label>
                              <input
                                type="text"
                                name="avatarUrl"
                                value={newInstructor.avatarUrl}
                                onChange={handleInstructorInputChange}
                                placeholder="https://example.com/avatar.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end space-x-3 mt-4">
                            <button
                              type="button"
                              onClick={() => {
                                setNewInstructor({ name: "", email: "", avatarUrl: "", role: "" });
                                setShowInstructorForm(false);
                              }}
                              className="px-4 py-2 text-gray-700 hover:text-gray-900"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={handleAddInstructor}
                              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <FaUser className="mr-2" />
                              Add Instructor
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Add Instructor Button */}
                      {!showInstructorForm && (
                        <div className="p-5">
                          <button
                            type="button"
                            onClick={() => setShowInstructorForm(true)}
                            className="flex items-center justify-center w-full py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-400 transition-colors duration-300"
                          >
                            <FaPlus className="mr-2" />
                            Add Instructor
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Form Actions */}
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        <span className="text-red-500">*</span> Required fields
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={handleCloseModal}
                          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-300"
                          disabled={isSubmitting}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="relative flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 group"
                        >
                          <span className="absolute inset-0 bg-gradient-to-r from-blue-700 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
                          <span className="relative flex items-center">
                            {isSubmitting ? (
                              <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            { modalMode == 'add' ?  'Adding Achievement...' : 'Updating Achievement...'}                              </>
                            ) : (
                              <>
                                <FaTrophy className="mr-2" />
                                {modalMode == 'add' ? 'Add Achievement' : 'Update Achievement'}
                              </>
                            )}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageAchievements;