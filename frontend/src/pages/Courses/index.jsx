import { Link } from 'react-router-dom';
import {
  AiOutlineClockCircle,
  AiOutlineBook,
  AiOutlineUser,
  AiFillStar,
  AiOutlineTrophy,
  AiOutlineRise,
} from 'react-icons/ai';
import { FaFilter, FaSearch } from 'react-icons/fa';
import { MdFilterList, MdSearchOff } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { getCourses } from '../../features/courses/coursesThunks';
import { useEffect, useState, useMemo } from 'react';

// Helper function for difficulty colors
const getDifficultyColor = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case 'beginner':
      return 'text-green-700 bg-green-100 border-green-200';
    case 'intermediate':
      return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    case 'advanced':
      return 'text-red-700 bg-red-100 border-red-200';
    default:
      return 'text-slate-700 bg-slate-100 border-slate-200';
  }
};

// Loading Skeleton Component
const CourseSkeleton = () => (
  <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200/60 animate-pulse">
    <div className="w-full h-56 bg-slate-200"></div>
    <div className="p-6">
      <div className="h-6 bg-slate-200 rounded mb-2"></div>
      <div className="h-4 bg-slate-200 rounded w-2/3 mb-4"></div>
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-slate-200 rounded w-16"></div>
        <div className="h-4 bg-slate-200 rounded w-20"></div>
      </div>
      <div className="h-6 bg-slate-200 rounded w-20 mb-4"></div>
      <div className="flex gap-4 mb-4">
        <div className="h-4 bg-slate-200 rounded w-12"></div>
        <div className="h-4 bg-slate-200 rounded w-16"></div>
      </div>
      <div className="flex gap-2 mb-6">
        <div className="h-6 bg-slate-200 rounded w-16"></div>
        <div className="h-6 bg-slate-200 rounded w-20"></div>
        <div className="h-6 bg-slate-200 rounded w-14"></div>
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-slate-200 rounded w-20"></div>
        <div className="h-10 bg-slate-200 rounded w-28"></div>
      </div>
    </div>
  </div>
);

