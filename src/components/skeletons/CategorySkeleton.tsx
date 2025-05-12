import React from 'react';

const CategorySkeleton = () => {
    return (
        <div className="w-full px-4 py-6 animate-pulse">
            <div className="flex justify-between items-center mb-4">
                <div className="space-y-2">
                    <div className="h-6 bg-gray-700 rounded-md w-40"></div>
                    <div className="h-4 bg-gray-700 rounded-md w-48"></div>
                </div>
                <div className="h-8 bg-gray-700 rounded-md w-20"></div>
            </div>

            <div className="grid grid-flow-col auto-cols-max gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="w-[160px] md:w-[200px]">
                        <div className="h-[100px] md:h-[120px] bg-gray-700 rounded-md mb-2"></div>
                        <div className="h-4 bg-gray-700 rounded-md w-3/4 mb-1"></div>
                        <div className="h-3 bg-gray-700 rounded-md w-1/2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySkeleton; 