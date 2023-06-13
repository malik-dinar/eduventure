const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { comparePassword, createAccessToken } = require("../utils/encrypt.util");
const User = require("../models/user");
const Tutor = require("../models/tutor");
const jwt = require("jsonwebtoken");
const { createConnection } = require("../services/tutor.service");


const userRegister = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory! ");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const tutors = await Tutor.find();
  const userId = user._id.toString()
  
  createConnection(tutors,userId);


  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "registerd succesfully" });
});

const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }

  const user = await User.findOne({ email });

  if (!user) {
    res.status(400);
    throw new Error("The email provided is not registered with any account");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Access denied");
  }

  const isPasswordMatch = await comparePassword({
    plainPassword: password,
    hashedPassword: user.password,
  });

  if (!isPasswordMatch) {
    res.status(400);
    throw new Error("Invalid Password");
  }

  const tokenParams = {
    username: user.username,
    email: user.email,
    id: user._id,
  };
  const accessToken = createAccessToken(tokenParams);

  return res
    .status(200)
    .json({ message: "user signin successfull", accessToken });
});

const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
  res.json({ message: "current user info " });
});

const getUser = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const user = await User.findById(userId);
  res.status(200).json(user);
});

const getUserCount = asyncHandler(async (req, res) => {
  let result = await User.count();
  res.status(200).json(result);
});

module.exports = {
  userRegister,
  userLogin,
  currentUser,
  getUser,
  getUserCount,
};
