const Comments = require("../Models/Report");
const asyncHandler = require("express-async-handler");

const comment = asyncHandler(async (req, res) => {
  try {
    const { courseId, videoId, comment ,userId } = req.body;
    const data = await Comments.findOne({ videoId });
    if (data) {
      (async (videoId, newData) => {
        await Comments.findOneAndUpdate(
          { videoId },
          { $push: { comments:{data: newData , userId:userId} } } ,
          { new: true }
        );
      })(videoId, comment);
    } else {
      const result = await Comments.create({
        courseId,
        videoId,
        userId,
        comments: [{data: comment , userId:userId}],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = { comment };
