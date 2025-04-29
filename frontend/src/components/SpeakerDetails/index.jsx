import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaLinkedin, FaInstagram, FaBriefcase, FaGraduationCap, FaQuoteLeft, FaClock } from "react-icons/fa";

const SpeakerDetails = ({ isOpen, onClose, speaker, convertTo12HourFormat }) => {
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
              className="bg-gradient-to-br from-navy-blue to-navy-blue/90 rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl relative"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-sky-blue transition-colors z-10 bg-navy-blue/70 p-2 rounded-full"
              >
                <FaTimes size={18} />
              </button>

              {/* Header with gradient overlay */}
              <div className="relative h-24 md:h-32 bg-gradient-to-r from-sky-blue to-navy-blue">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-navy-blue/90"></div>
              </div>

              {/* Content Area */}
              <div className="relative px-6 pt-0 pb-6 -mt-16">
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-navy-blue shadow-lg shadow-dark-purple/30">
                      <img
                        src={speaker.image || "/api/placeholder/150/150"}
                        alt={speaker.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
                      {speaker.name}
                    </h2>
                    
                    <div className="h-1 w-12 bg-gradient-to-r from-sky-blue to-dark-purple rounded-full mb-2 md:mb-3 mx-auto md:mx-0"></div>
                    
                    {/* Social Links */}
                    <div className="flex gap-3 justify-center md:justify-start mb-2">
                      {speaker.linkedin && (
                        <a
                          href={speaker.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-sky-blue transition-colors"
                        >
                          <div className="bg-navy-blue p-2 rounded-full shadow-md shadow-dark-purple/20">
                            <FaLinkedin size={16} />
                          </div>
                        </a>
                      )}
                      {speaker.instagram && (
                        <a
                          href={speaker.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white hover:text-sky-blue transition-colors"
                        >
                          <div className="bg-navy-blue p-2 rounded-full shadow-md shadow-dark-purple/20">
                            <FaInstagram size={16} />
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expertise & Bio Section */}
                <div className="mt-6 grid md:grid-cols-3 gap-6">
                  {/* Expertise Column */}
                  <div className="md:col-span-1">
                    <div className="bg-navy-blue/50 rounded-xl p-4 border border-sky-blue/20">
                      <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                        <FaBriefcase className="text-sky-blue" size={14} />
                        <span>Expertise</span>
                      </h3>
                      <ul className="space-y-2">
                        {speaker.expertise ? (
                          <div className="text-sm text-white/80 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-sky-blue"></div>
                            <span>{speaker.expertise}</span>
                          </div>
                        ) : (
                          <li className="text-sm text-white/80">Data unavailable</li>
                        )}
                      </ul>
                    </div>

                    {/* Education Section */}
                    {speaker.education && (
                      <div className="bg-navy-blue/50 rounded-xl p-4 border border-sky-blue/20 mt-4">
                        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
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
                    <div className="bg-navy-blue/50 rounded-xl p-4 border border-sky-blue/20 h-full">
                      <h3 className="text-white font-semibold mb-3">{speaker.title}</h3>
                      <div className="relative">
                        <FaQuoteLeft className="text-sky-blue absolute top-0 left-0" size={20} />
                        <p className="text-white/80 leading-relaxed pl-6 pt-1">
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