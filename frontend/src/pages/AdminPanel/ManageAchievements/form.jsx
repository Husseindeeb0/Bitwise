import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaCalendar,
  FaMapMarkerAlt,
  FaUpload,
  FaTrash,
  FaUsers,
  FaEdit,
  FaUser,
  FaSave,
  FaBriefcase,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import {
  addAchievements,
  editAchievements,
  getAchievements,
} from '../../../features/achievements/achievementsThunks';

const AchievementForm = ({ initialData, modalMode, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAchievement, setNewAchievement] = useState(initialData);
  const [isInstructorFormOpen, setIsInstructorFormOpen] = useState(false);
  const [editingInstructorIndex, setEditingInstructorIndex] = useState(null);
  const [newInstructor, setNewInstructor] = useState({ name: '', role: '' });

  useEffect(() => {
    setNewAchievement(initialData);
  }, [initialData]);

  const categoryOptions = [
    'Technology',
    'Business',
    'Design',
    'Science',
    'Education',
    'Sports',
    'Arts',
    'Certification',
    'Workshop',
    'Seminar',
    'Conference',
    'Training',
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAchievement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewAchievement((prev) => ({
        ...prev,
        imageUrl: reader.result,
        imageId: `img_${Date.now()}_${file.name.replace(/\s+/g, '_')}`,
      }));
    };
    reader.onerror = () => {
      toast.error('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setNewAchievement((prev) => ({
      ...prev,
      imageUrl: '',
      imageId: '',
    }));
  };

  const handleInstructorInputChange = (e) => {
    const { name, value } = e.target;
    setNewInstructor((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveInstructor = () => {
    if (!newInstructor.name.trim()) {
      toast.error('Instructor name is required');
      return;
    }
    if (!newInstructor.role.trim()) {
      toast.error('Instructor role is required');
      return;
    }

    if (editingInstructorIndex !== null) {
      const updatedInstructors = [...newAchievement.instructors];
      updatedInstructors[editingInstructorIndex] = { ...newInstructor };

      setNewAchievement((prev) => ({
        ...prev,
        instructors: updatedInstructors,
      }));
      toast.success('Instructor updated');
    } else {
      const instructorWithId = {
        ...newInstructor,
        _id: `inst_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      setNewAchievement((prev) => ({
        ...prev,
        instructors: [...prev.instructors, instructorWithId],
      }));
      toast.success('Instructor added');
    }

    setNewInstructor({ name: '', role: '' });
    setIsInstructorFormOpen(false);
    setEditingInstructorIndex(null);
  };

  const handleCancelInstructor = () => {
    setNewInstructor({ name: '', role: '' });
    setIsInstructorFormOpen(false);
    setEditingInstructorIndex(null);
  };

  const handleEditInstructor = (index) => {
    const instructor = newAchievement.instructors[index];
    setNewInstructor(instructor);
    setEditingInstructorIndex(index);
    setIsInstructorFormOpen(true);
  };

  const handleRemoveInstructor = (index) => {
    const updatedInstructors = [...newAchievement.instructors];
    updatedInstructors.splice(index, 1);

    setNewAchievement((prev) => ({
      ...prev,
      instructors: updatedInstructors,
    }));

    if (editingInstructorIndex === index) {
      handleCancelInstructor();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const errors = [];
      if (!newAchievement.title.trim()) errors.push('Title is required');
      if (!newAchievement.description.trim())
        errors.push('Description is required');
      if (!newAchievement.time) errors.push('Date is required');
      if (!newAchievement.category) errors.push('Category is required');
      if (!newAchievement.location.trim()) errors.push('Location is required');
      if (!newAchievement.imageUrl) errors.push('Image is required');

      if (errors.length > 0) throw new Error(errors.join(', '));

      if (modalMode === 'add') {
        await dispatch(addAchievements(newAchievement)).unwrap();
        toast.success('Achievement added successfully');
      } else if (modalMode === 'edit') {
        await dispatch(
          editAchievements({
            id: newAchievement._id,
            achievementData: newAchievement,
          })
        ).unwrap();
        toast.success('Achievement updated successfully!');
      }

      onSuccess();
      dispatch(getAchievements());
    } catch (error) {
      console.error('Achievement save error:', error);
      const errorMessage =
        typeof error === 'string'
          ? error
          : error.message || 'Failed to save achievement';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      {/* Title & Category Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-dark-purple mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={newAchievement.title}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-sky-blue/30 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-navy-blue transition-all text-dark-purple"
            placeholder="Achievement title..."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-purple mb-1.5">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            name="category"
            value={newAchievement.category}
            onChange={handleInputChange}
            className="w-full px-4 py-2.5 border border-sky-blue/30 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-navy-blue transition-all text-dark-purple"
            required
          >
            <option value="">Select...</option>
            {categoryOptions.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1.5">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={newAchievement.description}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-2.5 border border-sky-blue/30 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-navy-blue transition-all text-dark-purple resize-none"
          placeholder="Describe this achievement..."
          required
        />
      </div>

      {/* Date & Location Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-dark-purple mb-1.5">
            Date <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-blue/40" />
            <input
              type="date"
              name="time"
              value={newAchievement.time}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2.5 border border-sky-blue/30 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-navy-blue transition-all text-dark-purple"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-dark-purple mb-1.5">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-blue/40" />
            <input
              type="text"
              name="location"
              value={newAchievement.location}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-2.5 border border-sky-blue/30 rounded-xl focus:ring-2 focus:ring-navy-blue focus:border-navy-blue transition-all text-dark-purple"
              placeholder="Event location..."
              required
            />
          </div>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-dark-purple mb-1.5">
          Image <span className="text-red-500">*</span>
        </label>
        {newAchievement.imageUrl ? (
          <div className="relative group rounded-xl overflow-hidden">
            <img
              src={newAchievement.imageUrl}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-dark-purple/0 group-hover:bg-dark-purple/50 transition-colors flex items-center justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="opacity-0 group-hover:opacity-100 bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-all"
              >
                <FaTrash size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-sky-blue/40 rounded-xl p-6 text-center hover:border-navy-blue/50 transition-colors">
            <FaUpload className="mx-auto text-navy-blue/30 text-3xl mb-3" />
            <p className="text-navy-blue/60 text-sm mb-3">JPG, PNG up to 5MB</p>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-lg text-sm font-medium hover:bg-navy-blue/90 transition-colors">
              <FaUpload size={12} />
              Upload Image
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* Instructors Section */}
      <div className="border border-sky-blue/30 rounded-xl overflow-hidden bg-background1/50">
        <div className="px-4 py-3 bg-navy-blue/5 flex justify-between items-center border-b border-sky-blue/20">
          <div className="flex items-center gap-2">
            <FaUsers className="text-navy-blue" />
            <span className="font-semibold text-dark-purple">Instructors</span>
            {newAchievement.instructors.length > 0 && (
              <span className="text-xs bg-navy-blue text-white px-2 py-0.5 rounded-full">
                {newAchievement.instructors.length}
              </span>
            )}
          </div>
        </div>

        <div className="p-4 space-y-4">
          {newAchievement.instructors.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {newAchievement.instructors.map((instructor, index) => (
                <div
                  key={instructor._id || index}
                  className={`flex items-center p-3 bg-white rounded-xl border transition-all ${
                    editingInstructorIndex === index
                      ? 'border-navy-blue ring-1 ring-navy-blue shadow-md'
                      : 'border-sky-blue/20 shadow-sm hover:border-sky-blue/50'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-navy-blue flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-sm mr-3">
                    {getInitials(instructor.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-dark-purple text-sm truncate">
                      {instructor.name}
                    </h4>
                    <p className="text-navy-blue/60 text-[10px] sm:text-xs truncate">
                      {instructor.role}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleEditInstructor(index)}
                      className="p-1.5 text-navy-blue hover:bg-navy-blue/10 rounded-lg transition-colors"
                    >
                      <FaEdit size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveInstructor(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {isInstructorFormOpen ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white border border-sky-blue/30 rounded-xl p-4 shadow-sm"
              >
                <h4 className="text-sm font-bold text-navy-blue mb-3 uppercase tracking-wider">
                  {editingInstructorIndex !== null
                    ? 'Edit Instructor'
                    : 'New Instructor'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  <div className="relative">
                    <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-blue/40 text-xs" />
                    <input
                      type="text"
                      name="name"
                      value={newInstructor.name}
                      onChange={handleInstructorInputChange}
                      placeholder="Full Name *"
                      className="w-full pl-8 pr-3 py-2 border border-sky-blue/30 rounded-lg text-sm focus:ring-2 focus:ring-navy-blue focus:border-navy-blue"
                    />
                  </div>
                  <div className="relative">
                    <FaBriefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-blue/40 text-xs" />
                    <input
                      type="text"
                      name="role"
                      value={newInstructor.role}
                      onChange={handleInstructorInputChange}
                      placeholder="Role (e.g. Instructor) *"
                      className="w-full pl-8 pr-3 py-2 border border-sky-blue/30 rounded-lg text-sm focus:ring-2 focus:ring-navy-blue focus:border-navy-blue"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancelInstructor}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveInstructor}
                    className="flex items-center gap-1.5 px-4 py-1.5 bg-navy-blue text-white rounded-lg text-sm font-medium hover:bg-navy-blue/90"
                  >
                    {editingInstructorIndex !== null ? (
                      <FaSave size={12} />
                    ) : (
                      <FaPlus size={12} />
                    )}
                    {editingInstructorIndex !== null
                      ? 'Update Instructor'
                      : 'Add Instructor'}
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                type="button"
                onClick={() => setIsInstructorFormOpen(true)}
                className="w-full py-3 border-2 border-dashed border-sky-blue/40 rounded-xl flex items-center justify-center gap-2 text-navy-blue/70 font-medium hover:border-navy-blue hover:text-navy-blue hover:bg-white transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-sky-blue/10 flex items-center justify-center group-hover:bg-navy-blue group-hover:text-white transition-colors">
                  <FaPlus size={12} />
                </div>
                Add Instructor
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-between items-center pt-4 border-t border-sky-blue/20">
        <span className="text-xs text-navy-blue/50">
          <span className="text-red-500">*</span> Required
        </span>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-5 py-2.5 border border-sky-blue/30 text-navy-blue rounded-xl font-medium hover:bg-background1 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-navy-blue text-white rounded-xl font-medium hover:bg-navy-blue/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {modalMode === 'add' ? 'Adding...' : 'Updating...'}
              </>
            ) : (
              <>
                <FaSave size={14} />
                {modalMode === 'add' ? 'Add Achievement' : 'Save Changes'}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export default AchievementForm;
