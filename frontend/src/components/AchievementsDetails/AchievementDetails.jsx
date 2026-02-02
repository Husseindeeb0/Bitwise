import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  FaCalendar, 
  FaMapMarkerAlt, 
  FaUsers, 
  FaArrowLeft,
  FaCertificate,
  FaClock,
  FaTag,
  FaPrint,
  FaDownload,
  FaLink
} from 'react-icons/fa';
import { HiOutlineDocumentText } from 'react-icons/hi';
import { MdOutlineVerified } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { getAchievementById } from '../../features/achievements/achievementsThunks';

const AchievementDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  
  // Get achievement ID from query parameter
  const id = searchParams.get('id');
  
  // Get achievement data from Redux store
const { achievementById, isLoading, error } = useSelector((state) => state.achievements);  
  const [activeTab, setActiveTab] = useState('overview');
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [achievement, setAchievement] = useState(null);

  // Fetch achievement data when ID changes
  useEffect(() => {
    if (id) {
      dispatch(getAchievementById(id));
    }
  }, [dispatch, id]);

  // Update local achievement state when Redux data changes
useEffect(() => {
  if (achievementById && !isLoading) {
    setAchievement(achievementById);
  }
}, [achievementById, isLoading]);

  // Check if achievement was passed via state (for direct navigation)
  useEffect(() => {
    if (location.state?.achievement) {
      setAchievement(location.state.achievement);
    }
  }, [location.state]);

  // Get category color function
  const getCategoryColor = (category) => {
    if (!category) return "bg-gray-100 text-gray-800";
    
    switch (category.toLowerCase()) {
      case "technology":
        return "bg-blue-100 text-blue-800";
      case "business":
        return "bg-purple-100 text-purple-800";
      case "design":
        return "bg-orange-100 text-orange-800";
      case "science":
        return "bg-green-100 text-green-800";
      case "workshop":
        return "bg-teal-100 text-teal-800";
      case "certification":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      const hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const hour12 = hours % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (error) {
      return "";
    }
  };

  const handleShare = (method) => {
    const shareUrl = window.location.href;
    
    switch (method) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl);
        alert('Link copied to clipboard!');
        break;
      case 'print':
        window.print();
        break;
      case 'download':
        if (achievement?.certificateUrl) {
          window.open(achievement.certificateUrl, '_blank');
        } else {
          alert('Certificate download link not available');
        }
        break;
    }
    setShareMenuOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-64 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-4">
                <div className="h-48 bg-gray-200 rounded"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !achievement) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {error || "Achievement Not Found"}
            </h2>
            <p className="text-gray-600 mb-8">
              The achievement you're looking for doesn't exist or has been removed.
            </p>
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center px-4 py-2 bg-navy-blue text-white rounded-lg hover:bg-dark-purple transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-navy-blue hover:text-dark-purple mb-6 group"
          >
            <FaArrowLeft className="mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Achievements
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {achievement.category && (
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getCategoryColor(achievement.category)}`}>
                    {achievement.category.charAt(0).toUpperCase() + achievement.category.slice(1)}
                  </span>
                )}
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  achievement.completed 
                    ? "bg-green-100 text-green-800" 
                    : "bg-yellow-100 text-yellow-800"
                }`}>
                  <MdOutlineVerified className="mr-1.5" />
                  {achievement.completed ? "Verified Achievement" : "In Progress"}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{achievement.title}</h1>
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShareMenuOpen(!shareMenuOpen)}
                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <BsThreeDotsVertical className="text-gray-600" />
              </button>
              
              {shareMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <button
                    onClick={() => handleShare('copy')}
                    className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                  >
                    <FaLink className="mr-3 text-gray-500" />
                    Copy Link
                  </button>
                  <button
                    onClick={() => handleShare('print')}
                    className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100"
                  >
                    <FaPrint className="mr-3 text-gray-500" />
                    Print Details
                  </button>
                  {achievement.certificateUrl && (
                    <button
                      onClick={() => handleShare('download')}
                      className="flex items-center w-full px-4 py-3 text-left hover:bg-gray-50"
                    >
                      <FaDownload className="mr-3 text-gray-500" />
                      Download Certificate
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Same as before */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Achievement Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <img
                src={achievement.imageUrl}
                alt={achievement.title}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80";
                }}
              />
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'overview'
                        ? 'border-navy-blue text-navy-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Overview
                  </button>
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                      activeTab === 'details'
                        ? 'border-navy-blue text-navy-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Details
                  </button>
                  {achievement.attachments && achievement.attachments.length > 0 && (
                    <button
                      onClick={() => setActiveTab('attachments')}
                      className={`py-4 px-6 font-medium text-sm border-b-2 transition-colors ${
                        activeTab === 'attachments'
                          ? 'border-navy-blue text-navy-blue'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      Attachments ({achievement.attachments.length})
                    </button>
                  )}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Overview</h3>
                    <p className="text-gray-700 leading-relaxed mb-6">{achievement.description}</p>
                    
                    {(achievement.skills || achievement.prerequisites) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {achievement.skills && achievement.skills.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Skills Acquired</h4>
                            <div className="flex flex-wrap gap-2">
                              {achievement.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {achievement.prerequisites && achievement.prerequisites.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-3">Prerequisites</h4>
                            <ul className="space-y-2">
                              {achievement.prerequisites.map((req, index) => (
                                <li key={index} className="flex items-center text-gray-700">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3"></div>
                                  {req}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'details' && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Detailed Information</h3>
                    <div className="prose max-w-none text-gray-700">
                      {achievement.detailedDescription ? (
                        <div dangerouslySetInnerHTML={{ __html: achievement.detailedDescription }} />
                      ) : (
                        <p>{achievement.description}</p>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'attachments' && achievement.attachments && (
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Attachments</h3>
                    <div className="space-y-4">
                      {achievement.attachments.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="p-3 bg-white rounded-lg border border-gray-200 mr-4">
                              <HiOutlineDocumentText className="text-gray-600 text-xl" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{file.name}</h4>
                              <p className="text-sm text-gray-500">
                                {file.type?.toUpperCase()} • {file.size} • {formatDate(file.date)}
                              </p>
                            </div>
                          </div>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 text-sm font-medium text-navy-blue hover:text-dark-purple"
                          >
                            Download
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Achievement Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Details</h3>
              
              <div className="space-y-4">
                {achievement.certificateId && (
                  <div className="flex items-start">
                    <FaCertificate className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Certificate ID</p>
                      <p className="font-medium text-gray-900">{achievement.certificateId}</p>
                    </div>
                  </div>
                )}
                
                <div className="flex items-start">
                  <FaCalendar className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">
                      {achievement.completed ? 'Completed' : 'Started'}
                    </p>
                    <p className="font-medium text-gray-900">
                      {formatDate(achievement.time || achievement.completionDate || achievement.createdAt)}
                      {achievement.time && ` at ${formatTime(achievement.time)}`}
                    </p>
                  </div>
                </div>
                
                {(achievement.duration || achievement.totalHours) && (
                  <div className="flex items-start">
                    <FaClock className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Duration</p>
                      <p className="font-medium text-gray-900">
                        {achievement.duration}
                        {achievement.totalHours && ` (${achievement.totalHours} hours)`}
                      </p>
                    </div>
                  </div>
                )}
                
                {achievement.difficulty && (
                  <div className="flex items-start">
                    <FaTag className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Level</p>
                      <p className="font-medium text-gray-900">{achievement.difficulty}</p>
                    </div>
                  </div>
                )}
                
                {achievement.location && (
                  <div className="flex items-start">
                    <FaMapMarkerAlt className="text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{achievement.location}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {achievement.verificationUrl && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <a
                    href={achievement.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <MdOutlineVerified className="mr-2" />
                    Verify Achievement
                  </a>
                </div>
              )}
            </div>

            {/* Instructors Card */}
            {achievement.instructors && achievement.instructors.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructors</h3>
                
                <div className="space-y-4">
                  {achievement.instructors.map((instructor, idx) => (
                    <div key={instructor._id || idx} className="flex items-center">
                      <div className="relative">
                        {instructor.avatarUrl ? (
                          <img
                            src={instructor.avatarUrl}
                            alt={instructor.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallback = e.target.nextSibling;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div className={`w-12 h-12 rounded-full bg-navy-blue flex items-center justify-center text-white font-bold text-lg ${instructor.avatarUrl ? 'hidden' : 'flex'}`}>
                          {instructor.name?.charAt(0) || '?'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <p className="font-medium text-gray-900">{instructor.name}</p>
                        {instructor.role && (
                          <p className="text-sm text-gray-600">{instructor.role}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Steps Card */}
            {achievement.nextSteps && achievement.nextSteps.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Next Steps</h3>
                
                <div className="space-y-3">
                  {achievement.nextSteps.map((step, index) => (
                    <a
                      key={index}
                      href={step.url || '#'}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-8 h-8 bg-navy-blue text-white rounded-lg flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div className="ml-3">
                          <p className="font-medium text-gray-900 group-hover:text-navy-blue">
                            {step.title}
                          </p>
                          {step.date && (
                            <p className="text-xs text-gray-500 mt-1">
                              {step.date.includes('2024') ? 'Starts ' : ''}{formatDate(step.date)}
                            </p>
                          )}
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AchievementDetails;