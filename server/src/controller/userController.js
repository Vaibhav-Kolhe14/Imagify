import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import User from '../model/userModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import razorpay from 'razorpay'
import Transaction from '../model/transactionModel.js'

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

const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
})

const paymentRazorpay = asyncHandler( async(req, res) => {
    try {
        const {userId, planId} = req.body
        
        const userData = await User.findById(userId)

        if(!userData || !planId) {
            return res.json({success: false, message: "Missing Details"})
        }

        let credits, plan, amount, date

        switch(planId) {
            case 'Basic':
                plan = 'Basic'
                credits = 100
                amount = 10
                break;
            case 'Advanced': 
                plan = 'Advanced'
                credits = 500
                amount = 50
                break;
            case 'Business': 
                plan = 'Business'
                credits = 5000
                amount = 250
                break;
            default:
                return res.json({success: false, message: 'Plan Not Found'})
        }

        date = Date.now();
        const transactionData = {
            userId, plan, amount, credits, date
        }

        const newTransaction = await Transaction.create(transactionData)

        const options = {
            amount: amount * 100,
            currency: process.env.CURRENCY,
            receipt: newTransaction._id
        }

        await razorpayInstance.orders.create(options, (error, order)=> {
            if(error) {
                console.log(error)
                return res.json({success: false, message: error})
            }

            res.json({success: true, order})
        })
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
})

const verifyRazorpay = asyncHandler( async(req, res) => {
    try {
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid') {
            const transactionData = await Transaction.findById(orderInfo.receipt)
            if(transactionData.payment) {
                return res.json({success: false, message: "Payment Failed"})
            }

            const userData = await User.findById(transactionData.userId)
            const creditBalance = userData.creditBalance + transactionData.credits
            await User.findByIdAndUpdate(userData._id, {creditBalance})

            await Transaction.findByIdAndUpdate(transactionData._id, {payment: true})

            res.json({success: true, message: 'Credits Added'})
        } else {
            res.json({success: false, message: 'Payment Failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
})

export { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay };
