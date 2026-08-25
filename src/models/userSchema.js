const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 2,
        maxLength: 50,
        required: true
    },

    email: {
        type: String,
        minLength: 8,
        maxLength: 16,
        unqiue: true,
        lowercase: true,
        required: true, 
    },

    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 8,
    },

    phone: {
        type: Integer,
        maxLength: 10,
    },

    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user",
        index: true,
    },
    profilephoto: {
        type: File,
    },

    addresses: {
        label: {
            type: String,
        }
    }
})

module.exports = mongoose.model("User", userSchema);