import mongoose from 'mongoose';

// Define the schema for advertisement
const advertisementSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    location: {
        type: String,
        required: [true, 'Location is required'],
        trim: true,
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
        default: Date.now,
    },
    promotionType: {
        type: String,
        required: [true, 'Type of promotion is required'],
        trim: true,
    },
    contact: {
        type: String,
        required: [true, 'Contact number is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the model or use the existing one
const Advertisement = mongoose.models.Advertisement || mongoose.model('Advertisement', advertisementSchema);

export default Advertisement; 