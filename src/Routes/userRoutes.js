const express = require("express");
const {
  userRegister,
  userLogin,
  currentUser,
  getUser,
  getUserCount,
} = require("../controllers/userController");

const validateToken = require("../middleware/validateToken");

const {
  getCategory,
  getCourseList,
  getAllCourse,
} = require("../controllers/courseCategoryController");

const {
  getVideo,
  getVideos,
  getVideoSwitch,
} = require("../controllers/videoController");
const { report, getReport } = require("../controllers/reportsController");
const { comment, getComment } = require("../controllers/commentsController");
const { trendingCourse } = require("../controllers/courseController");
const { getTotalLikesForVideo, toggleLikeStatus } = require("../controllers/likeController");

const router = express.Router();

router.post("/register", userRegister);

router.post("/login", userLogin);

router.get("/current", validateToken, currentUser);

router.get("/", getUser);

router.get("/count", getUserCount);

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

router.get("/trending", trendingCourse);  

router.get("/like", toggleLikeStatus);

router.get("/total-likes", getTotalLikesForVideo);

module.exports = router;
