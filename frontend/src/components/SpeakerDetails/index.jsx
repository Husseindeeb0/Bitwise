import { motion, AnimatePresence } from "framer-motion";
import {
  FaTimes,
  FaLinkedin,
  FaInstagram,
  FaBriefcase,
  FaQuoteLeft,
  FaClock,
} from "react-icons/fa";

const SpeakerDetails = ({
  isOpen,
  onClose,
  speaker,
  convertTo12HourFormat,
}) => {
  if (!speaker) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-dark-purple/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, type: "spring", damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-navy-blue to-navy-blue/90 rounded-2xl w-full max-w-2xl overflow-auto max-h-[90vh] shadow-xl relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-sky-blue transition-colors z-10 bg-navy-blue/70 p-2 rounded-full"
              >
                <FaTimes size={16} />
              </button>

              {/* Header */}
              <div className="relative h-16 md:h-24 bg-gradient-to-r from-sky-blue to-navy-blue">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-blue/90"></div>
              </div>

              {/* Content Area*/}
              <div className="relative px-4 md:px-6 pt-0 pb-4 md:pb-6 -mt-10 md:-mt-16">
                <div className="flex flex-col md:flex-row gap-3 md:gap-6 items-center md:items-start">
                  {/* Profile Image - Smaller on mobile */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-navy-blue shadow-lg shadow-dark-purple/30">
                      <img
                        src={speaker.imageUrl || "/api/placeholder/150/150"}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                      {speaker.name}
                    </h2>

                    <div className="h-1 w-10 bg-gradient-to-r from-sky-blue to-dark-purple rounded-full mb-1 md:mb-2 mx-auto md:mx-0"></div>

                    {/* Social Links */}
                    <div className="flex gap-2 justify-center md:justify-start mb-1 md:mb-2">
                      {speaker.linkedinLink && (
                        <a
                          href={speaker.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-sky-blue transition-colors"
                        >
                          <div className="bg-navy-blue p-1.5 rounded-full shadow-md shadow-dark-purple/20">
                            <FaLinkedin size={14} />
                          </div>
                        </a>
                      )}
                      {speaker.instaLink && (
                        <a
                          href={speaker.instaLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-sky-blue transition-colors"
                        >
                          <div className="bg-navy-blue p-1.5 rounded-full shadow-md shadow-dark-purple/20">
                            <FaInstagram size={14} />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expertise & Bio Section */}
                <div className="mt-3 md:mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
                  <div className="md:col-span-1">
                    <div className="bg-navy-blue/50 rounded-xl p-3 md:p-4 border border-sky-blue/20">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-1.5">
                          <FaBriefcase className="text-sky-blue" size={12} />
                          <span className="text-sm md:text-base">
                            Expertise
                          </span>
                        </h3>

                        {/* Time Section Inline on Mobile */}
                        {speaker.startTime && (
                          <div className="flex items-center gap-1.5 md:hidden">
                            <FaClock className="text-sky-blue" size={12} />
                            <span className="text-xs text-white/80">
                              {convertTo12HourFormat(speaker.startTime)}
                            </span>
                          </div>
                        )}
                      </div>

                      <ul className="space-y-1.5">
                        {speaker.expertise ? (
                          <div className="text-xs md:text-sm text-white/80 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-blue"></div>
                            <span>{speaker.expertise}</span>
                          </div>
                        ) : (
                          <li className="text-xs md:text-sm text-white/80">
                            Data unavailable
                          </li>
                        )}
                      </ul>
                    </div>

                    {/* Time Section - Only visible on larger screens */}
                    {speaker.startTime && (
                      <div className="hidden md:block bg-navy-blue/50 rounded-xl p-4 border border-sky-blue/20 mt-4">
                        <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                          <FaClock className="text-sky-blue" size={14} />
                          <span>Time</span>
                        </h3>
                        <p className="text-sm text-white/80">
                          {convertTo12HourFormat(speaker.startTime)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bio Column */}
                  <div className="md:col-span-2">
                    <div className="bg-navy-blue/50 rounded-xl p-3 md:p-4 border border-sky-blue/20 h-full">
                      <h3 className="text-white font-semibold mb-2 text-sm md:text-base">
                        {speaker.title}
                      </h3>
                      <div className="relative">
                        <FaQuoteLeft
                          className="text-sky-blue absolute top-0 left-0"
                          size={16}
                        />
                        <p className="text-xs md:text-sm text-white/80 leading-relaxed pl-5 md:pl-6 pt-1">
                          {speaker.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SpeakerDetails;
