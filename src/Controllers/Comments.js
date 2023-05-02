const Comments = require("../Models/Report");
const asyncHandler = require("express-async-handler");

const comment = asyncHandler(async (req, res) => {
  try {
    const { courseId, videoId, comment } = req.body;
    console.log('4');
    const data = await Comments.findOne({ videoId });
    console.log("1");
    if (data) {
      (async (videoId, newData) => {
        await Comments.findOneAndUpdate(
          { videoId },
          { $push: { comments: newData } },
          { new: true }
        );
      })(videoId, comment);
    } else {
      console.log("2");
      const result = await Comments.create({
        courseId,
        videoId,
      });
      await Comments.findOneAndUpdate(
        { _id: result._id },
        { $push: { comments: comment } },
        { new: true }
      );
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = { comment };
