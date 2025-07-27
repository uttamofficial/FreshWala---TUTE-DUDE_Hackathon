const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    phone: {
        type: Number
    },
    role: {
        type: String,
        enum: ["seller", "user", "admin"],
        default: "user",
    },
    address: {
        type: String,
        trim: true,
    },
    bussinessName: {
        type: String,
        trim: true,
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
    profilePhoto: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/previews/032/176/197/non_2x/business-avatar-profile-black-icon-man-of-user-symbol-in-trendy-flat-style-isolated-on-male-profile-people-diverse-face-for-social-network-or-web-vector.jpg",
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
