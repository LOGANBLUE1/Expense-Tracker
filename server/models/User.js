const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    loginType: {
      type: String,
      enum: ['Direct', 'Google'], // Add more as needed
      default: 'Direct',
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true // Allows nulls for non-Google users
    },
    password: {
      type: String,
      required: function () {
        return this.loginType === 'Direct';
      }
    },
    additionalDetails: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Profile",
    },
    expenses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Expense",
      },
    ],
    token: {    // for reset password
      type: String,
    },
    resetPasswordExpires: {                 //token expiry time
      type: Date,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("User", userSchema);
