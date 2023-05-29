const asyncHandler = require("express-async-handler");
const Course = require("../models/course");
const cloudinary = require("cloudinary").v2;
const User = require("../models/user");
const Category = require("../models/courseCategory");

const addCategory = asyncHandler(async (req, res) => {
  try {
    const { CategoryName, Description } = req.body;

    if (!CategoryName || !Description) {
      res.status(400);
      throw new Error("All fields are mandatory! ");
    }

    const courseAvailable = await User.findOne({ CategoryName });
    if (courseAvailable) {
      res.status(400);
      throw new Error("Course Already exists");
    }

    const base64String = req.file.buffer.toString("base64");
    const result = await cloudinary.uploader.upload(
      `data:${req.file.mimetype};base64,${base64String}`,
      {
        public_id: CategoryName,
        resource_type: "image",
        folder: "CategoryImages",
        context: {
          categoryName: CategoryName,
        },
        tags: CategoryName,
      }
    );

    const courseCategory = await Course.create({
      name: CategoryName,
      description: Description,
      path: result.secure_url,
    });

    if (courseCategory) {
      res.status(201).json({ message: "course category added successfully " });
    } else {
      res.status(400);
      throw new Error("User data is not valid");
    }
  } catch (err) {
    console.log(err);
  }
});

const getCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const CourseCategory = await Category.find()
    .limit(limit)
    .skip((page - 1) * limit)
    .exec();

  const count = await Category.countDocuments();
  res.status(200).json({
    CourseCategory,
    totalPages: Math.ceil(count / limit),
    currentPage: page,
  });
});

const getCourseList = async (req, res) => {
  try {
    const courses = req.query.category;
    const course = await Course.find({ category: courses });
    if (!course) {
      return res.status(404).json({ err: true, message: "No Course Found" });
    }
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

const getAllCourse = async (req, res) => {
  try {
    const course = await Course.find({isDeleted: {$ne:true}});
    if (!course) {
      return res.status(404).json({ err: true, message: "No Course Found" });
    }
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

module.exports = { addCategory, getCategory, getCourseList, getAllCourse };
