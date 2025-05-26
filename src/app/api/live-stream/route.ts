import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { z } from "zod";
import LiveStream from "@/models/LiveStream";

// MongoDB connection
const connectMongoDB = async () => {
    try {
        if (mongoose.connection.readyState === 1) {
            return mongoose.connection;
        }
        const uri = process.env.MONGODB_URI || "mongodb+srv://admin:zyn0f1ix@cluster0.fjf3fcj.mongodb.net/zynoflix";
        await mongoose.connect(uri);
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error);
        throw error;
    }
};

// Validation schema matching the frontend
const liveStreamSchema = z.object({
    producerName: z.string().min(1, "Producer name is required"),
    directorName: z.string().min(1, "Director name is required"),
    heroName: z.string().min(1, "Hero name is required"),
    heroinName: z.string().min(1, "Heroin name is required"),
    movieTitle: z.string().min(1, "Movie title is required"),
    movieSubtitles: z.string().optional(),
    movieCategory: z.string().min(1, "Movie category is required"),
    movieDescription: z.string().min(10, "Movie description must be at least 10 characters"),
    movieTrailer: z.string().min(1, "Movie trailer is required"),
    moviePoster: z.string().min(1, "Movie poster is required"),
    movieVideo: z.string().min(1, "Original movie video is required"),
    movieLength: z.coerce.number().min(1, "Movie length is required"),
    movieCertificate: z.string().min(1, "Movie certificate is required"),
    movieLanguage: z.string().min(1, "Movie language is required"),
    streamingDate: z.string().min(1, "Streaming date is required"),
    streamingTime: z.string().min(1, "Streaming time is required"),
    ticketCost: z.coerce.number().min(1, "Ticket cost must be at least 1"),
    paymentId: z.string().optional(),
    orderId: z.string().optional()
});

export async function POST(request: NextRequest) {
    try {
        await connectMongoDB();
        const userId = request.headers.get('userId');

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parse and validate request body
        const body = await request.json();
        const validation = liveStreamSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.errors[0].message }, { status: 400 });
        }

        const data = validation.data;

        // Create a full streaming datetime from date and time
        const streamingDatetime = new Date(`${data.streamingDate}T${data.streamingTime}`);

        // Check if streaming date is in the future
        const now = new Date();
        if (streamingDatetime <= now) {
            return NextResponse.json({ error: 'Streaming date must be in the future' }, { status: 400 });
        }

        // Store in database
        const liveStream = await LiveStream.create({
            userId: userId,
            producerName: data.producerName,
            directorName: data.directorName,
            heroName: data.heroName,
            heroinName: data.heroinName,
            movieTitle: data.movieTitle,
            movieSubtitles: data.movieSubtitles || '',
            movieCategory: data.movieCategory,
            movieDescription: data.movieDescription,
            movieTrailer: data.movieTrailer,
            moviePoster: data.moviePoster,
            movieVideo: data.movieVideo,
            movieLength: data.movieLength,
            movieCertificate: data.movieCertificate,
            movieLanguage: data.movieLanguage,
            streamingDate: data.streamingDate,
            streamingTime: data.streamingTime,
            ticketCost: data.ticketCost,
            paymentId: data.paymentId || '',
            orderId: data.orderId || '',
            status: 'scheduled',
            createdBy: userId
        });

        return NextResponse.json({
            success: true,
            liveStreamId: liveStream._id
        });
    } catch (error) {
        console.error('Error creating live stream:', error);
        return NextResponse.json({ error: 'Failed to create live stream' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {

        await connectMongoDB();
        //fetch from mongodb 
        const events = await LiveStream.find({});

        return NextResponse.json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        return NextResponse.json({
            error: 'Failed to fetch events',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

