import React from 'react';

const DirectorsSkeleton = () => {
    return (
        <div className="w-full py-6 animate-pulse">
            <div className="flex justify-between items-center mb-6">
                <div className="h-6 bg-gray-700 rounded-md w-48"></div>
                <div className="h-8 bg-gray-700 rounded-md w-24"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex bg-gray-800 rounded-xl overflow-hidden">
                        <div className="w-1/3 h-[150px] bg-gray-700"></div>
                        <div className="w-2/3 p-4 space-y-3">
                            <div className="h-5 bg-gray-700 rounded-md w-3/4"></div>
                            <div className="h-4 bg-gray-700 rounded-md w-1/2"></div>
                            <div className="h-4 bg-gray-700 rounded-md w-5/6"></div>
                            <div className="h-8 bg-gray-700 rounded-md w-1/3 mt-4"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DirectorsSkeleton; 