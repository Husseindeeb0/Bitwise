import { useState } from "react";
import {
  FiPlay,
  FiLock,
  FiClock,
  FiUsers,
  FiStar,
  FiAward,
  FiCheckCircle,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
  FiGlobe,
  FiSmartphone,
  FiPlayCircle,
} from "react-icons/fi";

// Dummy course data (expanded)
const courseData = {
  id: 1,
  title: "React for Beginners",
  category: "State Management",
  isPopular: false,
  isBestseller: false,
  instructor: {
    name: "John Doe",
    bio: "Senior Frontend Developer with 8+ years of experience at Google and Microsoft",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    courses: 12,
  },
  price: 49.99,
  originalPrice: 89.99, // Optional Data
  poster:
    "https://images.unsplash.com/photo-1584697964403-3e44c6f7f3a7?auto=format&fit=crop&w=800&q=80",
  description:
    "Learn the fundamentals of React.js, including components, props, state, and hooks. Perfect for beginners looking to enter the world of frontend development.",
  whatYouWillLearn: [
    "Build reusable React components",
    "Manage application state with hooks",
    "Understand JSX and the virtual DOM",
    "Handle events and user input",
    "Create interactive web applications",
    "Deploy React applications to production",
  ],
  skillsGained: [
    "React basics",
    "Component-driven development",
    "State management",
    "Frontend problem-solving",
  ],
  requirements: [
    "Basic knowledge of HTML, CSS, and JavaScript",
    "No prior React experience required",
    "A computer with internet connection",
  ],
  hours: 12,
  lectures: 16,
  rating: 4.8,
  difficulty: "Advanced",
  studentsEnrolled: 2547, // Optional Data
  lastUpdated: "December 2024",
  language: "English",
  sections: [
    {
      id: 1,
      title: "Introduction to React",
      lectures: [
        {
          id: 1,
          title: "What is React?",
          duration: "05:30",
          lecture: "",
          isPreview: true,
        },
        {
          id: 2,
          title: "Setting up Development Environment",
          duration: "12:15",
          lecture: "",
          isPreview: true,
        },
        {
          id: 3,
          title: "Your First React Component",
          duration: "08:45",
          lecture: "",
          isPreview: false,
        },
        {
          id: 4,
          title: "Understanding JSX",
          duration: "15:20",
          lecture: "",
          isPreview: false,
        },
      ],
    },
    {
      id: 2,
      title: "Components and Props",
      lectures: [
        {
          id: 5,
          title: "Creating Functional Components",
          duration: "10:30",
          lecture: "",
          isPreview: false,
        },
        {
          id: 6,
          title: "Props and Data Flow",
          duration: "14:25",
          lecture: "",
          isPreview: false,
        },
        {
          id: 7,
          title: "Component Composition",
          duration: "11:40",
          lecture: "",
          isPreview: false,
        },
        {
          id: 8,
          title: "Conditional Rendering",
          duration: "09:15",
          lecture: "",
          isPreview: true,
        },
      ],
    },
    {
      id: 3,
      title: "State Management and Hooks",
      lectures: [
        {
          id: 9,
          title: "Introduction to useState",
          duration: "16:30",
          lecture: "",
          isPreview: false,
        },
        {
          id: 10,
          title: "useEffect Hook",
          duration: "20:15",
          lecture: "",
          isPreview: false,
        },
        { id: 11, title: "Custom Hooks", duration: "18:45", lecture: "", isPreview: false },
        {
          id: 12,
          title: "useContext for Global State",
          duration: "25:20",
          lecture: "",
          isPreview: false,
        },
      ],
    },
    {
      id: 4,
      title: "Advanced Concepts",
      lectures: [
        { id: 13, title: "React Router", duration: "22:30", lecture: "", isPreview: false },
        { id: 14, title: "Form Handling", duration: "17:25", lecture: "", isPreview: false },
        {
          id: 15,
          title: "API Integration",
          duration: "19:40",
          lecture: "",
          isPreview: false,
        },
        {
          id: 16,
          title: "Deployment and Production",
          duration: "13:15",
          lecture: "",
          isPreview: false,
        },
      ],
    },
  ],
};

