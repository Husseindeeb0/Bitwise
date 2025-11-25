import React, { useRef, useState, useEffect } from 'react';
import { 
  FaChevronLeft, FaChevronRight, FaStar, 
  FaMapMarkerAlt, FaWifi, FaTv, FaShieldAlt, FaHeart 
} from 'react-icons/fa';

const AchievementCalendar = ({ achievementsData }) => {
  const scrollRef = useRef(null);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Generate days dynamically
  useEffect(() => {
    const dateArray = [];
    const totalDays = new Date(selectedYear, selectedMonth + 1, 0).getDate();
    for (let i = 1; i <= totalDays; i++) {
      const date = new Date(selectedYear, selectedMonth, i);
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
      dateArray.push({
        day: dayName,
        num: i,
        dateString: `${selectedYear}-${selectedMonth + 1}-${i}`
      });
    }
    setDaysInMonth(dateArray);
    setSelectedDate(null);
    setCurrentCardIndex(0);
    setCurrentSlide(0);
  }, [selectedMonth, selectedYear]);

  const scrollLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const scrollRight = () => {
    const totalSlides = Math.ceil(daysInMonth.length / 5);
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const selectedDateAchievements = selectedDate 
    ? achievementsData.filter(ach => ach.date === selectedDate.dateString)
    : [];

  const currentAchievement = selectedDateAchievements[currentCardIndex];

  const years = [];
  for (let y = 2020; y <= 2030; y++) years.push(y);

  const cardScrollLeft = () => {
    if (currentCardIndex > 0) setCurrentCardIndex(currentCardIndex - 1);
  };

  const cardScrollRight = () => {
    if (currentCardIndex < selectedDateAchievements.length - 1)
      setCurrentCardIndex(currentCardIndex + 1);
  };

  // Get current slide dates (5 dates per slide)
  const getCurrentSlideDates = () => {
    const startIndex = currentSlide * 5;
    return daysInMonth.slice(startIndex, startIndex + 5);
  };

  const totalSlides = Math.ceil(daysInMonth.length / 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-20 to-blue-30 p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">Achievement Calendar</h1>
      </div>

      {/* Month Selector */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 max-w-2xl mx-auto">
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-6">
          <div className="flex items-center space-x-4">
            <select
              className="p-3 border border-blue-200 rounded-lg bg-white text-blue-800 font-medium focus:ring-blue-500"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            >
              {monthNames.map((m, idx) => (
                <option key={idx} value={idx}>{m}</option>
              ))}
            </select>

            <select
              className="p-3 border border-blue-200 rounded-lg bg-white text-blue-800 font-medium focus:ring-blue-500"
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            >
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>

          <div className="text-center">
            <span className="text-2xl font-bold text-blue-400 bg-blue-50 px-6 py-3 rounded-lg">
              {monthNames[selectedMonth]} {selectedYear}
            </span>
          </div>
        </div>
      </div>

      {/* Calendar Carousel */}
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 max-w-6xl mx-auto">
        <div className="flex items-center justify-center space-x-4 mb-6">
          <button
            onClick={scrollLeft}
            disabled={currentSlide === 0}
            className={`p-4 rounded-full ${
              currentSlide === 0 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'bg-blue-300 text-white hover:bg-blue-300'
            } transition-all flex-shrink-0`}
          >
            <FaChevronLeft size={24} />
          </button>

          {/* Days ] */}
          <div className="grid grid-cols-5 gap-6 flex-1">
            {getCurrentSlideDates().map((d, i) => {
              const dayAchievements = achievementsData.filter(ach => ach.date === d.dateString);
              const hasAchievements = dayAchievements.length > 0;
              const isSelected = selectedDate && selectedDate.dateString === d.dateString;

              return (
                <div
                  key={i}
                  onClick={() => { setSelectedDate(d); setCurrentCardIndex(0); }}
                  className={`rounded-2xl cursor-pointer p-6 transition-all duration-300 hover:scale-105 ${
                    isSelected
                      ? 'ring-4 ring-blue-400 bg-blue-600 text-white shadow-xl scale-105'
                      : hasAchievements
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                  }`}
                >
                  <p className="font-semibold text-center text-lg">{d.day}</p>
                  <p className="text-4xl font-bold text-center mt-3">{d.num}</p>

                  {hasAchievements ? (
                    <div className="text-sm bg-blue-400 text-white px-3 py-2 mt-4 text-center rounded-full">
                      {dayAchievements.length} achievement{dayAchievements.length > 1 ? 's' : ''}
                    </div>
                  ) : (
                    <p className="text-sm text-blue-400 text-center mt-4">No activities</p>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={scrollRight}
            disabled={currentSlide === totalSlides - 1}
            className={`p-4 rounded-full ${
              currentSlide === totalSlides - 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            } transition-all flex-shrink-0`}
          >
            <FaChevronRight size={24} />
          </button>
        </div>

        {/* Slide Indicator */}
        {/* <div className="text-center mt-4">
          <span className="text-sm font-medium text-blue-800 bg-blue-100 px-4 py-2 rounded-full">
            {currentSlide + 1} of {totalSlides}
          </span>
        </div> */}
      </div>

      {/* Achievements Cards */}
      {selectedDate && selectedDateAchievements.length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="rounded-xl border bg-white shadow-lg overflow-hidden">
            {/* Header */}
            <div className="w-full p-4 bg-blue-600 text-white flex justify-between items-center">
              <button
                onClick={cardScrollLeft}
                disabled={currentCardIndex === 0}
                className={`p-2 rounded-full ${
                  currentCardIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
              >
                <FaChevronLeft size={16} />
              </button>

              <h3 className="text-lg font-bold text-center">
                {selectedDate.day}, {monthNames[selectedMonth]} {selectedDate.num} - Achievements
              </h3>

              <button
                onClick={cardScrollRight}
                disabled={currentCardIndex === selectedDateAchievements.length - 1}
                className={`p-2 rounded-full ${
                  currentCardIndex === selectedDateAchievements.length - 1
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-blue-700'
                }`}
              >
                <FaChevronRight size={16} />
              </button>
            </div>

            {/* Counter */}
            <div className="bg-blue-500 text-white text-center py-1 text-sm">
              {currentCardIndex + 1} of {selectedDateAchievements.length}
            </div>

            {/* Card Body */}
            <div className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={currentAchievement.image}
                  alt={currentAchievement.title}
                  className="w-full md:w-1/3 h-48 object-cover rounded-lg"
                />
                
                <div className="flex-1">
                  <h2 className="font-bold text-2xl mb-4">{currentAchievement.title}</h2>

                  <p className="text-stone-600 mb-4">{currentAchievement.description}</p>

                  <div className="mb-4">
                    <p className="font-semibold mb-2">Achieved by:</p>
                    <div className="flex items-center space-x-3">
                      <img
                        src={currentAchievement.image}
                        className="w-10 h-10 rounded-full"
                        alt={currentAchievement.person}
                      />
                      <span className="text-blue-600 font-medium text-lg">
                        {currentAchievement.person}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-6">
                    <button className="p-3 rounded-md bg-stone-100 border hover:bg-stone-200 transition-colors">
                      <FaTv />
                    </button>
                    <button className="p-3 rounded-md bg-stone-100 border hover:bg-stone-200 transition-colors">
                      <FaWifi />
                    </button>
                    <button className="p-3 rounded-md bg-stone-100 border hover:bg-stone-200 transition-colors">
                      <FaShieldAlt />
                    </button>
                    <button className="p-3 rounded-md bg-stone-100 border hover:bg-stone-200 transition-colors">
                      <FaMapMarkerAlt />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg shadow transition-colors font-medium">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {selectedDate && selectedDateAchievements.length === 0 && (
        <div className="max-w-4xl mx-auto text-center py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-blue-600 font-medium text-lg">
              No achievements for {selectedDate.day}, {monthNames[selectedMonth]} {selectedDate.num}.
            </p>
            <p className="text-gray-500 mt-2">Select another date to view achievements.</p>
          </div>
        </div>
      )}

      {/* Initial State */}
      {!selectedDate && (
        <div className="max-w-4xl mx-auto text-center py-8">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-blue-600 font-medium text-lg">
              Select a date from the calendar above to view achievements.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AchievementCalendar;