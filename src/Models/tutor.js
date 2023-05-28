const mongoose = require("mongoose");

const tutorSchema = mongoose.Schema(
  {
    tutorname: {
      type: String,
      required: [true, "please add the user name"],
    },
    email: {
      type: String,
      required: [true, "please add the email address"],
      unique: [true, "Email already taken "],
    },
    password: {
      type: String,
      required: [true, "please add the user password"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tutor", tutorSchema);
