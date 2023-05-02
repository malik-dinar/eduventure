const mongoose = require("mongoose");

const ReportComments = mongoose.Schema(
  {
    courseId: {
      type: String,
    },
    videoId:{
        type: String,
    },
    reports:{
      type:Array
    },
    comments:{
        type:Array
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("reportComments", ReportComments);
