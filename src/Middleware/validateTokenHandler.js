const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");


const validateToken = asyncHandler(async(req,res,next)=>{
    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization;
    if(authHeader && authHeader.startsWith('Bearer')){
        token = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,  (err,decoded)=>{
            if(err){
                res.status(401);
                throw new Error("User not authorized");
            }
            req.user = decoded.user;
            next();
        });
    }

    if(!token){
        res.status(401)
        throw new Error("Invalid token or user is not authorized")
    }
})

module.exports = validateToken;