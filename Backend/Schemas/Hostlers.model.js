import mongoose from "mongoose";
import { moveEmitHelpers } from "typescript";

const HostlerSchema = new mongoose.Schema({

    name:{
        type: string,
        required: true
    },
    roll_no:{                  //unique User ID
        type: string,
        required: true
    },
    aadhar:{
        type: string,
        required: true
    },
    gender:{
        type: string,
        enum: ["male", "female", "other" ],
        required: true
    },
    fathers_name:{
        type: string,
        required: true
    },
    mothers_name:{
        type: string,
        required: true
    },
    phone_no:{
        type: string,
        required: true
    },
    email:{
        type: string,
        required: true
    },
    address:{
        type: string,
        required: true
    },
    year:{
        type: string,
        required: true
    },
    college:{
        type: string,
        required: true
    },
    hostel:{
        type: string,
        required: true
    },
    room_no:{
        type: string,
        required: true
    },

    password:{
        type: string,
        required: true
    },

    date_of_birth:{
        type: string,
        required: true
    },
    blood_group:{
        type: string,
    },
    local_guardian:{
        type: string,
        required: true
    },
    local_guardian_phone:{
        type: string,
        required: true
    },
    local_guardian_address:{
        type: string,
        required: true
    },
    fathers_no:{
        type: string,
        required: true
    },
    mothers_no:{
        type: string,
        required: true
    },
    fathers_email:{
        type: string,
        required: true
    },
    mothers_email:{
        type: string,
        required: true
    },
    course:{
        type: string,
        required: true
    },
    branch:{
        type: string,
        required: true
    },
    
    privete_grivance:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Private Grivance'
    }],
    public_grivance:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Public Grivance'
    }],
    outregister:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Out Register'
    }],
    Leave:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Leave'
    }],
    present_on: [{
        type: Date,
        required: true
    }],
    absent_on: [{
        type: Date,
        required: true
    }],


},
    {timestamps: true}
)

const Hostler = mongoose.model('Hoslter', HostlerSchema);

export default Hostler;
