import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import User from '../model/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


const registerUser = asyncHandler( async(req, res) => {
    try {
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.json({success: false, message: 'missing details'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword
        }

        const newUser = new User(userData)

        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.status(200).json({success: true, token, user: {name: user.name}})
    } catch (error) {
        console.log("error in register user")
        res.json({success: false, message: error.message})
    }
})

const loginUser = asyncHandler( async(req, res) => {
    try {
        const {email, password} = req.body
        const user = await User.findOne({email})

        if(!user) {
            return res.json({success: false, message: "user does not exist"})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if(isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token, user: {name: user.name}})
        } else {
            return res({success: false, message: "Invalid credentials"})
        }
    } catch (error) {
        console.log("Error in login user :: ", error)
        res.json({success: false, message: error.message})
    }
})

const userCredits = asyncHandler( async(req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId)

        res.json({success: true, credits: user.creditBalance, user: {name: user.name}})
    } catch (error) {
        console.log("Error in usercredits :: ", error)
        res.json({success: false, message: error.message})
    }
})


export { registerUser, loginUser, userCredits };
