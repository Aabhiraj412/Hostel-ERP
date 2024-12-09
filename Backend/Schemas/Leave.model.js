import mongoose from "mongoose";

const LeaveSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hostler'
    },
    days: {
        type: Number,
        required: true
    },
    from: {
        type: Date,
        required: true
    },
    to: {
        type: Date,
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    contact_no: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Rejected'],
        required: true
    }
},
{
    timestamps: true
});

const Leave = mongoose.model('Leave', LeaveSchema);

export default Leave;