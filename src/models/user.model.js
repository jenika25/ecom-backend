const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { hashPassword } = require("../utils/password");
const { ROLE_LIST } = require("../constants/roles");

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, maxlength: 60 },
    email1: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    phone: { type: String, match: [/^(\+91\d{9})$/] },
    role: {
      type: String,
      enum: ["seller", "admin", "user"],
      default: "user",
      index: true,
    },
    isActive: { type: Boolean, default: true },
    slug: { type: String },
    labels: { type: String },
    address: [
      {
        fullName: String,
        phone: String,
        line1: String,
        line2: String,
        city: String,
        state: String,
        pincode: String,
        isDefault: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
});

userSchema.methods.isPasswordCorrectPlain = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
