import React from 'react';

const BannerSkeleton = () => {
    return (
        <div className="w-full animate-pulse">
            <div className="h-[300px] md:h-[400px] lg:h-[500px] bg-gray-700 rounded-md overflow-hidden relative">
                <div className="absolute bottom-10 left-10 w-2/3 space-y-3">
                    <div className="h-8 bg-gray-600 rounded-md w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded-md w-3/4"></div>
                    <div className="h-10 bg-gray-600 rounded-md w-1/3 mt-4"></div>
                </div>
            </div>
        </div>
    );
};

export default BannerSkeleton; 