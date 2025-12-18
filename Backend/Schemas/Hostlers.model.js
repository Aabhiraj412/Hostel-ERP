import mongoose from "mongoose";

const HostlerSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    roll_no:{                  //unique User ID
        type: String,
        required: true
    },
    aadhar:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        enum: ["male", "female", "other" ],
        required: true
    },
    fathers_name:{
        type: String,
        required: true
    },
    mothers_name:{
        type: String,
        required: true
    },
    phone_no:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    year:{
        type: String,
        required: true
    },
    college:{
        type: String,
        required: true
    },
    hostel:{
        type: String,
        required: true
    },
    room_no:{
        type: String,
        required: true
    },
    temp_pass:{
        type: String,
        required: true
    },

    password:{
        type: String,
        required: true
    },

    date_of_birth:{
        type: String,
        required: true
    },
    blood_group:{
        type: String,
    },
    local_guardian:{
        type: String,
        required: true
    },
    local_guardian_phone:{
        type: String,
        required: true
    },
    local_guardian_address:{
        type: String,
        required: true
    },
    fathers_no:{
        type: String,
        required: true
    },
    mothers_no:{
        type: String,
        required: true
    },
    fathers_email:{
        type: String,
        required: true
    },
    mothers_email:{
        type: String,
        required: true
    },
    course:{
        type: String,
        required: true
    },
    branch:{
        type: String,
        required: true
    },
    
    private_grivance:[{
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
