const mongoose = require('mongoose');

const ContactSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: false,
            default: '',
        },

        name: {
            type: String,
            required: false,
            default: '',
        },
        phone: {
            type: String,
            required: false,
            default: '',
        },
        message: {
            type: String,
            required: false,
            default: '[',
        },
    },
    { timestamps: true }
);

const Contact = mongoose.model('Contact', ContactSchema);

module.exports = Contact;
