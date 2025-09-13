import { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSave,
  FaTimes,
  FaBook,
  FaUser,
  FaClock,
  FaDollarSign,
  FaGraduationCap,
  FaListUl,
  FaPlay,
  FaEye,
  FaStar,
  FaChevronDown,
  FaChevronUp,
  FaCalendar,
} from "react-icons/fa";
import {
  addCourse,
  editCourse,
  deleteCourse,
  getCourses,
} from "../../../features/courses/coursesThunks";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

export default function ManageCourses() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.coursesData);
  const error = useSelector((state) => state.courses.error);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [expandedSections, setExpandedSections] = useState({});

  const [courseData, setCourseData] = useState({
    title: "",
    category: "",
    isPopular: false,
    isBestseller: false,
    instructor: {
      name: "",
      bio: "",
      imageUrl: "",
      imageId: "",
      coursesNum: 0,
    },
    price: "",
    originalPrice: "",
    posterUrl: "",
    posterId: "",
    description: "",
    whatYouWillLearn: [""],
    skillsGained: [""],
    requirements: [""],
    hours: 0,
    lecturesNum: 0,
    difficulty: "Beginner",
    studentsEnrolled: 0,
    lastUpdated: new Date().toISOString().split("T")[0],
    language: "English",
    sections: [
      {
        id: 1,
        title: "",
        lectures: [
          {
            id: 1,
            title: "",
            duration: "",
            lecture: "",
            isPreview: false,
          },
        ],
      },
    ],
  });

  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const languages = ["English", "Arabic"];
  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Machine Learning",
    "DevOps",
    "Introduction",
  ];

  const fetchData = async () => {
    try {
      await dispatch(getCourses()).unwrap();
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  useEffect(() => {
    if (courses.length === 0 && !error) {
      fetchData();
    }
  }, [dispatch]);

  const handleInputChange = (e, nested = null) => {
    const { name, value, type, checked, files } = e.target;

    // Handle file inputs
    if (type === "file" && files && files[0]) {
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

    // Handle checkbox inputs
    const inputValue = type === "checkbox" ? checked : value;

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
      [field]: [...prev[field], ""],
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
    const inputValue = type === "checkbox" ? checked : value;

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
          title: "",
          lectures: [
            {
              id: 1,
              title: "",
              duration: "",
              lecture: "",
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
                  title: "",
                  duration: "",
                  lecture: "",
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

  const resetForm = () => {
    setCourseData({
      title: "",
      category: "",
      isPopular: false,
      isBestseller: false,
      instructor: {
        name: "",
        bio: "",
        imageUrl: "",
        coursesNum: 0,
      },
      price: "",
      originalPrice: "",
      posterUrl: "",
      description: "",
      whatYouWillLearn: [""],
      skillsGained: [""],
      requirements: [""],
      hours: "",
      lecturesNum: "",
      difficulty: "Beginner",
      studentsEnrolled: 0,
      lastUpdated: new Date().toISOString().split("T")[0],
      language: "English",
      sections: [
        {
          id: 1,
          title: "",
          lectures: [
            {
              id: 1,
              title: "",
              duration: "",
              lecture: "",
              isPreview: false,
            },
          ],
        },
      ],
    });
    setShowForm(false);
    setEditingCourse(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingCourse) {
      await dispatch(editCourse(courseData)).unwrap();
    } else {
      await dispatch(addCourse(courseData)).unwrap();
    }
    resetForm();
    fetchData();
    console.log("Course data:", courseData);
  };

  const handleEdit = (course) => {
    setEditingCourse(course._id);
    setCourseData({ ...course });
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      await dispatch(deleteCourse(courseId)).unwrap();
      fetchData();
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen mt-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <FaGraduationCap className="text-navy-blue" />
                Course Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage all your courses from one place
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg"
            >
              <FaPlus /> Add New Course
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border outline-navy-blue rounded-lg"
              />
            </div>
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Course List */}
        {!showForm && courses.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-sky-blue/20">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Students
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredCourses.map((course) => (
                    <tr key={course._id} className="hover:bg-sky-blue/30">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {course.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {course.instructor.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.category || "NA"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.price ? `$${course.price}` : "Free"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {course.studentsEnrolled}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          {course.isPopular && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              <FaStar className="mr-1" /> Popular
                            </span>
                          )}
                          {course.isBestseller && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Bestseller
                            </span>
                          )}
                          {!course.isBestseller && !course.isPopular && (
                            <span className="text-sm">NA</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <Link
                            to={`/courseDetails?id=${course._id}`}
                            state={{ course }}
                            className="text-sky-blue hover:text-sky-blue/80 p-2 hover:bg-sky-blue/10 rounded-lg transition-colors"
                            title="View Course Details"
                          >
                            <FaEye />
                          </Link>
                          <button
                            onClick={() => handleEdit(course)}
                            className="text-navy-blue hover:text-navy-blue/80 p-2 hover:bg-blue-100 rounded-lg transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="text-red-600 hover:text-red-900 p-2 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-5 text-center">
            <div className="flex flex-col items-center">
              <FaCalendar size={40} className="text-gray-400 mb-2" />
              <h3 className="text-lg font-medium text-gray-900">
                No courses found
              </h3>
              <p className="text-gray-500 mt-1">
                Start by adding your first course!
              </p>
              <button
                type="button"
                onClick={() => setShowForm(true)}
                className="mt-4 flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue/80"
              >
                <FaPlus size={18} />
                Add New Course
              </button>
            </div>
          </div>
        )}

        {/* Course Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {editingCourse ? "Edit Course" : "Add New Course"}
                </h2>
                <button
                  onClick={resetForm}
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category(Optional)
                    </label>
                    <input
                      value={courseData.category || ""}
                      placeholder="Field name(e.g., web development, data science...)"
                      name="category"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                    />
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
                      onChange={(e) => handleInputChange(e, "instructor")}
                      className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Courses Number(Optional)
                    </label>
                    <input
                      type="number"
                      value={courseData.instructor.coursesNum}
                      name="coursesNum"
                      onChange={(e) => handleInputChange(e, "instructor")}
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
                      onChange={(e) => handleInputChange(e, "instructor")}
                      rows={3}
                      className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                      required
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Upload Instructor Image
                    </label>
                    <input
                      type="file"
                      name="imageUrl"
                      onChange={(e) => handleInputChange(e, "instructor")}
                      className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                      accept="image/*"
                      required
                    />
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
                      Price(Optional)
                    </label>
                    <input
                      type="number"
                      value={courseData.price || ""}
                      placeholder="Enter Current Price"
                      name="price"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Original Price(Optional)
                    </label>
                    <input
                      type="number"
                      value={courseData.originalPrice || ""}
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
                    <input
                      type="file"
                      name="posterUrl"
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border outline-navy-blue rounded-lg"
                      accept="image/*"
                      required
                    />
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

                {/* What You Will Learn */}
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
                          handleArrayChange(e, "whatYouWillLearn", index)
                        }
                        className="flex-1 px-4 py-2 border outline-navy-blue rounded-lg"
                        required
                        placeholder="Enter learning outcome..."
                      />
                      <button
                        type="button"
                        onClick={() =>
                          removeArrayItem("whatYouWillLearn", index)
                        }
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("whatYouWillLearn")}
                    className="mt-2 px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
                  >
                    <FaPlus /> Add Learning Outcome
                  </button>
                </div>

                {/* Skills Gained */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Skills Gained
                  </label>
                  {courseData.skillsGained.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(e, "skillsGained", index)
                        }
                        className="flex-1 px-4 py-2 border outline-navy-blue rounded-lg"
                        required
                        placeholder="Enter skill..."
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("skillsGained", index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("skillsGained")}
                    className="mt-2 px-4 py-2 bg-navy-blue/20 text-navy-blue rounded-lg hover:bg-navy-blue/30 transition-colors flex items-center gap-2"
                  >
                    <FaPlus /> Add Skill
                  </button>
                </div>

                {/* Requirements */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Requirements
                  </label>
                  {courseData.requirements.map((item, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={item}
                        onChange={(e) =>
                          handleArrayChange(e, "requirements", index)
                        }
                        className="flex-1 px-4 py-2 border outline-navy-blue rounded-lg"
                        placeholder="Enter requirement..."
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("requirements", index)}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addArrayItem("requirements")}
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
                            handleSectionChange(e, sectionIndex, "title")
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
                                    "title"
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
                                    "duration"
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
                                    "lecture"
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
                                        "isPreview"
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
                  className="flex-1 bg-gradient-to-r from-navy-blue to-dark-purple text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg"
                >
                  <FaSave />
                  {editingCourse ? "Update Course" : "Create Course"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 sm:flex-none bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
                >
                  <FaTimes />
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
