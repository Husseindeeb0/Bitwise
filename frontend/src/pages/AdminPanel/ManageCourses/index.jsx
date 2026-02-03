import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaEye,
  FaStar,
  FaGraduationCap,
  FaCalendar,
} from 'react-icons/fa';
import {
  deleteCourse,
  getCourses,
} from '../../../features/courses/coursesThunks';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import CourseForm from './form';

export default function ManageCourses() {
  const dispatch = useDispatch();
  const courses = useSelector((state) => state.courses.coursesData);
  const error = useSelector((state) => state.courses.error);

  const [showForm, setShowForm] = useState(false);
  const [editingCourseData, setEditingCourseData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const initialCourseState = {
    title: '',
    category: '',
    type: 'Course',
    isPopular: false,
    isBestseller: false,
    instructor: {
      name: '',
      bio: '',
      imageUrl: '',
      imageId: '',
      coursesNum: 0,
    },
    price: '',
    originalPrice: '',
    posterUrl: '',
    posterId: '',
    description: '',
    whatYouWillLearn: [''],
    skillsGained: [''],
    requirements: [''],
    hours: 0,
    lecturesNum: 0,
    difficulty: 'Beginner',
    studentsEnrolled: 0,
    lastUpdated: new Date().toISOString().split('T')[0],
    language: 'English',
    sections: [
      {
        id: 1,
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
  };

  const categories = [
    'Web Development',
    'Mobile Development',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Introduction',
  ];

  const fetchData = async () => {
    try {
      await dispatch(getCourses()).unwrap();
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    if (courses.length === 0 && !error) {
      fetchData();
    }
  }, [dispatch]);

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingCourseData(null);
    fetchData();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCourseData(null);
  };

  const handleEdit = (course) => {
    setEditingCourseData(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
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
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all duration-300 shadow-lg"
              >
                <FaPlus /> Add New Course
              </button>
            )}
          </div>
        </div>

        {showForm ? (
          <CourseForm
            isEditing={!!editingCourseData}
            initialData={editingCourseData || initialCourseState}
            onSuccess={handleFormSuccess}
            onCancel={handleCancel}
          />
        ) : (
          <>
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
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-navy-blue focus:border-transparent appearance-none bg-white min-w-48"
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
            {courses.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-sky-blue/20">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Course/Workshop
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Type
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
                            {course.type || 'NA'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.category || 'NA'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {course.price ? `$${course.price}` : 'Free'}
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
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex gap-2">
                              <Link
                                to={`/courseDetails?id=${course._id}`}
                                state={{ course }}
                                className="text-sky-blue hover:text-sky-blue/80 p-2 hover:bg-sky-blue/10 rounded-lg transition-colors"
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
              <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                <div className="flex flex-col items-center">
                  <FaCalendar size={48} className="text-gray-300 mb-4" />
                  <h3 className="text-xl font-medium text-gray-900">
                    No courses found
                  </h3>
                  <p className="text-gray-500 mt-2 max-w-sm">
                    Start by adding your first course to build your curriculum.
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowForm(true)}
                    className="mt-6 flex items-center gap-2 px-6 py-3 bg-navy-blue text-white rounded-lg hover:bg-navy-blue/90 shadow-lg"
                  >
                    <FaPlus size={18} />
                    Add New Course
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
