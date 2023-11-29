const mongoose = require('mongoose');

const ClickSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            // unique: true,
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email',
            ],
        },
        month: {
            type: String,
            required: true,
            default: '',
        },
        ClickCount: {
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
);

const Click = mongoose.model('Click', ClickSchema);

module.exports = Click;
