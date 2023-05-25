const Comments = require("../models/report");
const asyncHandler = require("express-async-handler");
const moment = require('moment');

const comment = asyncHandler(async (req, res) => {
  try {
    const { courseId, videoId, comment, userId, userName } = req.body;
    const data = await Comments.findOne({ videoId });
    const now = new Date();
    const date =   moment(now).format('MM/DD/YYYY h:mm:ss a');
    if (data) {
      (async (videoId, newData) => {
        await Comments.findOneAndUpdate(
          { videoId },
          {
            $push: {
              comments: { data: newData, userName:userName , userId: userId, date: date },
            },
          },
          { new: true }
        );
        res.send({message:"comment added successfully"})
      })(videoId, comment);
    } else {
      const result = await Comments.create({
        courseId,
        videoId,
        userId,
        comments: [{ data: comment, userName:userName ,userId: userId, date: date }],
      });
      res.send({message:"comment added successfully"})
    }
  } catch (err) {
    console.log(err);
  }
});

const getComment = asyncHandler(async (req, res) => {
  const courseId = req.query.courseId;
  const videoId = req.query.videoId;
  const result = await Comments.find({courseId:courseId , videoId:videoId});
  res.send(result)
});

module.exports = { comment, getComment };
