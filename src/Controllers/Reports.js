const Reports = require("../Models/Report");
const asyncHandler = require("express-async-handler");

const report = asyncHandler(async (req, res) => {
  try {
    const { courseId, videoId, report, userId } = req.body;
    const data = await Reports.findOne({ videoId });
    if (data) {
      (async (videoId, newData) => {
        await Reports.findOneAndUpdate(
          { videoId },
          { $push: { reports: {data: newData , userId:userId} } },
          { new: true }
        );
      })(videoId, report);
    } else {
      const result = await Reports.create({
        courseId,
        videoId,
        userId,
        reports: [{data: report , userId:userId}],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

// const getReport = asyncHandler(async () => {
//   try {
//     let result = await User.find({});
//     res.send(result);
//   } catch (err) {
//     console.log(err);
//   }
// });

module.exports = { report };
