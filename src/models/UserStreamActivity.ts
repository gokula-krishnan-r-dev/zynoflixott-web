import mongoose, { Schema, Document } from "mongoose";

export interface IUserStreamActivity extends Document {
    userId: string;
    eventId: Schema.Types.ObjectId;
    activityType: string;
    ticketId?: Schema.Types.ObjectId;
    orderId?: string;
    paymentId?: string;
    amount?: number;
    viewDuration?: number;
    interactionType?: string;
    interactionData?: any;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}

const UserStreamActivitySchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        eventId: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'LiveStream',
            index: true
        },
        activityType: {
            type: String,
            enum: ['purchase', 'view', 'like', 'share', 'comment', 'rating', 'other'],
            required: true,
            index: true
        },
        ticketId: {
            type: Schema.Types.ObjectId,
            ref: 'Ticket'
        },
        orderId: {
            type: String
        },
        paymentId: {
            type: String
        },
        amount: {
            type: Number
        },
        viewDuration: {
            type: Number
        },
        interactionType: {
            type: String
        },
        interactionData: {
            type: Schema.Types.Mixed
        },
        timestamp: {
            type: Date,
            default: Date.now,
            index: true
        }
    },
    {
        timestamps: true
    }
);

// Create compound indexes for efficient queries
UserStreamActivitySchema.index({ timestamp: -1 });

export default mongoose.models.UserStreamActivity ||
    mongoose.model<IUserStreamActivity>("UserStreamActivity", UserStreamActivitySchema); 