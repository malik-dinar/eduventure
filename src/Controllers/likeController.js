const Like = require("../models/report");
const asyncHandler = require("express-async-handler");

const toggleLikeStatus = asyncHandler(async (req, res) => {
  const videoId = req.query.videoId;
  const userId = req.query.userId;
  const courseId = req.query.courseId;

  const videoAvailable = await Like.findOne({ videoId });
  const like = await Like.findOne({
    videoId,
    likes: {
      $elemMatch: { userId },
    },
  });
  if (videoAvailable && like) {
    const result = like.likes.find((r) => r.userId === userId);
    const likeValueToUpdate = !result.like;
    const userIdToUpdate = userId;

    await Like.updateOne(
      { videoId: videoId },
      { $set: { "likes.$[elem].like": likeValueToUpdate } },
      { arrayFilters: [{ "elem.userId": userIdToUpdate }] }
    );
    res.json({ message: "Like updated successfully" });
  }

  if (!videoAvailable) {
    const like = new Like({
      courseId,
      videoId,
      likes: { userId, like: true },
    });
    const result = await like.save();
    res.json({ message: "like successfully" });
  }

  if (videoAvailable && !like) {
    try {
      const like = await Like.updateOne(
        { courseId, videoId },
        { $push: { likes: { userId: userId, like: true } } }
      );
      res.json({ message: "like new" });
    } catch (err) {
      console.log(err.message);
    }
  }
});

const getTotalLikesForVideo = asyncHandler(async (req, res) => {
  const videoId = req.query.videoId;
  const courseId = req.query.courseId;
  const result = await Like.aggregate([
    { $match: { courseId: courseId, videoId: videoId } },
    { $unwind: "$likes" },
    { $match: { "likes.like": true } },
  ]);
  res.json({
    message: "The number of likes for that video",
    like: result.length,
  });
});

const likeStatus = asyncHandler(async (req, res) => {
  const videoId = req.query.videoId;
  const userId = req.query.userId;

  const videoAvailable = await Like.findOne({ videoId });

  if (videoAvailable) {
    const result = videoAvailable.likes.find((r) => r.userId === userId);
    if (!result) {
      res.json({ message: "like status", like: false });
    } else {
      res.json({ message: "like status", like: result.like });
    }
  } else {
    res.json({ message: "like status", like: false });
  }
});

module.exports = { toggleLikeStatus, getTotalLikesForVideo, likeStatus };
