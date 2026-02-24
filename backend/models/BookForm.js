const mongoose = require('mongoose');

const bookFormSchema = new mongoose.Schema(
  {
    announcementId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Announcement',
      required: true,
      unique: true,
    },
    questions: [
      {
        _id: {
          type: String, // Stable identifier like "full_name", "phone_number"
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        type: {
          type: String,
          required: true,
          enum: [
            'text',
            'number',
            'email',
            'textarea',
            'select',
            'radio',
            'checkbox',
          ],
        },
        required: {
          type: Boolean,
          default: false,
        },
        options: [String], // Used for select, radio, checkbox
        placeholder: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const BookForm = mongoose.model('BookForm', bookFormSchema);
module.exports = BookForm;
