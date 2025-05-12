import React from 'react';

const ProductionSkeleton = () => {
    return (
        <div className="w-full py-4 animate-pulse">
            <div className="h-6 bg-gray-700 rounded-md w-48 mb-6"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, index) => (
                    <div key={index} className="flex flex-col items-center justify-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gray-700 mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded-md w-20 mb-1"></div>
                        <div className="h-3 bg-gray-700 rounded-md w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductionSkeleton; 