import { MongoClient } from 'mongodb';

// Connection URI
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGODB_DB || 'ott'; // Default to 'ott' database

// Connection cache
let client: MongoClient | null = null;
let db: any = null;

/**
 * Connects to MongoDB and returns the client and database
 * Uses connection pooling by caching the client instance
 */
export async function connectDB() {
    if (client && db) {
        return { client, db };
    }

    if (!process.env.MONGODB_URI) {
        throw new Error('Please define the MONGODB_URI environment variable');
    }

    try {
        client = new MongoClient(uri);
        await client.connect();
        db = client.db(dbName);

        console.log('Connected to MongoDB');
        return { client, db };
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

/**
 * Closes the MongoDB connection
 */
export async function disconnectDB() {
    if (client) {
        await client.close();
        client = null;
        db = null;
        console.log('Disconnected from MongoDB');
    }
} 