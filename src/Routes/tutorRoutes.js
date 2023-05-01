const express = require('express');
const { tutorRegister,tutorLogin } = require('../Controllers/tutorController');
const { AddCourse , getCategory, getCourse } = require('../Controllers/courseController');
const multer = require("multer");
const { addVideo, getVideos, delteVideo } = require('../Controllers/videoController');
const { uploadVideo } = require('../Utils/multer');


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
    limits: { fileSize: 1000000000 }
});


router.post('/register', tutorRegister )
router.post("/login", tutorLogin);

router.post('/course', upload.single('image') , AddCourse)
router.get('/category', getCategory )

router.get('/course/:id', getCourse )

router.post('/video', function (req, res, next) {
    uploadVideo(req, res, function (err) {
      if (err) {
        // handle the error here
        console.log(err);
        return res.status(400).json({ message: 'Error uploading video' });
      }
      next();
    });
}, addVideo);


router.get('/videos' , getVideos );

router.delete('/video', delteVideo)



module.exports = router;