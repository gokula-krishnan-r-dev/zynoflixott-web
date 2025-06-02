import mongoose, { Schema, Document } from 'mongoose';

// Define the Production interface
export interface IProduction extends Document {
    name: string;
    contact: string;
    email: string;
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

// Define the Production schema
const ProductionSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required']
        },
        contact: {
            type: String,
            required: [true, 'Contact is required']
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
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
            type: Number
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

// Create and export the Production model
export default mongoose.models.Production || mongoose.model<IProduction>('Production', ProductionSchema); 