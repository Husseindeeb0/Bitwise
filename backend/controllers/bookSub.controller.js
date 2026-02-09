const BookSubmission = require('../models/BookSubmission');
const Announcement = require('../models/Announcements');
const BookForm = require('../models/BookForm');

const submitBookSubmission = async (req, res) => {
  try {
    const userId = req.userId;
    const { announcementId, bookFormId, answers } = req.body;

    if (!userId || !announcementId || !bookFormId || !answers) {
      return res.status(400).json({
        message: 'Missing required fields',
      });
    }

    if (Object.keys(answers).length === 0) {
      return res.status(400).json({
        message: 'Please provide answers to the form questions',
      });
    }

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement not found',
      });
    }

    const bookForm = await BookForm.findById(bookFormId);
    if (!bookForm) {
      return res.status(404).json({
        message: 'Book form not found',
      });
    }

    const existingSubmission = await BookSubmission.findOne({
      userId,
      announcementId,
      bookFormId,
    });

    if (existingSubmission) {
      return res.status(400).json({
        message: 'You have already submitted this form',
      });
    }

    await BookSubmission.create({
      userId,
      announcementId,
      bookFormId,
      answers,
    });
    return res.status(201).json({
      message: 'Book submission created successfully',
    });
  } catch (error) {
    console.error('Error creating book submission:', error);
    return res.status(500).json({
      message: 'Failed to create book submission',
    });
  }
};

const deleteBookSubmission = async (req, res) => {
  try {
    const { bookSubmissionId } = req.params;

    if (!bookSubmissionId) {
      return res.status(400).json({
        message: 'Missing book submission ID',
      });
    }

    const bookSubmission = await BookSubmission.findById(bookSubmissionId);
    if (!bookSubmission) {
      return res.status(404).json({
        message: 'Book submission not found',
      });
    }

    await bookSubmission.deleteOne();
    return res.status(200).json({
      message: 'Book submission deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting book submission:', error);
    return res.status(500).json({
      message: 'Failed to delete book submission',
    });
  }
};

const getBookSubmissions = async (req, res) => {
  try {
    const { announcementId } = req.params;

    if (!announcementId) {
      return res.status(400).json({
        message: 'Missing announcement ID',
      });
    }

    const announcement = await Announcement.findById(announcementId);
    if (!announcement) {
      return res.status(404).json({
        message: 'Announcement not found',
      });
    }

    const bookSubmissions = await BookSubmission.find({ announcementId });
    return res.status(200).json({
      message: 'Book submissions fetched successfully',
      bookSubmissions,
    });
  } catch (error) {
    console.error('Error fetching book submissions:', error);
    return res.status(500).json({
      message: 'Failed to fetch book submissions',
    });
  }
};

const getBookSubmissionsByUserId = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        message: 'Missing user ID',
      });
    }

    const bookSubmissions = await BookSubmission.find({ userId }).populate(
      'announcementId'
    );
    return res.status(200).json({
      message: 'Book submissions fetched successfully',
      data: bookSubmissions,
    });
  } catch (error) {
    console.error('Error fetching book submissions:', error);
    return res.status(500).json({
      message: 'Failed to fetch book submissions',
    });
  }
};

module.exports = {
  submitBookSubmission,
  deleteBookSubmission,
  getBookSubmissions,
  getBookSubmissionsByUserId,
};
