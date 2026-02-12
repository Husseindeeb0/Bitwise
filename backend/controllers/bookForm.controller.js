const BookForm = require('../models/BookForm');
const Announcement = require('../models/Announcements');

const createBookForm = async (req, res) => {
  try {
    const { announcementId, questions, isActive } = req.body;

    if (!announcementId || !questions || typeof isActive !== 'boolean') {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const existingBookForm = await BookForm.findOne({
      announcementId,
    });
    if (existingBookForm) {
      return res.status(400).json({
        message: 'Book form already exists',
      });
    }
    const bookForm = new BookForm({
      announcementId,
      questions,
      isActive,
    });
    await bookForm.save();

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement not found',
      });
    }
    announcement.bookFormId = bookForm._id;
    await announcement.save();
    return res.status(201).json({
      message: 'Book form created successfully',
      data: bookForm,
    });
  } catch (error) {
    console.error('Error creating book form:', error);
    return res.status(500).json({
      message: 'Failed to create book form',
    });
  }
};

const updateBookForm = async (req, res) => {
  try {
    const { bookFormId, questions, isActive } = req.body;

    if (!bookFormId || !questions || typeof isActive !== 'boolean') {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const existingBookForm = await BookForm.findById(bookFormId);
    if (!existingBookForm) {
      return res.status(404).json({
        message: 'Book form not found',
      });
    }
    existingBookForm.questions = questions;
    existingBookForm.isActive = isActive;
    await existingBookForm.save();
    return res.status(200).json({
      message: 'Book form updated successfully',
    });
  } catch (error) {
    console.error('Error updating book form:', error);
    return res.status(500).json({
      message: 'Failed to update book form',
    });
  }
};

const deleteBookForm = async (req, res) => {
  try {
    const { bookFormId } = req.params;

    if (!bookFormId) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    const existingBookForm = await BookForm.findById(bookFormId);
    if (!existingBookForm) {
      return res.status(404).json({
        message: 'Book form not found',
      });
    }
    await Announcement.updateOne(
      { _id: existingBookForm.announcementId },
      { $set: { bookFormId: null } }
    );

    await existingBookForm.deleteOne();
    return res.status(200).json({
      message: 'Book form deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book form:', error);
    return res.status(500).json({
      message: 'Failed to delete book form',
    });
  }
};

module.exports = {
  createBookForm,
  updateBookForm,
  deleteBookForm,
};
