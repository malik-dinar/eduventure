const mongoose = require("mongoose");

const CourseCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please add the category name"],
    },
    description: {
      type: String,
      required: [true, "please add the category description"],
    },
    path:{
        type: String
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Course category", CourseCategorySchema);
