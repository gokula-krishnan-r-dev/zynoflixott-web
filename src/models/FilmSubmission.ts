import mongoose, { Schema, Document } from "mongoose";

export interface IFilmSubmission extends Document {
    fullName: string;
    email: string;
    filmTitle: string;
    genre: string;
    synopsis: string;
    filmLink: string;
    scriptPdfUrl?: string;
    originalFileName?: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
}

const FilmSubmissionSchema: Schema = new Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        filmTitle: {
            type: String,
            required: true
        },
        genre: {
            type: String,
            required: true
        },
        synopsis: {
            type: String,
            required: true
        },
        filmLink: {
            type: String,
            required: true
        },
        scriptPdfUrl: {
            type: String,
            default: ""
        },
        originalFileName: {
            type: String,
            default: ""
        },
        status: {
            type: String,
            enum: ["pending", "approved", "rejected"],
            default: "pending"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.models.FilmSubmission || mongoose.model<IFilmSubmission>("FilmSubmission", FilmSubmissionSchema); 