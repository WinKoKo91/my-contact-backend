
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bCrypt = require("bcrypt");
const jwt = require("jsonwebtoken")
const validator = require('validator');


const registerUser = asyncHandler(async (req, res) => {
    
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!")
    }

    if(!validator.isEmail(email)) {
        res.status(400);
        throw new Error("Invalidate email format")
    }
    const userAvaliable = await User.findOne({ email });

    if (userAvaliable) {
        res.status(400)
        throw new Error("User already registered!");
    }

    const hashedPassword = await bCrypt.hash(password, 10);

    try{
        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
        })
        console.log(`User created ${newUser}`)

        if (newUser) {
            res.status(201).json(newUser);
        } else {
            res.status(400);
            throw new Error("User data is not valid")
        }
    }catch(e){
        res.status(400);
        throw new Error( e.message);
    }
   

  

})



const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400);
        throw new Error("All fields are mandatory!")
    }

    const user = await User.findOne({ email });
    if (user && (await bCrypt.compare(password, user.password))) {
        const accessToken = jwt.sign(
            {
                user: {
                    username: user.username,
                    email: user.email,
                    id: user.id,
                }
            },
            process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: "1h" }
        )

        res.status(200).json({ message: "success", token: accessToken });
    }else{
        res.status(401)
        throw new Error("Email or password is not valid");
    }

})

const currentUser= asyncHandler(async (req, res)=>{
    res.status(200).json(req.user)
});

module.exports = { registerUser,loginUser ,currentUser}