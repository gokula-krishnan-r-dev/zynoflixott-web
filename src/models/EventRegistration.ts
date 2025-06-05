import mongoose from 'mongoose';

// Define the schema for event registrations
const eventRegistrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    filmTitle: {
        type: String,
        required: [true, 'Film title is required'],
        trim: true,
    },
    filmDuration: {
        type: Number,
        required: [true, 'Film duration is required'],
        min: [5, 'Film must be at least 5 minutes long'],
        max: [30, 'Film must not exceed 30 minutes']
    },
    filmGenre: {
        type: String,
        required: [true, 'Film genre is required'],
        trim: true,
    },
    agreeToTerms: {
        type: Boolean,
        required: [true, 'Must agree to terms and conditions'],
        validate: {
            validator: (value: boolean) => value === true,
            message: 'You must agree to the terms and conditions'
        }
    },
    driverLink: {
        type: String,
    },
    registrationDate: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    notes: {
        type: String,
        trim: true,
    }
});

// Create the model or use the existing one
const EventRegistration = mongoose.models.EventRegistration ||
    mongoose.model('EventRegistration', eventRegistrationSchema);

export default EventRegistration;  