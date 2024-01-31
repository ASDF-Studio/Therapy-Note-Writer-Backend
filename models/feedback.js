const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: false,
            default: '',
        },
        feedback: {
            type: String,
            required: false,
            default: '',
        },
        rating: {
            type: Number,
            required: false,
            default: 0,
        },
    },
    { timestamps: true }
);

const Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = Feedback;
