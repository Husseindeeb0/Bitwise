import { useEffect, useState } from 'react';
import { FaPlus, FaTrophy, FaTimes, FaEdit, FaSearch } from 'react-icons/fa';

import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import AchievementCard from '../../../components/Achievements/AchievementCard/index';
import {
  getAchievements,
  deleteAchievements,
} from '../../../features/achievements/achievementsThunks';
import ConfirmationModal from '../../../components/ConfirmationModal';
import AchievementForm from './form';

function ManageAchievements() {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add');

  const [editingAchievement, setEditingAchievement] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const initialAchievementState = {
    title: '',
    description: '',
    time: '',
    category: '',
    location: '',
    imageUrl: '',
    imageId: '',
    instructors: [],
  };

  const achievementsData = useSelector((state) => {
    const data = state.achievements?.achievementsData;
    if (Array.isArray(data)) return data;
    if (data?.achievementsData) return data.achievementsData;
    return [];
  });

  const [isDeleting, setIsDeleting] = useState(null);

  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [achievementToDelete, setAchievementToDelete] = useState(null);

  // Filter achievements based on search
  const filteredAchievements = achievementsData.filter(
    (a) =>
      a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const executeDelete = async () => {
    const id = achievementToDelete;
    if (!id) return;

    try {
      setIsDeleting(id);
      await dispatch(deleteAchievements(id)).unwrap();
      toast.success('Achievement deleted successfully');
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error(error || 'Failed to delete achievement');
    } finally {
      setIsDeleting(null);
      setAchievementToDelete(null);
    }
  };

  const handleDeleteAchievements = (id) => {
    setAchievementToDelete(id);
    setIsDeleteModalOpen(true);
  };

  useEffect(() => {
    dispatch(getAchievements());
  }, [dispatch]);

  const handleAddAchievement = () => {
    setEditingAchievement(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditAchievement = (achievement) => {
    let formattedTime = '';
    if (achievement.time) {
      const date = new Date(achievement.time);
      formattedTime = date.toISOString().slice(0, 10);
    }

    setEditingAchievement({
      ...achievement,
      time: formattedTime,
    });

    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleFormSuccess = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAchievement(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-sky-blue/20 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-navy-blue rounded-xl flex items-center justify-center">
                <FaTrophy className="text-2xl text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-dark-purple">
                  Manage Achievements
                </h1>
                <p className="text-navy-blue/60 text-sm">
                  {achievementsData.length} achievement
                  {achievementsData.length !== 1 ? 's' : ''} total
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              {/* Search */}
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-blue/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search achievements..."
                  className="pl-10 pr-4 py-2.5 w-full sm:w-64 border border-sky-blue/30 rounded-xl text-sm focus:ring-2 focus:ring-navy-blue focus:border-navy-blue transition-all"
                />
              </div>

              {/* Add Button */}
              <button
                onClick={handleAddAchievement}
                className="flex items-center justify-center gap-2 px-5 py-2.5 bg-navy-blue text-white rounded-xl font-medium hover:bg-navy-blue/90 transition-colors shadow-sm"
              >
                <FaPlus size={14} />
                Add Achievement
              </button>
            </div>
          </div>
        </div>

        {/* Achievements List */}
        {filteredAchievements.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-sky-blue/20 p-12 text-center"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-background1 flex items-center justify-center">
              <FaTrophy className="text-3xl text-navy-blue/40" />
            </div>
            <h2 className="text-xl font-bold text-dark-purple mb-2">
              {searchQuery ? 'No results found' : 'No achievements yet'}
            </h2>
            <p className="text-navy-blue/60 mb-6 max-w-md mx-auto">
              {searchQuery
                ? 'Try adjusting your search terms'
                : 'Start by adding your first achievement'}
            </p>
            {!searchQuery && (
              <button
                onClick={handleAddAchievement}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-navy-blue text-white rounded-xl font-medium hover:bg-navy-blue/90 transition-colors"
              >
                <FaPlus size={14} />
                Add Your First Achievement
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-4">
            {filteredAchievements.map((achievement, index) => (
              <motion.div
                key={achievement?._id || index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AchievementCard
                  achievement={achievement}
                  page="adminPanel"
                  editAchievement={handleEditAchievement}
                  deleteAchievements={handleDeleteAchievements}
                  isDeleting={isDeleting === achievement._id}
                />
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-start justify-center min-h-screen px-4 pt-20 pb-12">
              {/* Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-dark-purple/60 backdrop-blur-sm"
                onClick={handleCloseModal}
              />

              {/* Modal Panel */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden"
              >
                {/* Modal Header */}
                <div className="bg-navy-blue px-6 py-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                        {modalMode === 'add' ? (
                          <FaPlus className="text-white" />
                        ) : (
                          <FaEdit className="text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {modalMode === 'add'
                            ? 'Add Achievement'
                            : 'Edit Achievement'}
                        </h3>
                        <p className="text-sky-blue text-sm">
                          {modalMode === 'add'
                            ? 'Create a new achievement entry'
                            : 'Update achievement details'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <FaTimes size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Body */}
                <AchievementForm
                  initialData={editingAchievement || initialAchievementState}
                  modalMode={modalMode}
                  onSuccess={handleFormSuccess}
                  onCancel={handleCloseModal}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={executeDelete}
        title="Delete Achievement"
        message="Are you sure you want to delete this achievement? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting === achievementToDelete}
      />
    </div>
  );
}

export default ManageAchievements;
