import React from 'react';

const LanguageSkeleton = () => {
    return (
        <div className="w-full px-4 py-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded-md w-48 mb-4"></div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[...Array(12)].map((_, index) => (
                    <div key={index} className="h-12 bg-gray-700 rounded-lg"></div>
                ))}
            </div>
        </div>
    );
};

export default LanguageSkeleton; 