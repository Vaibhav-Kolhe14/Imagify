import express from 'express'
import { registerUser, loginUser, userCredits } from '../controller/userController.js'
import userAuth from '../middlewares/auth.js'

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/credits').post(userAuth, userCredits)

export default router

