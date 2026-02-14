import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaPaperPlane,
  FaLock,
  FaInfoCircle,
} from 'react-icons/fa';
import { submitBookSubmission } from '../../../features/bookSubmission/bookSubThunks';
import { bookSubmissionActions } from '../../../features/bookSubmission/bookSubSlice';
// import { getUserRegistrations } from '../../../features/admin/users/usersThunks';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AnnouncementBookForm = ({ announcement }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  // const { registrations } = useSelector((state) => state.user);
  const { isLoading, success, error } = useSelector(
    (state) => state.bookSubmission
  );

  const form = announcement.bookFormId;
  const questions = form?.questions || [];

  const [answers, setAnswers] = useState({});
  const [isSubmittedLocal, setIsSubmittedLocal] = useState(false);

  // Check if user has already registered for this announcement
  const isAlreadyRegistered = null?.some(
    (reg) =>
      (reg.announcementId?._id || reg.announcementId) === announcement._id
  );

  useEffect(() => {
    if (userData) {
      // dispatch(getUserRegistrations());
    }
  }, [userData, dispatch]);

  useEffect(() => {
    if (success) {
      setIsSubmittedLocal(true);
      toast.success('Registration successful!');
      dispatch(bookSubmissionActions.clearSuccess());
      // Refresh registrations after successful submission
      // dispatch(getUserRegistrations());
    }
    if (error) {
      toast.error(error);
      dispatch(bookSubmissionActions.clearError());
    }
  }, [success, error, dispatch]);

  const handleChange = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleCheckboxChange = (questionId, option, checked) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers;
    if (checked) {
      newAnswers = [...currentAnswers, option];
    } else {
      newAnswers = currentAnswers.filter((a) => a !== option);
    }
    handleChange(questionId, newAnswers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!userData) {
      toast.error('Please login to register');
      return;
    }

    // Basic validation for required fields
    for (const q of questions) {
      if (q.required && !answers[q._id]) {
        toast.error(`${q.label} is required`);
        return;
      }
    }

    const submissionData = {
      announcementId: announcement._id,
      bookFormId: form?._id,
      answers: answers,
    };

    dispatch(submitBookSubmission(submissionData));
  };

  if (!form) {
    return null;
  }

  if (!form.isActive) {
    return (
      <div className="bg-white/90 backdrop-blur-sm border border-navy-blue/10 rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-slate-100 p-6 text-slate-500 text-center border-b border-slate-200">
          <h3 className="text-xl font-bold flex items-center justify-center gap-2 italic">
            Booking Closed
          </h3>
        </div>
        <div className="p-8 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 text-2xl">
              <FaLock />
            </div>
          </div>
          <p className="text-slate-600 font-medium">
            Registration for this event is currently closed. Keep an eye on our
            social media for future updates!
          </p>
          <div className="pt-2 text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
            Bitwise Club Events
          </div>
        </div>
      </div>
    );
  }

  if (isSubmittedLocal || isAlreadyRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/80 backdrop-blur-md border border-green-200 rounded-2xl p-8 text-center shadow-xl"
      >
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-500 text-4xl">
            <FaCheckCircle />
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">
          You're Registered!
        </h3>
        <p className="text-gray-600">
          Thank you for joining. We've received your registration details for{' '}
          <span className="font-semibold">{announcement.title}</span>.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-navy-blue/10 rounded-2xl shadow-2xl overflow-hidden">
      {/* Form Header */}
      <div className="bg-gradient-to-r from-navy-blue to-dark-purple p-6 text-white text-center">
        <h3 className="text-xl font-bold flex items-center justify-center gap-2">
          Reserve Your Spot
        </h3>
        <p className="text-blue-100 text-sm mt-1">
          Fill out the form below to register
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {!userData && (
          <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-start gap-3 mb-4">
            <FaLock className="text-amber-500 mt-1 flex-shrink-0" />
            <div className="text-sm">
              <p className="font-bold text-amber-800 uppercase text-[10px] tracking-wider mb-1">
                Authenticated Only
              </p>
              <p className="text-amber-700">
                Please{' '}
                <Link to="/login" className="font-bold underline">
                  Login
                </Link>{' '}
                or{' '}
                <Link to="/signup" className="font-bold underline">
                  Signup
                </Link>{' '}
                to join this event.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4 max-h-[50vh] overflow-y-auto px-1 custom-scrollbar">
          {questions.map((q) => (
            <div key={q._id} className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 block">
                {q.label}
                {q.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {q.type === 'textarea' ? (
                <textarea
                  value={answers[q._id] || ''}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  placeholder={q.placeholder}
                  required={q.required}
                  disabled={!userData || isLoading}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all resize-none min-h-[100px]"
                />
              ) : q.type === 'select' ? (
                <select
                  value={answers[q._id] || ''}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  required={q.required}
                  disabled={!userData || isLoading}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all"
                >
                  <option value="">Select an option</option>
                  {q.options.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : q.type === 'radio' ? (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={(e) => handleChange(q._id, e.target.value)}
                        required={q.required}
                        disabled={!userData || isLoading}
                        className="w-4 h-4 text-navy-blue border-slate-300 focus:ring-navy-blue"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-navy-blue transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              ) : q.type === 'checkbox' ? (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={(answers[q._id] || []).includes(opt)}
                        onChange={(e) =>
                          handleCheckboxChange(q._id, opt, e.target.checked)
                        }
                        disabled={!userData || isLoading}
                        className="w-4 h-4 rounded text-navy-blue border-slate-300 focus:ring-navy-blue"
                      />
                      <span className="text-sm text-slate-600 group-hover:text-navy-blue transition-colors">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              ) : (
                <input
                  type={q.type}
                  value={answers[q._id] || ''}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  placeholder={q.placeholder}
                  required={q.required}
                  disabled={!userData || isLoading}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all"
                />
              )}
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={!userData || isLoading}
          className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 ${
            !userData || isLoading
              ? 'bg-slate-300 cursor-not-allowed opacity-70'
              : 'bg-gradient-to-r from-navy-blue to-dark-purple hover:shadow-navy-blue/30 active:translate-y-0'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <FaPaperPlane className="text-sm" />
              Complete Registration
            </>
          )}
        </button>

        <div className="pt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-medium uppercase tracking-[0.2em]">
          <FaInfoCircle size={10} />
          Secure Registration System
        </div>
      </form>
    </div>
  );
};

export default AnnouncementBookForm;
