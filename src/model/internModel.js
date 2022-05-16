const mongoose = require("mongoose");
let ObjectId = mongoose.Schema.Types.ObjectId;

const internSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },

        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true,
        },

        mobile: {
            type: String,
            unique: true,
            required: true,
            trim: true
        },

        collegeId: {
            type: ObjectId,
            ref: "college"
        },

        collegeName: {
            type: String,
            trim: true
        },

        isDeleted: {
            type: Boolean,
            default: false,
        },

    }, { timestamps: true }
);

module.exports = mongoose.model("Intern", internSchema);