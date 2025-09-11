import { Link } from "react-router-dom";
import {
  AiOutlineClockCircle,
  AiOutlineBook,
  AiOutlineUser,
  AiFillStar,
  AiOutlineTrophy,
  AiOutlineRise,
} from "react-icons/ai";

// Enhanced dummy data with additional properties
const courses = [
  {
    id: 1,
    title: "React for Beginners",
    instructor: "John Doe",
    price: 49.99,
    originalPrice: 79.99,
    poster:
      "https://images.unsplash.com/photo-1584697964403-3e44c6f7f3a7?auto=format&fit=crop&w=800&q=80",
    description:
      "Learn the fundamentals of React.js, including components, props, state, and hooks. Perfect for beginners looking to enter the world of frontend development.",
    whatYouWillLearn: [
      "Build reusable React components",
      "Manage application state with hooks",
      "Understand JSX and the virtual DOM",
      "Handle events and user input",
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
    ],
    hours: 12,
    lectures: 45,
    difficulty: "Beginner",
    rating: 4.8,
    studentsEnrolled: 12450,
    category: "Frontend",
    isPopular: true,
    isBestseller: false,
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS",
    instructor: "Jane Smith",
    price: 39.99,
    originalPrice: 59.99,
    poster:
      "https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=800&q=80",
    description:
      "Learn how to rapidly build modern, responsive UIs using Tailwind CSS. Master utility-first design and build production-ready layouts with ease.",
    whatYouWillLearn: [
      "Utility-first CSS methodology",
      "Responsive design with Tailwind",
      "Customizing Tailwind themes",
      "Building complex UI components",
    ],
    skillsGained: [
      "Modern CSS techniques",
      "Responsive web design",
      "Rapid prototyping",
      "Clean UI implementation",
    ],
    requirements: [
      "Basic knowledge of HTML and CSS",
      "Familiarity with a frontend framework (React recommended)",
    ],
    hours: 8,
    lectures: 30,
    difficulty: "Intermediate",
    rating: 4.9,
    studentsEnrolled: 8720,
    category: "CSS",
    isPopular: false,
    isBestseller: true,
  },
  {
    id: 3,
    title: "Advanced Redux Toolkit",
    instructor: "Michael Lee",
    price: 59.99,
    originalPrice: 89.99,
    poster:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    description:
      "Take your state management skills to the next level with Redux Toolkit. Learn advanced patterns, async logic handling, and scalable architecture techniques.",
    whatYouWillLearn: [
      "Configure and optimize Redux Toolkit",
      "Handle async actions with createAsyncThunk",
      "Structure scalable Redux stores",
      "Integrate Redux with React applications",
    ],
    skillsGained: [
      "Advanced state management",
      "Asynchronous data handling",
      "Clean architecture patterns",
      "Debugging and performance optimization",
    ],
    requirements: [
      "Good understanding of React fundamentals",
      "Basic knowledge of Redux",
    ],
    hours: 15,
    lectures: 60,
    difficulty: "Advanced",
    rating: 4.7,
    studentsEnrolled: 5690,
    category: "State Management",
    isPopular: false,
    isBestseller: false,
  },
];

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "Beginner":
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case "Intermediate":
      return "bg-amber-100 text-amber-700 border-amber-200";
    case "Advanced":
      return "bg-rose-100 text-rose-700 border-rose-200";
    default:
      return "bg-gray-100 text-gray-700 border-gray-200";
  }
};

const Courses = () => {
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

      {/* Courses Grid */}
      <div className="grid gap-8 lg:grid-cols-3 md:grid-cols-2 max-w-7xl mx-auto">
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200/60 hover:border-indigo-200 hover:-translate-y-2"
          >
            {/* Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
              {(course.isPopular || course.isBestseller) && (
                <span className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
                  {course.isPopular ? (
                    "POPULAR"
                  ) : (
                    <>
                      <AiOutlineRise className="w-3 h-3" /> BEST SELLER
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Poster with Overlay */}
            <div className="relative overflow-hidden">
              <img
                src={course.poster}
                alt={course.title}
                className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sky-blue/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Tag */}
              <div className="absolute top-4 right-4">
                <span className="bg-white/90 backdrop-blur-sm text-slate-700 px-3 py-1 rounded-full text-xs font-medium">
                  {course.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Title and Instructor */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-navy-blue transition-colors">
                  {course.title}
                </h2>
                <p className="text-slate-600 text-sm font-medium">
                  by {course.instructor}
                </p>
              </div>

              {/* Rating and Students */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <AiFillStar className="w-4 h-4 text-yellow-400" />
                  <span className="font-semibold text-slate-700">
                    {course.rating}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500">
                  <AiOutlineUser className="w-4 h-4" />
                  <span className="text-sm">
                    {course.studentsEnrolled.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Difficulty Badge */}
              <div className="mb-4">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                    course.difficulty
                  )}`}
                >
                  {course.difficulty}
                </span>
              </div>

              {/* Course Meta */}
              <div className="flex items-center gap-4 mb-4 text-slate-600">
                <div className="flex items-center gap-1">
                  <AiOutlineClockCircle className="w-4 h-4" />
                  <span className="text-sm">{course.hours}h</span>
                </div>
                <div className="flex items-center gap-1">
                  <AiOutlineBook className="w-4 h-4" />
                  <span className="text-sm">{course.lectures} lectures</span>
                </div>
              </div>

              {/* Skills Preview */}
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

              {/* Price and CTA */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-slate-900">
                    ${course.price}
                  </span>
                  {course.originalPrice > course.price && (
                    <span className="text-sm text-slate-500 line-through">
                      ${course.originalPrice}
                    </span>
                  )}
                </div>
                <Link
                  to="/courseDetails"
                  className="bg-gradient-to-r from-navy-blue to-dark-purple text-white px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                >
                  Enroll Now
                </Link>
              </div>
            </div>

            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
