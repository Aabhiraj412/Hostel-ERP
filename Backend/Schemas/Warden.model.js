import mongoose from "mongoose";

const WardenSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    aadhar: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        required: true
    },
    hostel:{
        type: String,
        required: true
    },
    post: {
        type: String,
        enum: ['Chief Warden','Nights Warden','Day Warden'],
        required: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
},
{
    timestamps: true
});

const Warden = mongoose.model('Warden', WardenSchema);

export default Warden;