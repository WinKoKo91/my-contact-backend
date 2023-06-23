const asyncHandler = require("express-async-handler")
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {

    let token;
    let authHeader = req.headers.authorization || req.headers.Authorization

    try{
        if (authHeader && authHeader.startsWith("Bearer")) {
            token = authHeader.split(" ")[1];
            if(!token){
                res.status(400)
                throw new Error("User is not authorized or token is missing")
            }
    
    
            jwt.verify(token, process.env.ACCESS_TOKEN_SECERT, (err, decoded) => {
                if (err) {
                    res.status(401)
                    throw new Error("User is not authorized")
                }
                req.user = decoded.user;
                next();
            })
    
           
        }
    }catch (e){
        res.status(401)
        throw new Error( e.message);
    }
    

});

module.exports = validateToken;