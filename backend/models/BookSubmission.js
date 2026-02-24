const mongoose = require('mongoose');

const bookSubmissionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announcement',
      required: true,
    },
    bookFormId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'BookForm',
      required: true,
    },
    // Answers are stored as a single object keyed by question _id
    answers: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only submit once per announcement
bookSubmissionSchema.index(
  { userId: 1, announcementId: 1 },
  { unique: true }
);

const BookSubmission = mongoose.model(
  'BookSubmission',
  bookSubmissionSchema
);
module.exports = BookSubmission;
