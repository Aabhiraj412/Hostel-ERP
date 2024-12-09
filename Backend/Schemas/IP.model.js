import mongoose from 'mongoose';

const IPSchema = new mongoose.Schema({
    ip: {
        type: String,
        required: true,
    }
});

const IP = mongoose.model('IP', IPSchema);
export default IP;