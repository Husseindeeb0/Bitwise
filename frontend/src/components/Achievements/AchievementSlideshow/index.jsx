import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaTrophy,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaAward,
  FaUsers,
} from 'react-icons/fa';

const AchievementSlideshow = ({ achievementsData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const intervalRef = useRef(null);
  const lastInteractionRef = useRef(Date.now());

  const AUTO_PLAY_INTERVAL = 8000; // 8 seconds

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === achievementsData.length - 1 ? 0 : prevIndex + 1
    );
  }, [achievementsData.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? achievementsData.length - 1 : prevIndex - 1
    );
  }, [achievementsData.length]);

  // Auto-play logic - runs independently
  useEffect(() => {
    if (achievementsData.length <= 1) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Start new interval
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [nextSlide, achievementsData.length, currentIndex]);

  const handleManualNav = (dir) => {
    if (dir === 'next') nextSlide();
    else prevSlide();
    lastInteractionRef.current = Date.now();
  };

  const handleDotClick = (idx) => {
    setDirection(idx > currentIndex ? 1 : -1);
    setCurrentIndex(idx);
    lastInteractionRef.current = Date.now();
  };

  if (!achievementsData || achievementsData.length === 0) return null;

  const currentAchievement = achievementsData[currentIndex];

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white overflow-hidden relative">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-64 h-64 bg-sky-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-64 h-64 bg-navy-blue/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-sky-blue/10 rounded-full mb-4">
              <FaTrophy className="text-sky-blue text-sm" />
              <span className="text-sky-blue font-bold uppercase tracking-wider text-xs">
                Our Milestones
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Community <span className="text-navy-blue">Achievements</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Celebrating the success stories and milestones of our community
            </p>
          </motion.div>
        </div>

        {/* Slideshow Container */}
        <div className="relative">
          <div className="relative h-[420px] md:h-[360px]">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <div className="h-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Image Section */}
                    <div className="md:w-2/5 h-48 md:h-full relative overflow-hidden">
                      <img
                        src={currentAchievement.image}
                        alt={currentAchievement.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-navy-blue/60 via-transparent to-transparent" />

                      {/* Date Badge */}
                      <div className="absolute top-4 left-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-navy-blue leading-none">
                            {new Date(currentAchievement.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-600 uppercase font-semibold mt-1">
                            {new Date(currentAchievement.date).toLocaleString('en-US', {
                              month: 'short',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Feature Badge */}
                      <div className="absolute top-4 right-4 bg-yellow-400 rounded-full p-2 shadow-lg">
                        <FaStar className="text-white text-sm" />
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                      <div className="mb-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-navy-blue/5 rounded-lg mb-3">
                          <FaAward className="text-navy-blue text-sm" />
                          <span className="text-navy-blue text-xs font-semibold uppercase tracking-wide">
                            Milestone Achievement
                          </span>
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                          {currentAchievement.title}
                        </h3>

                        <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                          {currentAchievement.description}
                        </p>
                      </div>

                      {/* Instructors Section */}
                      {currentAchievement.instructors &&
                        currentAchievement.instructors.length > 0 && (
                          <div>
                            <div className="flex items-center gap-2 mb-3">
                              <FaUsers className="text-sky-blue text-sm" />
                              <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                                Key Contributors
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {currentAchievement.instructors.slice(0, 4).map((inst, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200 hover:border-sky-blue/50 transition-colors"
                                >
                                  <div className="w-8 h-8 bg-gradient-to-br from-navy-blue to-sky-blue rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-sm">
                                    {inst.name?.charAt(0) || '?'}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="text-gray-900 font-semibold text-xs truncate">
                                      {inst.name}
                                    </p>
                                    <p className="text-gray-500 text-xs truncate">
                                      {inst.role}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {currentAchievement.instructors.length > 4 && (
                                <div className="flex items-center justify-center px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
                                  <span className="text-xs font-semibold text-gray-600">
                                    +{currentAchievement.instructors.length - 4} more
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <button
              onClick={() => handleManualNav('prev')}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-700 hover:bg-navy-blue hover:text-white hover:border-navy-blue transition-all shadow-sm"
              aria-label="Previous achievement"
            >
              <FaChevronLeft className="text-sm" />
            </button>

            <div className="flex items-center gap-2">
              {achievementsData.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handleDotClick(idx)}
                  className={`transition-all duration-300 rounded-full ${
                    idx === currentIndex
                      ? 'w-8 h-2 bg-navy-blue'
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to achievement ${idx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => handleManualNav('next')}
              className="w-10 h-10 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center text-gray-700 hover:bg-navy-blue hover:text-white hover:border-navy-blue transition-all shadow-sm"
              aria-label="Next achievement"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              key={`progress-${currentIndex}`}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{
                duration: AUTO_PLAY_INTERVAL / 1000,
                ease: 'linear',
              }}
              className="h-full bg-gradient-to-r from-navy-blue to-sky-blue"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AchievementSlideshow;