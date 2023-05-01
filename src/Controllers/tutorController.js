const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
// const User = require('../Models/userSchema');
const Tutor = require('../Models/tutorSchema');
const jwt = require("jsonwebtoken");
const { use } = require("../Routes/userRoutes");

const tutorRegister = asyncHandler(async (req, res) => {
    const { tutorname, email, password} = req.body;
    console.log({ tutorname, email, password});
    if(!tutorname || !email || !password){
        res.status(400);
        throw new Error("All fields are mandatory! ")
    }
    const tutorAvailable = await Tutor.findOne( {email} )
    if(tutorAvailable){
       res.status(400);
       throw new Error("User Already exists")
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const tutor = await Tutor.create({                                            
        tutorname,
        email,
        password: hashedPassword,
    });
    console.log(`User created ${tutor}`);
    if(tutor){
        res.status(201).json({_id: tutor.id, email: tutor.email })
    }else{
        res.status(400);
        throw new Error("User data is not valid")
    }
  res.json({ message: "registerd succesfully" });
});


const tutorLogin = asyncHandler(async (req,res)=>{
    console.log('tutor login');
    const { email , password } = req.body;
    if(!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory")
    }
    const tutor = await Tutor.findOne({ email });
    //compare pass with hashed pass
    if(tutor && (await bcrypt.compare(password, tutor.password))){
        console.log(tutor);
        const accessToken = jwt.sign({
            tutor:{
                tutorname:tutor.tutorname,
                email:tutor.email,
                id:tutor.id
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



module.exports = { tutorRegister, tutorLogin }   