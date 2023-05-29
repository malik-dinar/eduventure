const mongoose = require("mongoose");

const CourseSchema = mongoose.Schema(
  {
    courseName: {
      type: String,
    },
    tutorId:{
        type: String,
    },
    description: {
      type: String,
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
      type:Array,
    },
    isDeleted:{
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Courses", CourseSchema);
