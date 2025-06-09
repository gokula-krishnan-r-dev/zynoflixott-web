import mongoose, { Schema, Document } from 'mongoose';

// Define the interface for the Sell document
interface ISell extends Document {
    name: string;
    contact: string;
    email: string;
    appointmentDate: string;
    appointmentTime: string;
    scriptUrl: string;
    originalFileName: string;
    paymentId?: string;
    orderId?: string;
    paymentAmount?: number;
    paymentStatus: 'pending' | 'completed' | 'failed';
    status: 'pending' | 'scheduled' | 'rejected' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

// Define the Sell schema
const SellSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long'],
            maxlength: [50, 'Name cannot exceed 50 characters']
        },
        contact: {
            type: String,
            required: [true, 'Contact is required'],
            trim: true,
            match: [/^\d{10}$/, 'Contact must be a 10-digit number']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            trim: true,
            lowercase: true,
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
        },
        appointmentDate: {
            type: String,
            required: [true, 'Appointment date is required'],
            validate: {
                validator: function (v: string) {
                    return /^\d{4}-\d{2}-\d{2}$/.test(v);
                },
                message: 'Appointment date must be in YYYY-MM-DD format'
            }
        },
        appointmentTime: {
            type: String,
            required: [true, 'Appointment time is required'],
            validate: {
                validator: function (v: string) {
                    return /^[0-9]{2}:[0-9]{2}$/.test(v);
                },
                message: 'Appointment time must be in HH:MM format'
            }
        },
        scriptUrl: {
            type: String,
            required: [true, 'Script URL is required']
        },
        originalFileName: {
            type: String,
            required: [true, 'Original file name is required']
        },
        paymentId: {
            type: String
        },
        orderId: {
            type: String
        },
        paymentAmount: {
            type: Number,
            default: 100 // ₹100 submission fee
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        status: {
            type: String,
            enum: ['pending', 'scheduled', 'rejected', 'completed'],
            default: 'pending'
        }
    },
    {
        timestamps: true
    }
);

// Add indexes for common queries
SellSchema.index({ email: 1 });
SellSchema.index({ status: 1 });
SellSchema.index({ paymentStatus: 1 });

// Create and export the Sell model
const Sell = mongoose.models.Sell || mongoose.model<ISell>('Sell', SellSchema);
export default Sell;