const CourseDetails = () => {
  const [expandedSections, setExpandedSections] = useState([1]);
  const [activeTab, setActiveTab] = useState("overview");

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const totalDuration = courseData.sections.reduce((total, section) => {
    return (
      total +
      section.lectures.reduce((sectionTotal, lecture) => {
        const [minutes, seconds] = lecture.duration.split(":").map(Number);
        return sectionTotal + minutes + seconds / 60;
      }, 0)
    );
  }, 0);

  const formatTotalDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  return (
    <div className="min-h-screen mt-10">
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
                <div className="flex items-center space-x-2">
                  <FiStar className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-semibold">{courseData.rating}</span>
                  <span className="text-gray-300">
                    ({courseData.studentsEnrolled} students)
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiUsers className="h-5 w-5" />
                  <span>{courseData.studentsEnrolled} enrolled</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiClock className="h-5 w-5" />
                  <span>{formatTotalDuration(totalDuration)} total</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FiGlobe className="h-5 w-5" />
                  <span>{courseData.language}</span>
                </div>
              </div>

              {/* Instructor Info */}
              <div className="flex items-center space-x-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <img
                  src={courseData.instructor.avatar}
                  alt={courseData.instructor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold">
                    Created by {courseData.instructor.name}
                  </p>
                  <p className="text-sm text-gray-300">
                    Senior Frontend Developer
                  </p>
                </div>
              </div>
            </div>

            {/* Right Sidebar - Course Preview */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-2xl p-6 text-gray-900 sticky top-6">
                {/* Video Preview */}
                <div className="relative mb-6">
                  <img
                    src={courseData.poster}
                    alt={courseData.title}
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-xl flex items-center justify-center">
                    <FiPlayCircle className="h-16 w-16 text-white hover:scale-110 transition-transform cursor-pointer" />
                  </div>
                  <div className="absolute top-3 right-3 bg-black/60 text-white px-2 py-1 rounded text-sm">
                    Preview
                  </div>
                </div>

                {/* Pricing */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <span className="text-3xl font-bold text-indigo-600">
                      ${courseData.price}
                    </span>
                    <span className="text-lg text-gray-500 line-through">
                      ${courseData.originalPrice}
                    </span>
                  </div>
                  <div className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    44% off - Limited time!
                  </div>
                </div>

                {/* Enroll Button */}
                <button className="w-full bg-gradient-to-r from-navy-blue to-dark-purple text-white py-4 rounded-xl font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300 mb-4">
                  Enroll Now
                </button>

                <button className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors duration-300 mb-6">
                  Add to Wishlist
                </button>

                {/* Course Includes */}
                <div className="space-y-3 text-sm">
                  <h4 className="font-semibold text-gray-900">
                    This course includes:
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <FiClock className="h-4 w-4 text-gray-500" />
                      <span>
                        {formatTotalDuration(totalDuration)} on-demand video
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiDownload className="h-4 w-4 text-gray-500" />
                      <span>Downloadable resources</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiSmartphone className="h-4 w-4 text-gray-500" />
                      <span>Access on mobile and TV</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <FiAward className="h-4 w-4 text-gray-500" />
                      <span>Certificate of completion</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
                { key: "overview", label: "Overview" },
                { key: "curriculum", label: "Curriculum" },
                { key: "instructor", label: "Instructor" },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.key
                      ? "border-indigo-500 text-indigo-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
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
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Requirements
                  </h2>
                  <ul className="space-y-3">
                    {courseData.requirements.map((req, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Gained */}
                <div className="bg-white rounded-2xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">
                    Skills you'll gain
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {courseData.skillsGained.map((skill, index) => (
                      <span
                        key={index}
                        className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "curriculum" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Course Content
                  </h2>
                  <div className="text-sm text-gray-500">
                    {courseData.sections.length} sections •{" "}
                    {courseData.lectures} lectures •{" "}
                    {formatTotalDuration(totalDuration)}
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
                              className="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center space-x-3">
                                {lecture.isPreview ? (
                                  <FiPlay className="h-4 w-4 text-indigo-500" />
                                ) : (
                                  <FiLock className="h-4 w-4 text-gray-400" />
                                )}
                                <span
                                  className={`text-sm ${
                                    lecture.isPreview
                                      ? "text-indigo-600"
                                      : "text-gray-700"
                                  }`}
                                >
                                  {lecture.title}
                                </span>
                                {lecture.isPreview && (
                                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                    Preview
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4">
                                <span className="text-sm text-gray-500">
                                  {lecture.duration}
                                </span>
                                {lecture.isPreview && (
                                  <button className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">
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

            {activeTab === "instructor" && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-start space-x-6">
                  <img
                    src={courseData.instructor.avatar}
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
                        <p className="font-semibold text-lg">
                          {courseData.instructor.courses}
                        </p>
                        <p className="text-sm text-gray-500">Courses</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold text-lg">8+</p>
                        <p className="text-sm text-gray-500">
                          Years Experience
                        </p>
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
              <h3 className="text-xl font-semibold mb-4">Course Details</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Skill level</span>
                  <span className="font-medium">Beginner</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Students</span>
                  <span className="font-medium">
                    {courseData.studentsEnrolled}
                  </span>
                </div>
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
