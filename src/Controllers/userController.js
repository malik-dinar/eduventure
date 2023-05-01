const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const User = require('../Models/userSchema');
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoutes");

const userRegister = asyncHandler(async (req, res) => {
    const { username, email, password} = req.body;
    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory! ")
    }
    const userAvailable = await User.findOne( {email} )
    if(userAvailable){
       res.status(400);
       throw new Error("User Already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,   
        email,
        password: hashedPassword
    });
    if(user){
        res.status(201).json({_id: user.id, email: user.email })
    }else{
        res.status(400);
        throw new Error("User data is not valid")
    }
  res.json({ message: "registerd succesfully" });
});

const userLogin = asyncHandler(async (req,res)=>{
    const { email , password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const user = await User.findOne({ email });
    if(!user.isActive){
        res.status(401)
        throw new Error("User is blocked contanct help line for more details")
    }
    else if(user && (await bcrypt.compare(password, user.password))){
        const accessToken = jwt.sign({
            user:{
                username:user.tutorname,
                email:user.email,
                id:user.id
            },
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "15m"}
        );
        res.status(200).json({ accessToken })
    }else{
        res.status(401)
        throw new Error("email or password not valid")
    }

    res.json({message:"login succesfully"})
});

const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user)
    res.send({message:"current user info "})
});

module.exports = { userRegister, userLogin , currentUser }   