const asyncHandler = require("express-async-handler");
const Course = require("../Models/Course");
const { parseUrl } = require("@aws-sdk/url-parser");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { Hash } = require("@aws-sdk/hash-node");
const { formatUrl } = require("@aws-sdk/util-format-url");

const uuid = require("uuid");
require("dotenv").config();

const addVideo = async (req, res) => {
  try {
    const { id, title } = req.body;
    const videoUrl = req.file
      ? `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${req.file.key}`
      : null;

    const videoId = uuid.v4();
    const now = new Date();
    const videoAdded = await Course.updateOne(
      { _id: id },
      { $push: { videos: { _id: videoId, title: title, url: videoUrl , createdAt: now } } }
    );
    if (videoAdded) {
      res.status(201).json({ message: "course added successfully " });
    } else {
      res.status(400);
      throw new Error("video added failed");
    }
  } catch (err) {
    console.log(err);
  }
};

const getVideo = async (req, res) => {
  try {
    const courseId = req.query.id;
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ err: true, message: "Video Not found" });
    }
    const videoId=course.videos[0]?._id
    if(course.videos[0]?.url!==undefined){
      const s3ObjectUrl = parseUrl(course.videos[0].url);
      const presigner = new S3RequestPresigner({
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        },
        region: "eu-north-1",
        sha256: Hash.bind(null, "sha256"),
      });
      const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
      return res
        .status(200)
        .json({ message: "video fetched succesfully", data: formatUrl(url), videoId : videoId });
    }else{
      res.json({ message :"unaivailable"})
    }
  } catch (err) {
    console.log(err);
  }
};

const getVideoSwitch = async (req, res) => {
  try {
    const courseId = req.query.id;
    const videoId = req.query.video_id;
    const course = await Course.findOne({ _id: courseId });
    if (!course) {
      return res.status(404).json({ err: true, message: "Video Not found" });
    }

    const foundObject = course.videos.find((obj) => obj._id === videoId);
    const s3ObjectUrl = parseUrl(foundObject.url);
    const presigner = new S3RequestPresigner({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
      region: "eu-north-1",
      sha256: Hash.bind(null, "sha256"),
    });
    const url = await presigner.presign(new HttpRequest(s3ObjectUrl));
    return res
      .status(200)
      .json({ message: "video fetched succesfully", data: formatUrl(url), videoId : videoId  });
  } catch (err) {
    console.log(err);
  }
};

const getVideos = asyncHandler(async (req, res) => {
  try {
    const courseId = req.query.id;
    const courses = await Course.findOne({ _id: courseId });
    if (!courses) {
      return res.status(404).json({ err: true, message: "Course Not found" });
    } else {
      return res.send(courses);
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

const delteVideo = asyncHandler(async (req,res) => {
  try {
    const courseId = req.query.courseId;
    const videoId = req.query.videoId;
    console.log(courseId);
    console.log(videoId);
    let result =await Course.updateOne(
      { _id: courseId },
      { $pull: { videos: { _id: videoId } } }
    )
    console.log(result);
    if (result.modifiedCount!=0) {
      res.status(200).json({ message: "Video deleted successfully" });
    } else {
      res.status(404).json({ message: "Video not found" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = { addVideo, getVideo, getVideos, getVideoSwitch, delteVideo };
