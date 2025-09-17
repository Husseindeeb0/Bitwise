import { getEmbedUrl } from "../../helpers/getEmbedUrl";
import { FiX } from "react-icons/fi";

const LectureModal = ({
  currentLecture,
  setCurrentLecture,
  setIsVideoModalOpen,
}) => {
  const closeVideoModal = () => {
    setIsVideoModalOpen(false);
    setCurrentLecture(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background1/30 backdrop-blur-lg bg-opacity-75">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {currentLecture.title}
            </h3>
            <p className="text-sm text-gray-500">
              Duration: {currentLecture.duration}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={closeVideoModal}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="relative bg-black h-96">
          <iframe
            className="w-full h-full rounded-xl"
            src={getEmbedUrl(currentLecture.lecture)}
            title="Course Preview"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Video Info */}
        <div className="p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">
                Now playing:{" "}
                <span className="font-medium">{currentLecture.title}</span>
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={closeVideoModal}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LectureModal;
