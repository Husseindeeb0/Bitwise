import React, { useRef, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaChevronLeft,
  FaChevronRight,
  FaChevronDown,
  FaTrophy,
  FaCalendarAlt,
  FaStar,
  FaAward,
  FaUsers,
} from 'react-icons/fa';

const AchievementCalendar = ({ achievementsData }) => {
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [currentAchievementIndex, setCurrentAchievementIndex] = useState(0);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  const yearDropdownRef = useRef(null);
  const monthDropdownRef = useRef(null);

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Parse achievements and organize by year/month/day
  const organizedData = useMemo(() => {
    const data = {
      years: {},
      latestAchievement: null,
      latestDate: null,
    };

    if (!achievementsData || achievementsData.length === 0) return data;

    achievementsData.forEach((achievement) => {
      const [year, month, day] = achievement.date.split('-').map(Number);

      if (!data.years[year]) {
        data.years[year] = {};
      }
      if (!data.years[year][month]) {
        data.years[year][month] = {};
      }
      if (!data.years[year][month][day]) {
        data.years[year][month][day] = [];
      }
      data.years[year][month][day].push(achievement);

      // Track latest achievement
      const currentDate = new Date(year, month - 1, day);
      if (!data.latestDate || currentDate > data.latestDate) {
        data.latestDate = currentDate;
        data.latestAchievement = { year, month, day, achievement };
      }
    });

    return data;
  }, [achievementsData]);

  // Get available years (sorted descending - newest first)
  const availableYears = useMemo(() => {
    return Object.keys(organizedData.years)
      .map(Number)
      .sort((a, b) => b - a);
  }, [organizedData]);

  // Get available months for selected year
  const availableMonths = useMemo(() => {
    if (!selectedYear || !organizedData.years[selectedYear]) return [];
    return Object.keys(organizedData.years[selectedYear])
      .map(Number)
      .sort((a, b) => b - a);
  }, [selectedYear, organizedData]);

  // Get available days for selected year/month
  const availableDays = useMemo(() => {
    if (
      !selectedYear ||
      !selectedMonth ||
      !organizedData.years[selectedYear] ||
      !organizedData.years[selectedYear][selectedMonth]
    )
      return [];
    return Object.keys(organizedData.years[selectedYear][selectedMonth])
      .map(Number)
      .sort((a, b) => a - b);
  }, [selectedYear, selectedMonth, organizedData]);

  // Get achievements for selected date
  const selectedAchievements = useMemo(() => {
    if (
      !selectedYear ||
      !selectedMonth ||
      !selectedDay ||
      !organizedData.years[selectedYear] ||
      !organizedData.years[selectedYear][selectedMonth] ||
      !organizedData.years[selectedYear][selectedMonth][selectedDay]
    )
      return [];
    return organizedData.years[selectedYear][selectedMonth][selectedDay];
  }, [selectedYear, selectedMonth, selectedDay, organizedData]);

  const currentAchievement = selectedAchievements[currentAchievementIndex];

  // Initialize with latest achievement
  useEffect(() => {
    if (organizedData.latestAchievement && !selectedYear) {
      const { year, month, day } = organizedData.latestAchievement;
      setSelectedYear(year);
      setSelectedMonth(month);
      setSelectedDay(day);
      setCurrentAchievementIndex(0);
    }
  }, [organizedData, selectedYear]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        yearDropdownRef.current &&
        !yearDropdownRef.current.contains(event.target)
      ) {
        setIsYearDropdownOpen(false);
      }
      if (
        monthDropdownRef.current &&
        !monthDropdownRef.current.contains(event.target)
      ) {
        setIsMonthDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset selections when year changes
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedMonth(null);
    setSelectedDay(null);
    setCurrentAchievementIndex(0);
    setIsYearDropdownOpen(false);
  };

  // Reset day selection when month changes
  const handleMonthSelect = (month) => {
    setSelectedMonth(month);
    setSelectedDay(null);
    setCurrentAchievementIndex(0);
    setIsMonthDropdownOpen(false);
  };

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setCurrentAchievementIndex(0);
  };

  const navigateAchievement = (direction) => {
    if (direction === 'prev' && currentAchievementIndex > 0) {
      setCurrentAchievementIndex(currentAchievementIndex - 1);
    } else if (
      direction === 'next' &&
      currentAchievementIndex < selectedAchievements.length - 1
    ) {
      setCurrentAchievementIndex(currentAchievementIndex + 1);
    }
  };

  // Get achievement count for a specific month
  const getMonthAchievementCount = (month) => {
    if (!organizedData.years[selectedYear]?.[month]) return 0;
    return Object.values(organizedData.years[selectedYear][month]).reduce(
      (sum, achievements) => sum + achievements.length,
      0
    );
  };

  // Get achievement count for a specific day
  const getDayAchievementCount = (day) => {
    return (
      organizedData.years[selectedYear]?.[selectedMonth]?.[day]?.length || 0
    );
  };

  if (!achievementsData || achievementsData.length === 0) {
    return (
      <div className="min-h-[400px] bg-background1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center p-8"
        >
          <FaTrophy className="text-6xl text-navy-blue/50 mx-auto mb-4" />
          <p className="text-xl text-dark-purple">No achievements yet</p>
          <p className="text-navy-blue/70 mt-2">
            Check back later for updates!
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background1 py-16 px-4 sm:px-6 lg:px-8 overflow-hidden relative">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center gap-3 mb-4">
          <FaTrophy className="text-3xl text-sky-blue" />
          <h1 className="text-4xl md:text-5xl font-bold text-dark-purple">
            Achievement Gallery
          </h1>
          <FaTrophy className="text-3xl text-sky-blue" />
        </div>
        <p className="text-navy-blue/70 text-lg">
          Celebrating our community's greatest moments
        </p>
      </motion.div>

      {/* Filters Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-4xl mx-auto mb-10 relative z-10"
      >
        <div className="bg-white rounded-2xl p-6 border border-sky-blue/30 shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-6">
            {/* Year Dropdown */}
            <div className="relative" ref={yearDropdownRef}>
              <label className="block text-xs text-navy-blue mb-2 font-medium uppercase tracking-wider">
                Year
              </label>
              <button
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="flex items-center gap-3 px-6 py-3 bg-navy-blue rounded-xl text-white font-semibold min-w-[140px] justify-between hover:bg-navy-blue/90 transition-colors duration-200"
              >
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-sky-blue" />
                  <span>{selectedYear || 'Select'}</span>
                </div>
                <FaChevronDown
                  className={`text-sky-blue transition-transform duration-200 ${
                    isYearDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isYearDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-navy-blue/20 shadow-xl overflow-hidden"
                  >
                    {availableYears.map((year) => (
                      <button
                        key={year}
                        onClick={() => handleYearSelect(year)}
                        className={`w-full px-4 py-3 text-left hover:bg-background1 transition-colors duration-150 flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                          selectedYear === year
                            ? 'bg-sky-blue/20 text-navy-blue font-semibold'
                            : 'text-dark-purple'
                        }`}
                      >
                        <span>{year}</span>
                        <span className="text-xs bg-navy-blue/10 text-navy-blue px-2 py-1 rounded-full">
                          {Object.keys(organizedData.years[year]).length} months
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Month Dropdown */}
            <div className="relative" ref={monthDropdownRef}>
              <label className="block text-xs text-navy-blue mb-2 font-medium uppercase tracking-wider">
                Month
              </label>
              <button
                onClick={() =>
                  selectedYear && setIsMonthDropdownOpen(!isMonthDropdownOpen)
                }
                disabled={!selectedYear}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-semibold min-w-[180px] justify-between transition-colors duration-200 ${
                  selectedYear
                    ? 'bg-sky-blue text-dark-purple hover:bg-sky-blue/90 cursor-pointer'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FaStar
                    className={
                      selectedYear ? 'text-navy-blue' : 'text-gray-400'
                    }
                  />
                  <span>
                    {selectedMonth ? monthNames[selectedMonth - 1] : 'Select'}
                  </span>
                </div>
                <FaChevronDown
                  className={`transition-transform duration-200 ${
                    selectedYear ? 'text-navy-blue' : 'text-gray-400'
                  } ${isMonthDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {isMonthDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-sky-blue/30 shadow-xl overflow-hidden max-h-64 overflow-y-auto"
                  >
                    {availableMonths.map((month) => (
                      <button
                        key={month}
                        onClick={() => handleMonthSelect(month)}
                        className={`w-full px-4 py-3 text-left hover:bg-background1 transition-colors duration-150 flex items-center justify-between border-b border-gray-100 last:border-b-0 ${
                          selectedMonth === month
                            ? 'bg-sky-blue/20 text-navy-blue font-semibold'
                            : 'text-dark-purple'
                        }`}
                      >
                        <span>{monthNames[month - 1]}</span>
                        <span className="text-xs bg-sky-blue/20 text-navy-blue px-2 py-1 rounded-full">
                          {getMonthAchievementCount(month)} achievements
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Days Selection */}
          <AnimatePresence>
            {selectedMonth && availableDays.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8"
              >
                <label className="block text-xs text-navy-blue mb-4 font-medium uppercase tracking-wider text-center">
                  Select Day
                </label>
                <div className="flex flex-wrap justify-center gap-3">
                  {availableDays.map((day, index) => {
                    const count = getDayAchievementCount(day);
                    const isSelected = selectedDay === day;

                    return (
                      <motion.button
                        key={day}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.03 }}
                        whileHover={{ scale: 1.08 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDaySelect(day)}
                        className={`relative w-14 h-14 rounded-xl font-bold text-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-navy-blue text-white shadow-lg'
                            : 'bg-background1 text-dark-purple hover:bg-sky-blue/30 border border-sky-blue/30'
                        }`}
                      >
                        {day}
                        {count > 1 && (
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-sky-blue text-dark-purple text-xs font-bold rounded-full flex items-center justify-center">
                            {count}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Achievement Display */}
      <AnimatePresence mode="wait">
        {currentAchievement && (
          <motion.div
            key={`${selectedYear}-${selectedMonth}-${selectedDay}-${currentAchievementIndex}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="max-w-5xl mx-auto relative z-10"
          >
            <div className="bg-white rounded-3xl border border-sky-blue/30 shadow-xl overflow-hidden">
              {/* Achievement Header */}
              <div className="bg-navy-blue p-4 flex items-center justify-between">
                <button
                  onClick={() => navigateAchievement('prev')}
                  disabled={currentAchievementIndex === 0}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    currentAchievementIndex === 0
                      ? 'opacity-30 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <FaChevronLeft className="text-white text-lg" />
                </button>

                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-white">
                    <FaAward className="text-sky-blue" />
                    <span className="font-bold">
                      {monthNames[selectedMonth - 1]} {selectedDay},{' '}
                      {selectedYear}
                    </span>
                    <FaAward className="text-sky-blue" />
                  </div>
                  {selectedAchievements.length > 1 && (
                    <p className="text-sky-blue/80 text-sm mt-1">
                      {currentAchievementIndex + 1} of{' '}
                      {selectedAchievements.length} achievements
                    </p>
                  )}
                </div>

                <button
                  onClick={() => navigateAchievement('next')}
                  disabled={
                    currentAchievementIndex === selectedAchievements.length - 1
                  }
                  className={`p-3 rounded-full transition-all duration-200 ${
                    currentAchievementIndex === selectedAchievements.length - 1
                      ? 'opacity-30 cursor-not-allowed'
                      : 'bg-white/10 hover:bg-white/20'
                  }`}
                >
                  <FaChevronRight className="text-white text-lg" />
                </button>
              </div>

              {/* Achievement Content */}
              <div className="p-8">
                <div className="flex flex-col lg:flex-row gap-8">
                  {/* Image Section */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:w-2/5"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-navy-blue via-sky-blue to-navy-blue rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
                      <img
                        src={currentAchievement.image}
                        alt={currentAchievement.title}
                        className="relative w-full h-64 lg:h-80 object-cover rounded-2xl shadow-lg"
                      />
                      <div className="absolute -top-3 -right-3 bg-sky-blue p-2.5 rounded-full shadow-lg">
                        <FaTrophy className="text-dark-purple text-xl" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Details Section */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 }}
                    className="lg:w-3/5 flex flex-col justify-center"
                  >
                    <h2 className="text-3xl lg:text-4xl font-bold text-dark-purple mb-4">
                      {currentAchievement.title}
                    </h2>

                    <p className="text-navy-blue/80 text-lg leading-relaxed mb-6">
                      {currentAchievement.description}
                    </p>

                    <div className="bg-background1 rounded-xl p-4 border border-sky-blue/20">
                      <p className="text-xs text-navy-blue uppercase tracking-wider mb-3 font-semibold flex items-center gap-2">
                        <FaUsers size={12} />
                        Achievers
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-40 overflow-y-auto pr-2">
                        {currentAchievement.instructors &&
                        currentAchievement.instructors.length > 0 ? (
                          currentAchievement.instructors.map((inst, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-3 bg-white/50 p-2 rounded-lg border border-sky-blue/10"
                            >
                              <div className="w-8 h-8 bg-navy-blue rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {inst.name?.charAt(0) || '?'}
                              </div>
                              <div className="min-w-0">
                                <p className="text-dark-purple font-bold text-sm truncate">
                                  {inst.name}
                                </p>
                                <p className="text-navy-blue/60 text-[10px] truncate">
                                  {inst.role}
                                </p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-dark-purple font-semibold">
                            Unknown
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Achievement Stats */}
                    <div className="mt-6 grid grid-cols-3 gap-2 md:gap-4">
                      <div className="bg-navy-blue/10 rounded-xl p-2 sm:p-4 border border-navy-blue/20 text-center hover:bg-navy-blue/15 transition-colors">
                        <FaStar className="text-sky-blue text-xl md:text-2xl mx-auto mb-2" />
                        <p className="text-navy-blue text-[10px] sm:text-xs md:text-sm font-medium">
                          Excellence
                        </p>
                      </div>
                      <div className="bg-sky-blue/10 rounded-xl p-2 sm:p-4 border border-sky-blue/30 text-center hover:bg-sky-blue/20 transition-colors">
                        <FaAward className="text-navy-blue text-xl md:text-2xl mx-auto mb-2" />
                        <p className="text-navy-blue text-[10px] sm:text-xs md:text-sm font-medium">
                          Recognition
                        </p>
                      </div>
                      <div className="bg-navy-blue/10 rounded-xl p-2 sm:p-4 border border-navy-blue/20 text-center hover:bg-navy-blue/15 transition-colors">
                        <FaTrophy className="text-sky-blue text-xl md:text-2xl mx-auto mb-2" />
                        <p className="text-navy-blue text-[10px] sm:text-xs md:text-sm font-medium">
                          Achievement
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Pagination Dots */}
              {selectedAchievements.length > 1 && (
                <div className="flex justify-center gap-2 pb-6">
                  {selectedAchievements.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentAchievementIndex(index)}
                      className={`h-2.5 rounded-full transition-all duration-200 ${
                        index === currentAchievementIndex
                          ? 'bg-navy-blue w-8'
                          : 'bg-sky-blue/50 w-2.5 hover:bg-sky-blue'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Day Selected State */}
      {selectedMonth && !selectedDay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-xl mx-auto text-center py-12 relative z-10"
        >
          <div className="bg-white rounded-2xl p-8 border border-sky-blue/30 shadow-lg">
            <FaCalendarAlt className="text-5xl text-navy-blue/40 mx-auto mb-4" />
            <p className="text-xl text-dark-purple">
              Select a day to view achievements
            </p>
            <p className="text-navy-blue/60 mt-2">
              Choose from the available dates above
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AchievementCalendar;
