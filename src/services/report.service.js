const asyncHandler = require("express-async-handler");
const Course = require("../models/course");
const { parseUrl } = require("@aws-sdk/url-parser");
const { HttpRequest } = require("@aws-sdk/protocol-http");
const { S3RequestPresigner } = require("@aws-sdk/s3-request-presigner");
const { Hash } = require("@aws-sdk/hash-node");
const { formatUrl } = require("@aws-sdk/util-format-url");

const getVideoDetails = asyncHandler(async (courseId, videoId ,report) => {
  const course = await Course.findOne({ _id: courseId });
  if (!course) {
    return res.status(404).json({ err: true, message: "Video Not found" });
  }
  if(course.videos.length===0){
    return;            
  }
  const foundObject = course.videos.find((obj) => obj._id === videoId);
  const title = foundObject.title;
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
  return {
    data: formatUrl(url),
    courseId:courseId,
    videoId: videoId,
    title: title,
    reports: report
  }
});

module.exports = { getVideoDetails };
