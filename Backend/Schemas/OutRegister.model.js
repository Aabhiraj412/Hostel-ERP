import mongoose from "mongoose";

const OutRegisterSchema = new mongoose.Schema({

    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Hostler'
    },
    purpose: {
        type: String,
        required: true
    },
    out_time: {
        type: Date,
        required: true
    },
    in_time: {
        type: Date,
    }
},
{
    timestamps: true
});

const OutRegister = mongoose.model('OutRegister', OutRegisterSchema);

export default OutRegister;