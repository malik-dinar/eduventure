const express = require('express');
const { userBlock, userUnBlock, tutorBlock, tutorUnBlock } = require('../controllers/activeController');
const { adminLogin, getUSers, getTutors } = require('../controllers/adminController');
const { addCategory } = require('../controllers/courseCategory');
const { searchStudents, searchTutors } = require('../controllers/searchController');
const multer = require("multer");
const cloudinary = require("cloudinary").v2;


const router = express.Router();

// Configuration 
cloudinary.config({
    cloud_name: "dd8vgf5yn",
    api_key: "315231498881135",
    api_secret: "06ZFNHr8ADYFexrl2629kJl14jc"
});
//configur multer
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }
});


// admin login
router.post("/login", adminLogin);

// get users and tutors
router.get("/students", getUSers );
router.get("/tutors", getTutors );

// block and unblock
router.put('/block/:id', userBlock);
router.put('/un-block/:id', userUnBlock);
router.put('/block/tutor/:id', tutorBlock);
router.put('/un-block/tutor/:id', tutorUnBlock);

// search 
router.get('/search/:key', searchStudents );
router.get('/searchTutor/:key', searchTutors )

//add course category
router.post('/category', upload.single('coursePath') , addCategory );



module.exports = router;