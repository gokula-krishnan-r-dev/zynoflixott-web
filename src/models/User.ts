import mongoose, { Schema, Document } from "mongoose";

interface ISubscription {
    status: string;
    plan: string;
    startDate?: Date;
    endDate?: Date;
}

export interface IUser extends Document {
    email: string;
    name?: string;
    password?: string;
    avatar?: string;
    role: string;
    isPremium?: boolean;
    subscription?: ISubscription;
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
            endDate: {
                type: Date
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