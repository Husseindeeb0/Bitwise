import { useState, useCallback, useEffect } from 'react';
import {
  FiPlay,
  FiLock,
  FiClock,
  FiUsers,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiGlobe,
  FiPlayCircle,
  FiX,
} from 'react-icons/fi';

import { useLocation } from 'react-router-dom';
import { getCourseById } from '../../../features/courses/coursesThunks';
import { useDispatch, useSelector } from 'react-redux';
import LectureModal from '../../../components/LectureModal';
import { getEmbedUrl } from '../../../helpers/getEmbedUrl';

const CourseDetails = () => {
  const [currentLecture, setCurrentLecture] = useState(null);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState([1]);
  const [activeTab, setActiveTab] = useState('overview');
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const location = useLocation();
  const dispatch = useDispatch();
  const searchParams = new URLSearchParams(location.search);
  const id = searchParams.get('id');
  const [stateCourse, setStateCourse] = useState(null);
  const { courseById, isLoading, error } = useSelector(
    (state) => state.courses
  );
  let courseData = stateCourse || courseById;
  const fetchCourseData = useCallback(
    async (id) => {
      try {
        await dispatch(getCourseById(id)).unwrap();
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    },
    [dispatch]
  );

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };

  const handleCloseVideo = () => {
    setIsVideoPlaying(false);
  };

  const openVideoModal = (lecture) => {
    setCurrentLecture(lecture);
    setIsVideoModalOpen(true);
  };

  const handleLectureClick = (lecture) => {
    openVideoModal(lecture);
  };

  useEffect(() => {
    const loadCourse = async () => {
      if (location.state?.course) {
        setStateCourse(location.state.course);
      } else {
        // If not in state, fetch it using the ID
        if (!courseById && !error) {
          fetchCourseData(id);
        }
      }
    };
    loadCourse();
  }, [location, fetchCourseData, dispatch]);

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  if (isLoading || (!courseData && !error)) {
    return 'Loading...';
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mx-auto mb-4">!</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Course Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The course you're looking for could not be found.
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-navy-blue text-white rounded-md hover:bg-dark-purple transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-14">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-navy-blue to-dark-purple text-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4">{courseData.title}</h1>
                <p className="text-xl text-gray-200 leading-relaxed">
                  {courseData.description}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap gap-6 text-sm">
                {/* Rating feature add later */}
                {/* <div className="flex items-center space-x-2">
                  <FiStar className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{courseData.rating}</span>
                  <span className="text-gray-300">
                    ({courseData.studentsEnrolled} students)
                  </span>
                </div> */}
                {courseData.studentsEnrolled.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <FiUsers className="h-5 w-5" />
                    <span>{courseData.studentsEnrolled} enrolled</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <FiClock className="h-5 w-5" />
                  <span>{courseData.hours}h total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiGlobe className="h-5 w-5" />
                  <span>{courseData.language}</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <img
                  src={courseData.instructor.imageUrl}
                  alt={courseData.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    {courseData.instructor.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    {courseData.instructor.bio}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Course Preview */}
            {courseData.type === 'Course' && (
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900 sticky top-6">
                  {/* Video Preview */}
                  {(() => {
                    const previewLecture = courseData.sections
                      .flatMap((section) => section.lectures)
                      .find((lecture) => lecture.isPreview);

                    if (!previewLecture) return null;

                    return (
                      <div className="relative mb-6">
                        {!isVideoPlaying ? (
                          <>
                            <img
                              src={courseData.posterUrl}
                              alt={courseData.title}
                              className="w-full h-48 object-cover rounded-xl"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                              <FiPlayCircle
                                className="h-16 w-16 text-white hover:scale-110 transition-transform cursor-pointer"
                                onClick={handlePlayVideo}
                              />
                            </div>
                            <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                              Preview
                            </div>
                          </>
                        ) : (
                          <div className="relative">
                            <iframe
                              className="w-full h-48 rounded-xl"
                              src={getEmbedUrl(previewLecture.lecture)}
                              title="Course Preview"
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                              onLoad={() => {
                                setTimeout(() => {
                                  handleCloseVideo();
                                }, 60 * 1000);
                              }}
                            />
                            <button
                              onClick={handleCloseVideo}
                              className="absolute top-2 right-2 bg-black/60 text-white p-1 rounded-full hover:bg-black/80 transition-colors"
                            >
                              <FiX className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                  {/* Pricing */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center space-x-3 mb-2">
                      {courseData.price ? (
                        <span className="text-3xl font-bold text-indigo-600">
                          ${courseData.price}
                        </span>
                      ) : (
                        <span className="text-navy-blue font-bold text-xl">
                          Free Of Charge
                        </span>
                      )}
                      {courseData.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          ${courseData.originalPrice}
                        </span>
                      )}
                    </div>
                    {courseData.originalPrice && (
                      <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                        {(
                          ((courseData.originalPrice - courseData.price) /
                            courseData.originalPrice) *
                          100
                        ).toFixed(0)}
                        % off - Limited time!
                      </div>
                    )}
                  </div>
                  {/* Enroll Button */}
                  {/* ToDO: Increment enrolledStudents on clicking and save user enrollment to his database schema */}
                  {courseData.price && (
                    <button className="w-full bg-gradient-to-r from-navy-blue to-dark-purple text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 mb-4">
                      Enroll Now
                    </button>
                  )}
                  {/* <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-navy-blue hover:text-navy-blue transition-colors duration-300 mb-6">
                  Add to Wishlist
                </button> */}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Navigation Tabs */}
            <div className="flex space-x-8 border-b border-gray-200 mb-8">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'curriculum', label: 'Curriculum' },
                { key: 'instructor', label: 'Instructor' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* What You'll Learn */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    What you'll learn
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {courseData.whatYouWillLearn.map((item, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <FiCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requirements */}
                {courseData.requirements[0] != '' &&
                  courseData.requirements.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        Requirements
                      </h2>
                      <ul className="space-y-3">
                        {courseData.requirements.map((req, index) => (
                          <li
                            key={index}
                            className="flex items-start space-x-3"
                          >
                            <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-gray-700">{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                {/* Skills Gained */}
                {courseData.skillsGained[0] != '' &&
                  courseData.skillsGained.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                      <h2 className="text-2xl font-bold mb-6 text-gray-900">
                        Skills you'll gain
                      </h2>
                      <div className="flex flex-wrap gap-3">
                        {courseData.skillsGained.map((skill, index) => (
                          <span
                            key={index}
                            className="bg-navy-blue/30 text-navy-blue px-4 py-2 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            )}

            {activeTab === 'curriculum' && (
              <div className="bg-white rounded-2xl shadow-lg p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {courseData.type === 'Course'
                      ? 'Course Content'
                      : 'Workshop'}
                  </h2>
                  <div className="text-sm text-gray-500">
                    {courseData.sections.length} sections •{' '}
                    {courseData.lecturesNum} lectures • {courseData.hours}h
                  </div>
                </div>

                <div className="space-y-4">
                  {courseData.sections.map((section) => (
                    <div
                      key={section.id}
                      className="border border-gray-200 rounded-xl"
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center space-x-3">
                          {expandedSections.includes(section.id) ? (
                            <FiChevronUp className="h-5 w-5 text-gray-500" />
                          ) : (
                            <FiChevronDown className="h-5 w-5 text-gray-500" />
                          )}
                          <h3 className="text-lg font-semibold text-left">
                            {section.title}
                          </h3>
                        </div>
                        <div className="text-sm text-gray-500">
                          {section.lectures.length} lectures
                        </div>
                      </button>

                      {expandedSections.includes(section.id) && (
                        <div className="border-t border-gray-200">
                          {section.lectures.map((lecture) => (
                            <div
                              key={lecture.id}
                              className={`flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                                lecture.isPreview
                                  ? 'hover:bg-indigo-50 cursor-pointer'
                                  : 'hover:bg-gray-50'
                              }`}
                              onClick={() => handleLectureClick(lecture)}
                            >
                              <div className="flex items-center space-x-3">
                                {lecture.price ? (
                                  lecture.isPreview ? (
                                    <FiPlay className="h-4 w-4 text-indigo-500" />
                                  ) : (
                                    <FiLock className="h-4 w-4 text-gray-400" />
                                  )
                                ) : (
                                  <FiPlay className="h-4 w-4 text-indigo-500" />
                                )}
                                <span
                                  className={`text-sm ${
                                    lecture.isPreview
                                      ? 'text-navy-blue font-medium'
                                      : 'text-gray-700'
                                  }`}
                                >
                                  {lecture.title}
                                </span>
                                {lecture.isPreview && (
                                  <span className="bg-blue-100 text-navy-blue px-2 py-1 rounded text-xs font-medium">
                                    Preview
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                  {lecture.duration}
                                </span>
                                {lecture.price && lecture.isPreview && (
                                  <button className="text-navy-blue hover:text-navy-blue text-sm font-medium transition-colors">
                                    Play
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Video Modal */}
            {isVideoModalOpen && currentLecture && (
              <LectureModal
                currentLecture={currentLecture}
                setCurrentLecture={setCurrentLecture}
                setIsVideoModalOpen={setIsVideoModalOpen}
              />
            )}

            {activeTab === 'instructor' && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={courseData.instructor.imageUrl}
                    alt={courseData.instructor.name}
                    className="w-32 h-32 rounded-full"
                  />
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {courseData.instructor.name}
                    </h2>
                    <p className="text-gray-600 mb-4">
                      {courseData.instructor.bio}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="text-center">
                        {courseData.instructor.coursesNum && (
                          <p className="font-semibold text-lg">
                            {courseData.instructor.coursesNum}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">Courses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar - Additional Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-6">
              <h3 className="text-xl font-semibold mb-4">
                {courseData.type === 'Course'
                  ? 'Course Details'
                  : 'Workshop Details'}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Skill level</span>
                  <span className="font-medium">{courseData.difficulty}</span>
                </div>
                {courseData.studentsEnrolled.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Students</span>
                    <span className="font-medium">
                      {courseData.studentsEnrolled}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Languages</span>
                  <span className="font-medium">{courseData.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last updated</span>
                  <span className="font-medium">{courseData.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
