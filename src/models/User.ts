import mongoose, { Schema, Document } from "mongoose";

interface ISubscription {
    status: string;
    plan: string;
    startDate?: Date;
    startMonth?: string; // e.g., "January", "February"
    startTime?: string; // e.g., "15:30:00"
    endDate?: Date;
    paymentId?: string;
    orderId?: string;
    amount?: number;
}

export interface IUser extends Document {
    email: string;
    name?: string;
    password?: string;
    avatar?: string;
    role: string;
    isPremium?: boolean;
    subscription?: ISubscription;
    userType?: string; // 'user', 'student_ambassador', etc.
    college_name?: string; // For student ambassadors
    age?: number; // For student ambassadors
    registrationFeePaid?: boolean; // For student ambassadors
    full_name?: string; // Full name field
    profilePic?: string; // Profile picture
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true
        },
        name: {
            type: String,
            trim: true
        },
        password: {
            type: String
        },
        avatar: {
            type: String
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'producer'],
            default: 'user'
        },
        isPremium: {
            type: Boolean,
            default: false
        },
        subscription: {
            status: {
                type: String,
                enum: ['inactive', 'active', 'canceled', 'expired'],
                default: 'inactive'
            },
            plan: {
                type: String,
                enum: ['basic', 'premium', 'ultimate'],
                default: 'basic'
            },
            startDate: {
                type: Date
            },
            startMonth: {
                type: String // Store month name like "January", "February"
            },
            startTime: {
                type: String // Store time in HH:mm:ss format
            },
            endDate: {
                type: Date
            },
            paymentId: {
                type: String
            },
            orderId: {
                type: String
            },
            amount: {
                type: Number
            }
        }
    },
    {
        timestamps: true
    }
);

// Create compound indexes
UserSchema.index({ email: 1, role: 1 });
UserSchema.index({ isPremium: 1 });

export default mongoose.models.User ||
    mongoose.model<IUser>("User", UserSchema); 