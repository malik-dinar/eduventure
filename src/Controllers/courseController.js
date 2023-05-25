const asyncHandler = require("express-async-handler");
const Course = require("../models/course");
const Reports = require("../models/report");
const cloudinary = require("cloudinary").v2;
const Category = require("../models/courseCategory");
const { getTrendingVideos } = require("../services/course.service");

const AddCourse = asyncHandler(async (req, res) => {
  try {
    const { courseName, description, tutorId, category, additionalInfo } =
      req.body;
    if (!courseName || !description || !tutorId || !category) {
      res.status(400);
      throw new Error("All fields are mandatory!... ");
    }

    const courseAvailable = await Course.findOne({ courseName });
    if (courseAvailable) {
      res.status(400);
      throw new Error("Course name Already exists");
    }

    const base64String = req.file.buffer.toString("base64");
    const img = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        public_id: courseName,
        resource_type: "image",
        folder: "Thumbnails",
        context: {
          courseName: courseName,
        },
        tags: courseName,
      }
    );

    const course = await Course.create({
      tutorId: tutorId,
      courseName: courseName,
      description: description,
      additionalInfo: additionalInfo,
      category: category,
      path: img.secure_url,
    });

    if (course) {
      res.status(201).json({ message: "course added successfully " });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (err) {
    console.log(err);
  }
});

const getCategory = async (req, res) => {
  try {
    const result = await Category.find();
    res.json({ result });
  } catch (err) {
    console.log(err);
  }
};

const getCourse = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const course = await Course.find({ tutorId: id });
  res.status(200).json(course);
});

const trendingCourse = async (req, res) => {
  const result = await Reports.aggregate([
    {
      $project: {
        courseId: 1,
        comments: { $size: "$comments" },
      },
    },
    {
      $sort: { comments: -1 },
    },
    {
      $limit: 3,
    },
  ]);

  let response = [];
  await Promise.all(
    result.map(async (element) => {
      let id = element.courseId;
      let add = await Course.find({ _id: id });
      response.push(add);
    })
  );
  res.send(response);
};

module.exports = { AddCourse, getCategory, getCourse, trendingCourse };
