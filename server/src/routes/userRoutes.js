import express from 'express'
import { registerUser, loginUser, userCredits, paymentRazorpay, verifyRazorpay } from '../controller/userController.js'
import userAuth from '../middlewares/auth.js'

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/credits').get(userAuth, userCredits)
router.route('/pay-razor').post(userAuth, paymentRazorpay)
router.route('/verify-razor').post(verifyRazorpay)

export default router

