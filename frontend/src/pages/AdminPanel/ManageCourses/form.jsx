import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaSave,
  FaTimes,
  FaBook,
  FaUser,
  FaClock,
  FaDollarSign,
  FaListUl,
  FaPlay,
  FaEye,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { addCourse, editCourse } from '../../../features/courses/coursesThunks';

export default function CourseForm({
  isEditing,
  initialData,
  onSuccess,
  onCancel,
}) {
  const dispatch = useDispatch();
  const isLoading = useSelector((state) => state.courses.isLoading);

  const [courseData, setCourseData] = useState(initialData);
  const [expandedSections, setExpandedSections] = useState({});

  const difficulties = ['Beginner', 'Intermediate', 'Advanced'];
  const languages = ['English', 'Arabic'];

  useEffect(() => {
    setCourseData(initialData);
  }, [initialData]);

  const handleInputChange = (e, nested = null) => {
    const { name, value, type, checked, files } = e.target;

    if (type === 'file' && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (nested) {
          setCourseData((prev) => ({
            ...prev,
            [nested]: {
              ...prev[nested],
              [name]: reader.result,
            },
          }));
        } else {
          setCourseData((prev) => ({
            ...prev,
            [name]: reader.result,
          }));
        }
      };
      reader.readAsDataURL(file);
      return;
    }

    const inputValue = type === 'checkbox' ? checked : value;

    if (nested) {
      setCourseData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [name]: inputValue,
        },
      }));
    } else {
      setCourseData((prev) => ({
        ...prev,
        [name]: inputValue,
      }));
    }
  };

  const handleArrayChange = (e, field, index) => {
    const { value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addArrayItem = (field) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeArrayItem = (field, index) => {
    setCourseData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSectionChange = (e, sectionIndex, field) => {
    const { value } = e.target;
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  };

  const handleLectureChange = (e, sectionIndex, lectureIndex, field) => {
    const { value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              lectures: section.lectures.map((lecture, j) =>
                j === lectureIndex
                  ? { ...lecture, [field]: inputValue }
                  : lecture
              ),
            }
          : section
      ),
    }));
  };

  const addSection = () => {
    const newId = Math.max(...courseData.sections.map((s) => s.id), 0) + 1;
    setCourseData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: newId,
          title: '',
          lectures: [
            {
              id: 1,
              title: '',
              duration: '',
              lecture: '',
              isPreview: false,
            },
          ],
        },
      ],
    }));
  };

  const removeSection = (index) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
  };

  const addLecture = (sectionIndex) => {
    const section = courseData.sections[sectionIndex];
    const newId = Math.max(...section.lectures.map((l) => l.id), 0) + 1;

    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              lectures: [
                ...section.lectures,
                {
                  id: newId,
                  title: '',
                  duration: '',
                  lecture: '',
                  isPreview: false,
                },
              ],
            }
          : section
      ),
    }));
  };

  const removeLecture = (sectionIndex, lectureIndex) => {
    setCourseData((prev) => ({
      ...prev,
      sections: prev.sections.map((section, i) =>
        i === sectionIndex
          ? {
              ...section,
              lectures: section.lectures.filter((_, j) => j !== lectureIndex),
            }
          : section
      ),
    }));
  };

  const toggleSectionExpand = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await dispatch(editCourse(courseData)).unwrap();
      } else {
        await dispatch(addCourse(courseData)).unwrap();
      }
      onSuccess();
    } catch (err) {
      console.error('Course submission failed:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Basic Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaBook className="text-navy-blue" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title
              </label>
              <input
                type="text"
                name="title"
                value={courseData.title}
                placeholder="Enter Course Title"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
            <div className="flex gap-5 items-center justify-between">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category (Optional)
                </label>
                <input
                  value={courseData.category || ''}
                  placeholder="Field name (e.g., web development...)"
                  name="category"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={courseData.type}
                  name="type"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-navy-blue rounded-lg focus:ring-2 focus:ring-navy-blue focus:border-transparent"
                  required
                >
                  <option value="Course">Course</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty
              </label>
              <select
                value={courseData.difficulty}
                name="difficulty"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-navy-blue rounded-lg focus:ring-2 focus:ring-navy-blue focus:border-transparent"
                required
              >
                {difficulties.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Language
              </label>
              <select
                value={courseData.language}
                name="language"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-navy-blue rounded-lg focus:ring-2 focus:ring-navy-blue focus:border-transparent"
                required
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={courseData.description}
                placeholder="Overview About Course..."
                name="description"
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseData.isPopular}
                  name="isPopular"
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Popular</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={courseData.isBestseller}
                  name="isBestseller"
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">Bestseller</span>
              </label>
            </div>
          </div>
        </div>

        {/* Instructor Information */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaUser className="text-navy-blue" />
            Instructor Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={courseData.instructor.name}
                placeholder="Enter Instructor Name"
                name="name"
                onChange={(e) => handleInputChange(e, 'instructor')}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Courses Number (Optional)
              </label>
              <input
                type="number"
                value={courseData.instructor.coursesNum}
                name="coursesNum"
                onChange={(e) => handleInputChange(e, 'instructor')}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                value={courseData.instructor.bio}
                placeholder="Area Of Expertise..."
                name="bio"
                onChange={(e) => handleInputChange(e, 'instructor')}
                rows={3}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Instructor Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  name="imageUrl"
                  onChange={(e) => handleInputChange(e, 'instructor')}
                  className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                  accept="image/*"
                  required={!isEditing && !courseData.instructor.imageUrl}
                />
                {courseData.instructor.imageUrl && (
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={courseData.instructor.imageUrl}
                      alt="Instructor profile preview"
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing and Media */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaDollarSign className="text-navy-blue" />
            Pricing & Media
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (Optional)
              </label>
              <input
                type="number"
                value={courseData.price || ''}
                placeholder="Enter Current Price"
                name="price"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Original Price (Optional)
              </label>
              <input
                type="number"
                value={courseData.originalPrice || ''}
                placeholder="Enter Original Price"
                name="originalPrice"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Poster Course Image
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  name="posterUrl"
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                  accept="image/*"
                  required={!isEditing && !courseData.posterUrl}
                />
                {courseData.posterUrl && (
                  <div className="border border-gray-300 rounded-md overflow-hidden">
                    <img
                      src={courseData.posterUrl}
                      alt="Poster preview"
                      className="w-16 h-16 object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Course Details */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaClock className="text-purple-600" />
            Course Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Hours
              </label>
              <input
                type="number"
                value={courseData.hours}
                name="hours"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Lectures
              </label>
              <input
                type="number"
                value={courseData.lecturesNum}
                name="lecturesNum"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Updated
              </label>
              <input
                type="date"
                value={courseData.lastUpdated}
                name="lastUpdated"
                onChange={handleInputChange}
                className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                required
              />
            </div>
          </div>
        </div>

        {/* Learning Outcomes */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FaListUl className="text-indigo-600" />
            Learning Outcomes
          </h3>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What You Will Learn
            </label>
            {courseData.whatYouWillLearn.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) =>
                    handleArrayChange(e, 'whatYouWillLearn', index)
                  }
                  className="flex-1 px-4 py-2 border outline-navy-blue rounded-lg"
                  required
                  placeholder="Enter learning outcome..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('whatYouWillLearn', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('whatYouWillLearn')}
              className="mt-2 px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Learning Outcome
            </button>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Skills Gained (Optional)
            </label>
            {courseData.skillsGained.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, 'skillsGained', index)}
                  className="flex-1 px-4 py-2 border outline-navy-blue rounded-lg"
                  placeholder="Enter skill..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('skillsGained', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('skillsGained')}
              className="mt-2 px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Skill
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Requirements
            </label>
            {courseData.requirements.map((item, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleArrayChange(e, 'requirements', index)}
                  className="flex-1 px-4 py-2 border outline-navy-blue rounded-lg"
                  placeholder="Enter requirement..."
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem('requirements', index)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('requirements')}
              className="mt-2 px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Requirement
            </button>
          </div>
        </div>

        {/* Course Content */}
        <div className="bg-gray-50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FaPlay className="text-navy-blue" />
              Course Content
            </h3>
            <button
              type="button"
              onClick={addSection}
              className="px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
            >
              <FaPlus /> Add Section
            </button>
          </div>

          {courseData.sections.map((section, sectionIndex) => (
            <div
              key={sectionIndex}
              className="bg-white rounded-lg p-4 mb-4 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleSectionExpand(sectionIndex)}
                    className="p-1 hover:bg-gray-100 rounded"
                  >
                    {expandedSections[sectionIndex] ? (
                      <FaChevronUp />
                    ) : (
                      <FaChevronDown />
                    )}
                  </button>
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(e, sectionIndex, 'title')
                    }
                    className="flex-1 px-3 py-2 border outline-navy-blue rounded-lg"
                    required
                    placeholder="Section title..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSection(sectionIndex)}
                  className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors ml-2"
                >
                  <FaTimes />
                </button>
              </div>

              {(expandedSections[sectionIndex] ||
                expandedSections[sectionIndex] === undefined) && (
                <div className="space-y-3">
                  {section.lectures.map((lecture, lectureIndex) => (
                    <div
                      key={lectureIndex}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                        <input
                          type="text"
                          value={lecture.title}
                          onChange={(e) =>
                            handleLectureChange(
                              e,
                              sectionIndex,
                              lectureIndex,
                              'title'
                            )
                          }
                          className="px-3 py-2 border outline-navy-blue rounded-lg"
                          required
                          placeholder="Lecture title..."
                        />
                        <input
                          type="text"
                          value={lecture.duration}
                          onChange={(e) =>
                            handleLectureChange(
                              e,
                              sectionIndex,
                              lectureIndex,
                              'duration'
                            )
                          }
                          className="px-3 py-2 border outline-navy-blue rounded-lg"
                          required
                          placeholder="Duration (e.g., 5:30)"
                        />
                        <input
                          type="text"
                          value={lecture.lecture}
                          onChange={(e) =>
                            handleLectureChange(
                              e,
                              sectionIndex,
                              lectureIndex,
                              'lecture'
                            )
                          }
                          className="px-3 py-2 border outline-navy-blue rounded-lg"
                          required
                          placeholder="Video URL or ID..."
                        />
                        <div className="flex items-center gap-2">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={lecture.isPreview}
                              onChange={(e) =>
                                handleLectureChange(
                                  e,
                                  sectionIndex,
                                  lectureIndex,
                                  'isPreview'
                                )
                              }
                              className="mr-2"
                            />
                            <span className="text-sm text-gray-700 flex items-center gap-1">
                              <FaEye /> Preview
                            </span>
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              removeLecture(sectionIndex, lectureIndex)
                            }
                            className="px-2 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                          >
                            <FaTimes />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addLecture(sectionIndex)}
                    className="px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
                  >
                    <FaPlus /> Add Lecture
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className={`flex-1 bg-gradient-to-r text-white ${
              isLoading
                ? 'cursor-not-allowed from-navy-blue/50 to-dark-purple/50'
                : 'from-navy-blue to-dark-purple'
            } px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg`}
          >
            {isLoading ? (
              <AiOutlineLoading3Quarters className="w-7 h-7 animate-spin text-white" />
            ) : (
              <>
                <FaSave />
                {isEditing ? 'Update Course' : 'Create Course'}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
          >
            <FaTimes />
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
