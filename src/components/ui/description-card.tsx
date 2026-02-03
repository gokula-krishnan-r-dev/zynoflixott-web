"use client";

import { useState } from "react";

interface DescriptionCardProps {
    description: string;
    maxLength?: number;
    className?: string;
}

export default function DescriptionCard({
    description,
    maxLength = 150,
    className = ""
}: DescriptionCardProps) {
    const [expanded, setExpanded] = useState(false);

    const shouldTruncate = description.length > maxLength;
    const displayText = expanded || !shouldTruncate
        ? description
        : `${description.slice(0, maxLength)}...`;

    return (
        <div
            className={`text-white bg-gradient-to-r from-[#2c1157] to-[#3c1973] rounded-2xl p-5 shadow-lg backdrop-blur-sm overflow-hidden min-w-0 ${className}`}
        >
            <p className="text-[#e0e0e8] text-sm leading-relaxed break-words">
                {displayText}
            </p>

            {shouldTruncate && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-white font-medium text-sm mt-2 hover:underline transition-all"
                >
                    {expanded ? "View Less" : "View More"}
                </button>
            )}
        </div>
    );
} 