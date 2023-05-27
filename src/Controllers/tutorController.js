const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const Tutor = require("../models/tutorSchema");
const jwt = require("jsonwebtoken");
const { createConnection } = require("../services/tutor.service");

const tutorRegister = asyncHandler(async (req, res) => {
  const { tutorname, email, password } = req.body;
  console.log({ tutorname, email, password });
  if (!tutorname || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory! ");
  }
  const tutorAvailable = await Tutor.findOne({ email });
  if (tutorAvailable) {
    res.status(400);
    throw new Error("User Already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const tutor = await Tutor.create({
    tutorname,
    email,
    password: hashedPassword,
  });
  const users = await User.find();
  const tutorId = tutor._id.toString()
  
  createConnection(users,tutorId);
  if (tutor) {
    res.status(201).json({ _id: tutor.id, email: tutor.email });
  } else {
    res.status(400);
    throw new Error("User data is not valid");
  }
  res.json({ message: "registerd succesfully" });
});

const tutorLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const tutor = await Tutor.findOne({ email });
  //compare pass with hashed pass
  if (tutor && (await bcrypt.compare(password, tutor.password))) {
    const accessToken = jwt.sign(
      {
        tutor: {
          tutorname: tutor.tutorname,
          email: tutor.email,
          id: tutor.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("email or password not valid");
  }
  res.json({ message: "login succesfully" });
});

const getTutor = asyncHandler(async (req, res) => {
  const userId = req.query.userId;
  const user = await Tutor.findById(userId);
  res.status(200).json(user);
});

const getTutorCount = asyncHandler(async(req,res)=>{
  let result= await Tutor.count();
  res.status(200).json(result)
})

module.exports = { tutorRegister, tutorLogin, getTutor ,getTutorCount};
