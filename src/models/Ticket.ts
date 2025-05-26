import mongoose, { Schema, Document } from "mongoose";

export interface ITicket extends Document {
    userId: string;
    eventId: string;
    orderId: string;
    paymentId: string;
    purchaseDate: Date;
    amount: number;
    quantity: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const TicketSchema: Schema = new Schema(
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
        orderId: {
            type: String,
            required: true,
            unique: true
        },
        paymentId: {
            type: String,
            required: true
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            default: 1
        },
        status: {
            type: String,
            enum: ['active', 'used', 'cancelled', 'expired'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
);

// Create indexes for common queries without making the combination unique
TicketSchema.index({ purchaseDate: -1 });

export default mongoose.models.Ticket || mongoose.model<ITicket>("Ticket", TicketSchema); 