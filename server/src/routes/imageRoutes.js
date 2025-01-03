import express from 'express'
import { generateImage } from '../controller/imageController.js'
import userAuth from '../middlewares/auth.js'


const router = express.Router()

router.route('/generate-image').post(userAuth, generateImage)

export default router
