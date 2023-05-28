const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const Tutor = require("../models/tutor");
const jwt = require("jsonwebtoken");

const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const user = await User.findOne({ email });
  if (user.admin) {
    if (user && (await bcrypt.compare(password, user.password))) {
      const accessToken = jwt.sign(
        {
          user: {
            username: user.username,
            email: user.email,
            id: user.id,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.status(200).json({ accessToken });
    }
  } else {
    res.status(401);
    throw new Error("email or password not valid");
  }
  res.json({ message: "login succesfully" });
});

const getUSers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 6 } = req.query;
  try {
    const users = await User.find({ admin: { $ne: true } })
    .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await User.countDocuments();

    res.status(200).json({
      users,
      totalPages: Math.ceil(count/limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

const getTutors = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const tutors = await Tutor.find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    const count = await Tutor.countDocuments();

    res.status(200).json({
      tutors,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "server Error" });
  }
});

module.exports = { adminLogin, getUSers, getTutors };
