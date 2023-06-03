const asyncHandler = require("express-async-handler");
const User = require("../models/user");
const Tutor = require("../models/tutor");

const userBlock = asyncHandler(async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
      },
    });
    res.status(200).json({message : "blocked successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
});

const userUnBlock = asyncHandler(async (req,res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: true,
      },
    });
    res.status(200).json({message : "unblocked successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
});


const tutorBlock = asyncHandler(async (req, res) => {
  try {
    await Tutor.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: false,
      },
    });
    res.status(200).json({message : "blocked successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
});

const tutorUnBlock = asyncHandler(async (req,res) => {
  try {
    await Tutor.findByIdAndUpdate(req.params.id, {
      $set: {
        isActive: true,
      },
    });
    res.status(200).json({message : "unblocked successfully"});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "server Error" });
  }
});

module.exports = { userBlock, userUnBlock , tutorBlock , tutorUnBlock};
