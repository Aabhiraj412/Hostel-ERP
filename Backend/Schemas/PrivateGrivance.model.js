import mongoose from "mongoose";

const PrivateGrivanceSchema = new mongoose.Schema({
    
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hostler'
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    upvote:{
        type: Number,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved', 'Cancelled'],
        required: true
    }
},
{
    timestamps: true
});

const PrivateGrivance = mongoose.model('PrivateGrivance', PrivateGrivanceSchema);

export default PrivateGrivance;