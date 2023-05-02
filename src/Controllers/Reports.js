const Reports = require("../Models/Report");
const asyncHandler = require("express-async-handler");

const report = asyncHandler(async (req, res) => {
  try {
    const { courseId, videoId, report } = req.body;
    const data = await Reports.findOne({ videoId });
    if (data) {
      (async (videoId, newData) => {
        await Reports.findOneAndUpdate(
          { videoId },
          { $push: { reports: newData } },
          { new: true }
        );
      })(videoId, report);
    } else {
      const result = await Reports.create({
        courseId,
        videoId,
        report: [],
      });
      await Reports.findOneAndUpdate(
        { _id: result._id },
        { $push: { reports: report } },
        { new: true }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = { report };
