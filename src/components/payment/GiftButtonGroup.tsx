"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';

type GiftButtonGroupProps = {
    videoId: string;
    creatorId: string;
    // onSelect: (amount: number) => void;
    selectedAmount: number | null;
    onClick: (amount: number) => void;
    loading: boolean;
    className?: string;
    variant?: 'mobile' | 'desktop';
};

export default function GiftButtonGroup({
    videoId,
    creatorId,
    // onSelect,
    selectedAmount,
    loading,
    className,
    onClick,
    variant = 'desktop'
}: GiftButtonGroupProps) {
    const giftOptions = [
        { amount: 13, displayAmount: '$13' },
        { amount: 118, displayAmount: '$118' },
        { amount: 295, displayAmount: '$295' }
    ];

    if (variant === 'mobile') {
        return (
            <div className={cn("flex justify-center  bg-purple-900 px-5 py-1 rounded-full", className)}>
                <motion.div
                    className="w-full flex gap-2 max-w-md"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <div className="w-1/4 flex items-center justify-center">
                        <div className="rounded-full bg-gradient-to-r mr-4 flex items-center justify-center gap-2 from-purple-600/20 to-indigo-600/20 border border-indigo-500/30 py-2 px-2.5 shadow-md">
                            <Gift className="h-5 w-5 text-indigo-400" />
                            <span className="text-md font-medium">Gift</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {giftOptions.map((option) => (
                            <motion.button
                                onClick={() => {
                                    onClick(option.amount);
                                }}
                                key={option.amount}
                                // onClick={() => onSelect(option.amount)}
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="stats-badge bg-gradient-to-br from-emerald-600 to-green-500 text-white px-3 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs hover:brightness-110"
                            >
                                {option.displayAmount}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        );
    }

    // Desktop variant
    return (
        <div className={cn("relative", className)}>
            <div className="flex items-center justify-center gap-3">
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-indigo-900/30 rounded-xl p-4 flex items-center gap-4"
                >
                    <div className="rounded-full bg-gradient-to-r from-purple-600/20 to-indigo-600/20 border border-indigo-500/30 p-3 shadow-md">
                        <Gift className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-3">
                        {giftOptions.map((option) => (
                            <motion.button
                                key={option.amount}
                                // onClick={() => onSelect(option.amount)}
                                disabled={loading}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="stats-badge bg-gradient-to-br from-emerald-600 to-green-500 text-white px-3 py-2.5 rounded-full shadow-sm flex items-center gap-1.5 text-xs hover:brightness-110"
                            >
                                {option.displayAmount}

                                {/* Subtle pulsing effect for selected amount */}
                                {selectedAmount === option.amount && (
                                    <motion.span
                                        className="absolute inset-0 bg-white/10 rounded-lg"
                                        animate={{ opacity: [0, 0.2, 0] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
} 