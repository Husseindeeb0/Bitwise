import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaCheckCircle,
  FaPaperPlane,
  FaLock,
  FaInfoCircle,
  FaTrashAlt,
  FaChevronRight,
  FaUserAlt,
  FaEnvelope,
  FaChevronDown,
} from 'react-icons/fa';
import {
  submitBookSubmission,
  deleteBookSubmission,
} from '../../../features/bookSubmission/bookSubThunks';
import { bookSubmissionActions } from '../../../features/bookSubmission/bookSubSlice';
import { getMe } from '../../../features/profile/profileThunks';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AnnouncementBookForm = ({ announcement }) => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.auth);
  const { announcements: profileAnnouncements } = useSelector(
    (state) => state.profile
  );
  const { isLoading, success, error } = useSelector(
    (state) => state.bookSubmission
  );

  const form = announcement.bookFormId;
  const questions = form?.questions || [];

  const [answers, setAnswers] = useState({});
  const [isSubmittedLocal, setIsSubmittedLocal] = useState(false);

  // Check if user has already registered for this announcement
  const existingRegistration = profileAnnouncements?.find(
    (reg) => (reg.announcement?._id || reg.announcement) === announcement._id
  );
  const isAlreadyRegistered = !!existingRegistration;

  useEffect(() => {
    if (
      userData &&
      (!profileAnnouncements || profileAnnouncements.length === 0)
    ) {
      dispatch(getMe());
    }
  }, [userData, profileAnnouncements, dispatch]);

  useEffect(() => {
    if (success) {
      setIsSubmittedLocal(true);
      toast.success('Operation successful!');
      dispatch(bookSubmissionActions.clearSuccess());
      dispatch(getMe());
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to cancel your registration?')) {
      const submissionId = existingRegistration.submissionId;
      dispatch(deleteBookSubmission(submissionId));
    }
  };

  if (!form) return null;

  if (!form.isActive) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden p-8 text-center space-y-6">
        <div className="mx-auto w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 text-3xl shadow-inner rotate-3">
          <FaLock />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-800">
            Registration Closed
          </h3>
          <p className="text-slate-500 text-sm leading-relaxed max-w-[240px] mx-auto">
            This portal is currently inactive. Follow our updates for future
            openings.
          </p>
        </div>
        <div className="pt-4 flex flex-col items-center gap-1 opacity-40">
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase">
            Bitwise Club
          </span>
          <div className="w-8 h-1 bg-slate-400 rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isSubmittedLocal || isAlreadyRegistered) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/90 backdrop-blur-xl border border-green-100 rounded-3xl p-10 text-center shadow-2xl relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-[-20px] right-[-20px] w-40 h-40 bg-green-50 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-20px] left-[-20px] w-32 h-32 bg-sky-200 rounded-full blur-3xl opacity-30"></div>

        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-500 rounded-3xl shadow-xl shadow-green-200 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 10,
                delay: 0.2,
              }}
            >
              <FaCheckCircle className="text-white text-5xl" />
            </motion.div>
          </div>

          <div className="space-y-3">
            <h3 className="text-3xl font-black text-dark-purple tracking-tight">
              Confirmed!
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed max-w-[280px] mx-auto">
              Your spot is reserved for <br />
              <span className="text-navy-blue font-bold text-base bg-navy-blue/5 px-3 py-1 rounded-lg mt-2 inline-block">
                {announcement.title}
              </span>
            </p>
          </div>

          <div className="pt-8 border-t border-gray-100 w-full">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDelete}
              disabled={isLoading}
              className="group flex items-center justify-center gap-3 w-full py-4 px-6 bg-red-50 text-red-600 rounded-2xl font-black text-sm hover:bg-red-100 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <FaTrashAlt className="group-hover:animate-bounce" />
              {isLoading ? 'Processing...' : 'Cancel Registration'}
            </motion.button>
            <p className="text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em] font-bold">
              ID: {existingRegistration?.submissionId?.slice(-8) || 'PENDING'}
            </p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-2xl border border-white/50 rounded-[2rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)] overflow-hidden transition-all duration-500 hover:shadow-[0_35px_60px_-15px_rgba(0,0,0,0.2)]">
      {/* Header */}
      <div className="bg-gradient-to-br from-navy-blue via-dark-purple to-indigo-900 p-8 text-white relative overflow-hidden">
        {/* Decorative Blobs */}
        <div className="absolute top-[-50px] left-[-50px] w-48 h-48 bg-sky-400/20 rounded-full blur-[60px]"></div>
        <div className="absolute bottom-[-30px] right-[-30px] w-32 h-32 bg-purple-400/20 rounded-full blur-[40px]"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-6 bg-sky-400 rounded-full"></div>
            <h3 className="text-2xl font-black tracking-tight">
              Secure Your Entry
            </h3>
          </div>
          <p className="text-blue-100/80 text-sm font-medium pl-5 border-l border-white/10">
            Join the community. Complete the form below to register.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-7">
        <AnimatePresence>
          {!userData && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/60 p-5 rounded-2xl flex items-start gap-4 mb-2 shadow-inner"
            >
              <div className="bg-white p-2.5 rounded-xl shadow-sm">
                <FaLock className="text-amber-600 text-lg" />
              </div>
              <div className="space-y-1">
                <p className="font-black text-amber-900 uppercase text-[10px] tracking-widest leading-none">
                  Access Restricted
                </p>
                <p className="text-amber-800 text-xs leading-relaxed">
                  Join the club to participate. <br />
                  <Link
                    to="/login"
                    className="font-bold underline hover:text-amber-600 transition-colors"
                  >
                    SignIn
                  </Link>{' '}
                  or{' '}
                  <Link
                    to="/signup"
                    className="font-bold underline hover:text-amber-600 transition-colors"
                  >
                    Register
                  </Link>
                  .
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-6 max-h-[48vh] overflow-y-auto pr-3 pl-1 custom-scrollbar scroll-smooth">
          {questions.map((q, idx) => (
            <motion.div
              key={q._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="space-y-2.5"
            >
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <span className="w-1 h-1 bg-navy-blue rounded-full"></span>
                  {q.label}
                  {q.required && (
                    <span className="text-red-500 font-bold">*</span>
                  )}
                </label>
              </div>

              {q.type === 'textarea' ? (
                <textarea
                  value={answers[q._id] || ''}
                  onChange={(e) => handleChange(q._id, e.target.value)}
                  placeholder={q.placeholder || 'Type your answer...'}
                  required={q.required}
                  disabled={!userData || isLoading}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-navy-blue/10 focus:border-navy-blue focus:bg-white outline-none transition-all resize-none min-h-[120px] text-sm text-dark-purple placeholder:text-gray-300 shadow-sm"
                />
              ) : q.type === 'select' ? (
                <div className="relative group">
                  <select
                    value={answers[q._id] || ''}
                    onChange={(e) => handleChange(q._id, e.target.value)}
                    required={q.required}
                    disabled={!userData || isLoading}
                    className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-navy-blue/10 focus:border-navy-blue focus:bg-white outline-none transition-all appearance-none text-sm text-dark-purple shadow-sm"
                  >
                    <option value="" disabled className="text-gray-400">
                      Choose an option
                    </option>
                    {q.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <FaChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none group-focus-within:text-navy-blue transition-colors" />
                </div>
              ) : q.type === 'radio' ? (
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        answers[q._id] === opt
                          ? 'bg-navy-blue/5 border-navy-blue text-navy-blue shadow-md'
                          : 'bg-gray-50/50 border-transparent hover:bg-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={(e) => handleChange(q._id, e.target.value)}
                        required={q.required}
                        disabled={!userData || isLoading}
                        className="w-4 h-4 text-navy-blue border-gray-300 focus:ring-navy-blue/20"
                      />
                      <span className="text-sm font-bold tracking-tight">
                        {opt}
                      </span>
                    </label>
                  ))}
                </div>
              ) : q.type === 'checkbox' ? (
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {q.options.map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                        (answers[q._id] || []).includes(opt)
                          ? 'bg-navy-blue/5 border-navy-blue text-navy-blue shadow-md'
                          : 'bg-gray-50/50 border-transparent hover:bg-gray-100 hover:border-gray-200 text-gray-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        value={opt}
                        checked={(answers[q._id] || []).includes(opt)}
                        onChange={(e) =>
                          handleCheckboxChange(q._id, opt, e.target.checked)
                        }
                        disabled={!userData || isLoading}
                        className="w-4 h-4 rounded text-navy-blue border-gray-300 focus:ring-navy-blue/20"
                      />
                      <span className="text-sm font-bold tracking-tight">
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
                  placeholder={
                    q.placeholder || `Enter ${q.label.toLowerCase()}...`
                  }
                  required={q.required}
                  disabled={!userData || isLoading}
                  className="w-full px-5 py-4 bg-gray-50/50 border border-gray-200 rounded-2xl focus:ring-4 focus:ring-navy-blue/10 focus:border-navy-blue focus:bg-white outline-none transition-all text-sm text-dark-purple placeholder:text-gray-300 shadow-sm"
                />
              )}
            </motion.div>
          ))}
        </div>

        <div className="pt-4 space-y-4">
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={!userData || isLoading}
            className={`w-full flex items-center justify-center gap-3 py-4.5 rounded-[1.25rem] font-black text-white shadow-2xl transition-all relative overflow-hidden group ${
              !userData || isLoading
                ? 'bg-slate-300 cursor-not-allowed grayscale'
                : 'bg-gradient-to-r from-navy-blue to-dark-purple'
            }`}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="uppercase tracking-[0.2em] text-xs">
                  Processing...
                </span>
              </div>
            ) : (
              <>
                <span className="uppercase tracking-[0.2em] text-xs">
                  Confirm My Registration
                </span>
              </>
            )}
          </motion.button>

          <div className="flex items-center justify-center gap-3 py-2 text-[9px] text-gray-400 font-black uppercase tracking-[0.3em] opacity-60">
            <div className="flex items-center gap-1.5">
              <FaInfoCircle size={10} className="text-sky-400" />
              Secure Registration System
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AnnouncementBookForm;