const Courses = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterType, setFilterType] = useState('');
  const { coursesData, isLoading, error } = useSelector(
    (state) => state.courses
  );
  const courses = coursesData || [];

  // DYNAMIC CATEGORIES LOGIC
  // We use useMemo to avoid recalculating this on every render
  const categories = useMemo(() => {
    // 1. Map over courses to get all categories
    // 2. Filter out null, undefined, or empty string categories
    const allCategories = courses
      .map((course) => course.category)
      .filter((category) => category && category.trim() !== '');

    // 3. Use Set to remove duplicates and sort them alphabetically
    return [...new Set(allCategories)].sort();
  }, [courses]);

  const fetchCoursesData = async () => {
    try {
      await dispatch(getCourses()).unwrap();
    } catch (error) {
      console.error('Error fetching course:', error);
    }
  };

  useEffect(() => {
    // Always fetch courses when component mounts if not already loaded
    if (!coursesData || coursesData.length === 0) {
      fetchCoursesData();
    }
  }, [dispatch]);

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || course.category === filterCategory;
    const matchesType = !filterType || course.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  // Show error state if there's an error and no data
  if (error && (!coursesData || coursesData.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-slate-600 mb-4">{error}</p>
          <button
            onClick={fetchCoursesData}
            className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-16 px-6 mt-12">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 bg-indigo-100 text-navy-blue px-4 py-2 rounded-full text-sm font-medium mb-4">
          <AiOutlineTrophy className="w-4 h-4" />
          Premium Learning Experience
        </div>
        <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
          Master Your Skills
        </h1>
        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Unlock your potential with our expertly crafted courses. Learn from
          industry professionals and build the skills that matter in today's
          competitive landscape.
        </p>
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
          <div className="relative">
            <MdFilterList className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white min-w-48"
            >
              <option value="" selected>
                All Types
              </option>
              <option value="Course">Course</option>
              <option value="Workshop">Workshop</option>
            </select>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto">
        {/* Show skeletons while loading additional data */}
        {isLoading &&
          courses.length === 0 &&
          Array.from({ length: 3 }, (_, index) => (
            <CourseSkeleton key={`skeleton-${index}`} />
          ))}

        {/* Show actual courses */}
        {filteredCourses && filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <div
              key={course.id || course._id}
              className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200/60 hover:border-indigo-200 hover:-translate-y-2"
            >
              {/* Badges */}
              <div className="absolute top-4 left-4 z-10 flex gap-2">
                {(course.isPopular || course.isBestseller) && (
                  <span className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 uppercase">
                    {course.isPopular ? (
                      'POPULAR'
                    ) : (
                      <>
                        <AiOutlineRise className="w-3 h-3" /> BEST SELLER
                      </>
                    )}
                  </span>
                )}
                <span className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 uppercase">
                  {course.type || 'COURSE'}
                </span>
              </div>

              {/* Poster with Overlay */}
              <div className="relative overflow-hidden">
                <img
                  src={course.poster || course.posterUrl}
                  alt={course.title}
                  className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-blue/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Category Tag */}
                {course.category && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                      {course.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Title and Instructor */}
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-navy-blue transition-colors">
                    {course.title}
                  </h2>
                  <p className="text-slate-600 text-sm font-medium">
                    by {course.instructor?.name}
                  </p>
                </div>

                {/* Rating and Students */}
                {(course.rating || course.studentsEnrolled.length > 0) && (
                  <div className="flex items-center gap-4 mb-4">
                    {course.rating && (
                      <div className="flex items-center gap-1">
                        <AiFillStar className="w-4 h-4 text-yellow-400" />
                        <span className="font-semibold text-slate-700">
                          {course.rating}
                        </span>
                      </div>
                    )}
                    {course.studentsEnrolled.length > 0 && (
                      <div className="flex items-center gap-1 text-slate-500">
                        <AiOutlineUser className="w-4 h-4" />
                        <span className="text-sm">
                          {course.studentsEnrolled?.toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* Difficulty Badge */}
                {course.difficulty && (
                  <div className="mb-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                        course.difficulty
                      )}`}
                    >
                      {course.difficulty}
                    </span>
                  </div>
                )}

                {/* Course Meta */}
                <div className="flex items-center gap-4 mb-4 text-slate-600">
                  {course.hours && (
                    <div className="flex items-center gap-1">
                      <AiOutlineClockCircle className="w-4 h-4" />
                      <span className="text-sm">{course.hours}h</span>
                    </div>
                  )}
                  {course.lectures && (
                    <div className="flex items-center gap-1">
                      <AiOutlineBook className="w-4 h-4" />
                      <span className="text-sm">
                        {course.lectures} lectures
                      </span>
                    </div>
                  )}
                </div>

                {/* Skills Preview */}
                {course.skillsGained[0] !== '' && course.skillsGained && course.skillsGained.length > 0 && (
                  <div className="mb-6">
                    <div className="flex flex-wrap gap-2">
                      {course.skillsGained.slice(0, 3).map((skill, index) => (
                        <span
                          key={index}
                          className="text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-navy-blue px-2 py-1 rounded-lg transition-colors duration-200 cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                      {course.skillsGained.length > 3 && (
                        <span className="text-xs text-slate-500 px-2 py-1">
                          +{course.skillsGained.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Price and CTA */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-slate-900">
                      {course.price ? `$${course.price}` : 'Free'}
                    </span>
                    {course.originalPrice &&
                      course.originalPrice > course.price && (
                        <span className="text-sm text-slate-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                  </div>
                  <Link
                    to={`/courseDetails?id=${course._id}`}
                    state={{ course }}
                    className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                  >
                    {course.price ? 'Enroll Now' : 'Watch Now'}
                  </Link>
                </div>
              </div>

              {/* Hover Effect Border */}
              <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300 pointer-events-none" />
            </div>
          ))
        ) : (
          <div className='col-span-full'>
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <MdSearchOff
                className="w-12 h-12 text-gray-400 mb-4"
                aria-hidden="true"
              />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No courses or workshops found
              </h2>
              <p className="text-gray-600 mb-6 px-4">
                We couldn’t find anything matching your filters. Try clearing or
                adjusting them.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Courses;