import mongoose from "mongoose";

const PublicGrivanceSchema = new mongoose.Schema({
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
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Resolved', 'Cancelled'],
        required: true
    },
    upvotes: [{
        type: mongoose.Schema.Types.ObjectId,
    }]
},
{
    timestamps: true
});

const PublicGrivance = mongoose.model('PublicGrivance', PublicGrivanceSchema);

export default PublicGrivance;