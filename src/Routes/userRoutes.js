const express = require("express");
const {
  userRegister,
  userLogin,
  currentUser,
  getUser,
} = require("../controllers/userController");

const validateToken = require("../middleware/validateTokenHandler");

const {
  getCategory,
  getCourseList,
  getAllCourse,
} = require("../controllers/courseCategory");

const {
  getVideo,
  getVideos,
  getVideoSwitch,
} = require("../controllers/videoController");
const { report, getReport } = require("../controllers/reports");
const { comment, getComment } = require("../controllers/comments");
const { trendingCourse } = require("../controllers/courseController");

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/current", validateToken, currentUser);

router.get('/', getUser)

router.get("/category", getCategory);

router.get("/course-list", getCourseList);

router.get("/video" ,getVideo);

router.get("/videos", getVideos);

router.get("/video-switch", getVideoSwitch);

router.get("/all-course", getAllCourse);

router.post("/report", report);

router.get("/report", getReport);

router.post("/comment", comment);

router.get("/comment", getComment);

router.get("/trending", trendingCourse);

module.exports = router;
