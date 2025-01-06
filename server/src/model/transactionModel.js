import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    plan: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    credits: {
        type: Number,
        required: true
    },
    payment: {
        type: Boolean,
        default: false
    },
    date: {
        type: Number
    }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction;