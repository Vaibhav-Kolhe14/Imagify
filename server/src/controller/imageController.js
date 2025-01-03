import ApiResponse from '../utils/ApiResponse.js'
import ApiError from '../utils/ApiError.js'
import asyncHandler from '../utils/asyncHandler.js'
import User from '../model/userModel.js'
import FormData from 'form-data'
import axios from 'axios'

export const generateImage = asyncHandler( async (req, res) => {
    try {
        const {userId, prompt} = req.body

        const user = await User.findById(userId)

        if(!user || !prompt) {
            return res.json({success: false, message: 'Missing Details'})
        }

        if(user.creditBalance === 0 || User.creditBalance < 0) {
            return res.json({success: false, message: 'No Credit Balance', creditBalance: user.creditBalance})
        }

        const formData = new FormData()
        formData.append('prompt', prompt)

        const { data } = await axios.post(process.env.CLIPDROP_ENDPOINT, formData, {
            headers: {
                'x-api-key': process.env.CLIPDROP_APi,
            },
            responseType: 'arraybuffer'
        })

        const base64Image = Buffer.from(data, 'binary').toString('base64')
        const resultImage = `data:image/png;base64,${base64Image}`
        await User.findByIdAndUpdate(user._id, { creditBalance: user.creditBalance - 1 })
        res.json({success: true, message: 'Image Generated', creditBalance: user.creditBalance - 1, resultImage})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
})

