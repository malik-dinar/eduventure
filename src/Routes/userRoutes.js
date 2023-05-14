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

router.get("/video", validateToken ,getVideo);

router.get("/videos", validateToken, getVideos);

router.get("/video-switch", validateToken, getVideoSwitch);

router.get("/all-course", validateToken, getAllCourse);

router.post("/report", validateToken, report);

router.get("/report", validateToken, getReport);

router.post("/comment", validateToken, comment);

router.get("/comment", validateToken, getComment);

module.exports = router;
