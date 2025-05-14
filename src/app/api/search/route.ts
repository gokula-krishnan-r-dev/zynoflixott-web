import { connectDB } from '@/lib/mongo';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // Get search query and filters from URL parameters
        const searchParams = request.nextUrl.searchParams;
        const query = searchParams.get('q') || '';
        const language = searchParams.get('language') || null;
        const category = searchParams.get('category') || null;
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');

        // Skip calculation for pagination
        const skip = (page - 1) * limit;

        // Create filter object for MongoDB query
        const filter: any = {};

        // Add text search if query is provided
        if (query && query.trim() !== '') {
            filter.$or = [
                { title: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { tags: { $regex: query, $options: 'i' } }
            ];
        }

        // Add language filter if provided
        if (language) {
            filter.language = language;
        }

        // Add category filter if provided
        if (category) {
            filter.category = { $in: [new RegExp(category, 'i')] };
        }

        // Connect to database
        const { db } = await connectDB();

        // Execute query with pagination
        const videos = await db
            .collection('videos')
            .find(filter)
            .sort({ views: -1, createdAt: -1 }) // Sort by views and recency
            .skip(skip)
            .limit(limit)
            .toArray();

        // Get total count for pagination
        const total = await db.collection('videos').countDocuments(filter);

        // Return search results
        return NextResponse.json({
            success: true,
            videos,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error: any) {
        console.error('Search API error:', error);

        return NextResponse.json(
            {
                success: false,
                error: 'Failed to search videos',
                details: error.message
            },
            { status: 500 }
        );
    }
} 