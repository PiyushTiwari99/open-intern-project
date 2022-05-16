const mongoose = require('mongoose');

const collegeSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        unique: true,
        lowercase: true,
        required: true,
    },

    fullName: {
        type: String,
        trim: true,
        required: true,
    },

    logoLink: {
        type: String,
        trim: true,
        required: true,
    },

    isDeleted: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true });


module.exports = mongoose.model('college', collegeSchema)