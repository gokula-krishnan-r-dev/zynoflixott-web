import mongoose, { Schema, Document } from "mongoose";

export interface ILiveStream extends Document {
    userId: string;
    producerName: string;
    directorName: string;
    heroName: string;
    heroinName: string;
    movieTitle: string;
    movieSubtitles?: string;
    movieCategory: string;
    movieDescription: string;
    movieTrailer: string;
    moviePoster: string;
    movieVideo: string;
    movieLength: number;
    movieCertificate: string;
    movieLanguage: string;
    streamingDate: string;
    streamingTime: string;
    ticketCost: number;
    paymentId?: string;
    orderId?: string;
    status: string;
    ticketsSold: number;
    viewCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

const LiveStreamSchema: Schema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            index: true
        },
        producerName: {
            type: String,
            required: true
        },
        directorName: {
            type: String,
            required: true
        },
        heroName: {
            type: String,
            required: true
        },
        heroinName: {
            type: String,
            required: true
        },
        movieTitle: {
            type: String,
            required: true
        },
        movieSubtitles: {
            type: String,
            default: ""
        },
        movieCategory: {
            type: String,
            required: true
        },
        movieDescription: {
            type: String,
            required: true
        },
        movieTrailer: {
            type: String,
            required: true
        },
        moviePoster: {
            type: String,
            required: true
        },
        movieVideo: {
            type: String,
            required: true
        },
        movieLength: {
            type: Number,
            required: true
        },
        movieCertificate: {
            type: String,
            required: true
        },
        movieLanguage: {
            type: String,
            required: true
        },
        streamingDate: {
            type: String,
            required: true
        },
        streamingTime: {
            type: String,
            required: true
        },
        ticketCost: {
            type: Number,
            required: true
        },
        paymentId: {
            type: String,
            default: ""
        },
        orderId: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["scheduled", "live", "completed", "cancelled"],
            default: "scheduled"
        },
        ticketsSold: {
            type: Number,
            default: 0
        },
        viewCount: {
            type: Number,
            default: 0
        },
        createdBy: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.LiveStream || mongoose.model<ILiveStream>("LiveStream", LiveStreamSchema); 