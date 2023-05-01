const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
      required: [true, "please add the category name"],
    },
    tutorId:{
        type: String,
    },
    description: {
      type: String,
      required: [true, "please add the category description"],
    },
    path:{
        type: String
    },
    category:{
        type: String
    },
    additionalInfo:{
        type: String
    },
    rating:{
        type: Number,
        default: 0
    },
    views:{
        type : Number,
        default:0
    },
    videos:{
      type:Array
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Courses", CourseSchema);
