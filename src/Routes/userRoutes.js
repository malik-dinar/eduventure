const express = require("express");
const {
  userRegister,
  userLogin,
  currentUser,
} = require("../Controllers/userController");

const validateToken = require("../Middleware/validateTokenHandler");

const {
  getCategory,
  getCourseList,
  getAllCourse,
} = require("../Controllers/courseCategory");

const {
  getVideo,
  getVideos,
  getVideoSwitch,
} = require("../Controllers/videoController");
const { report, getReport } = require("../Controllers/Reports");
const { comment, getComment } = require("../Controllers/Comments");

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/current", validateToken, currentUser);

router.get("/category", getCategory);

router.get("/course-list", getCourseList);

router.get("/video", getVideo);

router.get("/videos", getVideos);

router.get("/video-switch", getVideoSwitch);

router.get("/all-course", getAllCourse);

router.post("/report", report);

router.get("/report", getReport);

router.post("/comment", comment);

router.get("/comment", getComment);

module.exports = router;
