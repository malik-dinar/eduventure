const User = require("../Models/userSchema");
const Tutor = require("../Models/tutorSchema");
const asyncHandler = require("express-async-handler");

const searchStudents =asyncHandler(async (req, res) => {
    let result = await User.find({
        "$or":[
            {
                username:{$regex:req.params.key}
            },
            {
                email:{$regex:req.params.key}       
            }
        ]
    });
    res.send(result)
})

const searchTutors =asyncHandler(async (req, res) => {
    let result = await Tutor.find({
        "$or":[
            {
                username:{$regex:req.params.key}
            },
            {
                email:{$regex:req.params.key}       
            }
        ]
    });
    res.send(result)
})

module.exports = { searchStudents ,searchTutors}
