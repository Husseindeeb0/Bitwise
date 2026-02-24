import { useState, useEffect } from 'react';
import {
  FaPlus,
  FaTrash,
  FaSave,
  FaTimes,
  FaExclamationTriangle,
  FaQuestionCircle,
  FaToggleOn,
  FaToggleOff,
} from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  createBookForm,
  updateBookForm,
  deleteBookForm,
} from '../../../features/bookForm/bookFormThunks';
import { bookFormActions } from '../../../features/bookForm/bookFormSlice';
import toast from 'react-hot-toast';

const BookForm = ({ announcement, onClose, onSuccess }) => {
  const dispatch = useDispatch();
  const { isLoading, success, error } = useSelector((state) => state.bookForm);

  const [questions, setQuestions] = useState([]);
  const [isActive, setIsActive] = useState(true);
  const [hasForm, setHasForm] = useState(false);
  const [formId, setFormId] = useState(null);

  useEffect(() => {
    if (announcement?.bookFormId) {
      setHasForm(true);
      setFormId(announcement.bookFormId._id || announcement.bookFormId);
      setQuestions(announcement.bookFormId.questions || []);
      setIsActive(announcement.bookFormId.isActive ?? true);
    } else {
      setHasForm(false);
      setQuestions([
        {
          _id: 'full_name',
          label: 'Full Name',
          type: 'text',
          required: true,
          placeholder: 'Enter your full name',
        },
      ]);
    }
  }, [announcement]);

  useEffect(() => {
    if (success) {
      toast.success(
        hasForm ? 'Form updated successfully' : 'Form created successfully'
      );
      dispatch(bookFormActions.clearSuccess());
      onSuccess();
    }
    if (error) {
      toast.error(error);
      dispatch(bookFormActions.clearError());
    }
  }, [success, error, hasForm, dispatch, onSuccess]);

  const addQuestion = () => {
    const newId = `question_${Date.now()}`;
    setQuestions([
      ...questions,
      {
        _id: newId,
        label: '',
        type: 'text',
        required: false,
        placeholder: '',
        options: [],
      },
    ]);
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter((q) => q._id !== id));
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(
      questions.map((q) => (q._id === id ? { ...q, [field]: value } : q))
    );
  };

  const handleSave = async () => {
    if (questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    if (questions.some((q) => !q.label.trim())) {
      toast.error('All questions must have a label');
      return;
    }

    const formData = {
      announcementId: announcement._id,
      questions,
      isActive,
    };

    if (hasForm) {
      dispatch(updateBookForm({ ...formData, bookFormId: formId }));
    } else {
      dispatch(createBookForm(formData));
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this booking form?')) {
      dispatch(deleteBookForm(formId));
    }
  };

  const questionTypes = [
    { value: 'text', label: 'Short Text' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'number', label: 'Number' },
    { value: 'email', label: 'Email' },
    { value: 'select', label: 'Dropdown Selection' },
    { value: 'radio', label: 'Single Choice (Radio)' },
    { value: 'checkbox', label: 'Multiple Choice (Checkbox)' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-navy-blue to-dark-purple p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <FaQuestionCircle />
              Booking Form Builder
            </h2>
            <p className="text-blue-100 text-sm mt-1">
              Customize the registration form for: {announcement.title}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          {/* Status and Actions */}
          <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-700">Form Status:</span>
              <button
                onClick={() => setIsActive(!isActive)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                {isActive ? (
                  <FaToggleOn size={20} />
                ) : (
                  <FaToggleOff size={20} />
                )}
                {isActive ? 'Accepting Signups' : 'Signups Closed'}
              </button>
            </div>
            {hasForm && (
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-sm"
              >
                <FaTrash /> Delete Entire Form
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Questions</h3>
              <button
                onClick={addQuestion}
                className="btn-primary flex items-center gap-2 px-4 py-2 bg-navy-blue text-white rounded-lg hover:bg-sky-blue transition-all shadow-md active:scale-95"
              >
                <FaPlus /> Add Question
              </button>
            </div>

            <AnimatePresence>
              {questions.map((question, index) => (
                <motion.div
                  key={question._id}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  layout
                  className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm transition-shadow hover:shadow-md group"
                >
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1">
                            Question Label
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={question.label}
                            onChange={(e) =>
                              updateQuestion(
                                question._id,
                                'label',
                                e.target.value
                              )
                            }
                            placeholder="e.g. What is your phone number?"
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">
                            Input Type
                          </label>
                          <select
                            value={question.type}
                            onChange={(e) =>
                              updateQuestion(
                                question._id,
                                'type',
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all"
                          >
                            {questionTypes.map((t) => (
                              <option key={t.value} value={t.value}>
                                {t.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-xs font-bold text-slate-500 uppercase">
                            Placeholder
                          </label>
                          <input
                            type="text"
                            value={question.placeholder || ''}
                            onChange={(e) =>
                              updateQuestion(
                                question._id,
                                'placeholder',
                                e.target.value
                              )
                            }
                            placeholder="Hint for the user..."
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all"
                          />
                        </div>
                        <div className="flex items-center gap-6 h-full pt-4">
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={question.required}
                              onChange={(e) =>
                                updateQuestion(
                                  question._id,
                                  'required',
                                  e.target.checked
                                )
                              }
                              className="w-4 h-4 rounded text-navy-blue focus:ring-navy-blue"
                            />
                            <span className="text-sm font-semibold text-slate-700">
                              Required Field
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* Options for select/radio/checkbox */}
                      {['select', 'radio', 'checkbox'].includes(
                        question.type
                      ) && (
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                          <label className="text-xs font-bold text-slate-500 uppercase flex justify-between items-center">
                            Options (comma separated)
                            <span className="text-[10px] lowercase font-normal italic">
                              comma separated: Yes, No, Maybe
                            </span>
                          </label>
                          <input
                            type="text"
                            value={(question.options || []).join(', ')}
                            onChange={(e) =>
                              updateQuestion(
                                question._id,
                                'options',
                                e.target.value.split(',').map((s) => s.trim())
                              )
                            }
                            placeholder="Option 1, Option 2, ..."
                            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-navy-blue focus:bg-white outline-none transition-all text-sm"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-start">
                      <button
                        onClick={() => removeQuestion(question._id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        title="Remove Question"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {questions.length === 0 && (
              <div className="text-center py-10 bg-slate-100 rounded-xl border-2 border-dashed border-slate-300">
                <FaExclamationTriangle className="mx-auto text-slate-400 text-3xl mb-3" />
                <p className="text-slate-500 italic">No questions added yet.</p>
                <button
                  onClick={addQuestion}
                  className="mt-3 text-navy-blue hover:underline font-bold"
                >
                  Click here to add your first question
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-white border-t border-slate-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-semibold"
          >
            Close
          </button>
          <button
            onClick={handleSave}
            disabled={isLoading}
            className={`flex items-center gap-2 px-8 py-2 bg-gradient-to-r from-navy-blue to-dark-purple text-white rounded-lg font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all active:translate-y-0 ${
              isLoading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <FaSave />
            )}
            {hasForm ? 'Update Form' : 'Save & Create Form'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookForm;
