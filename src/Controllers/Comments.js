const Comments = require("../Models/Report");
const asyncHandler = require("express-async-handler");

const comment = asyncHandler(async (req, res) => {
  try {
    const { courseId, videoId, comment, userId } = req.body;
    const data = await Comments.findOne({ videoId });
    const now = new Date();
    const date = now.toLocaleDateString();
    const time = now.toLocaleTimeString()
    if (data) {
      (async (videoId, newData) => {
        await Comments.findOneAndUpdate(
          { videoId },
          { $push: { comments: { data: newData, userId: userId, date:date+time  } } },
          { new: true }
        );
      })(videoId, comment);
    } else {
      const result = await Comments.create({
        courseId,
        videoId,
        userId,
        comments: [{ data: comment, userId: userId , date:date+time }],
      });
    }
  } catch (err) {
    console.log(err);
  }
});

const getComment = asyncHandler(async (req, res) => {
  const result = await Comments.find({
    $expr: { $gt: [{ $size: "$comments" }, 0] },
  });
  let response = [];
  for (id of result) {
    //let data =await getVideoDetails(id.courseId,id.videoId,id.comments);
    //response.push(data);
  }
});

module.exports = { comment, getComment };
