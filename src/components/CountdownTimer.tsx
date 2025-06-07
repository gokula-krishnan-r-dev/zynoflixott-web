"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownTimerProps {
    targetDate: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = new Date(targetDate).getTime() - new Date().getTime();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            setTimeLeft({
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            });
        };

        calculateTimeLeft();
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatNumber = (num: number) => {
        return num < 10 ? `0${num}` : num.toString();
    };

    const timeBlocks = [
        { label: "DAYS", value: timeLeft.days },
        { label: "HOURS", value: timeLeft.hours },
        { label: "MINUTES", value: timeLeft.minutes },
        { label: "SECONDS", value: timeLeft.seconds },
    ];

    return (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {timeBlocks.map((block, index) => (
                <div key={block.label} className="flex flex-col items-center">
                    <motion.div
                        className="bg-[#1a0733] w-full aspect-square rounded-lg flex items-center justify-center text-white font-bold text-xl sm:text-2xl md:text-3xl border border-purple-500/20 shadow-inner shadow-purple-500/10"
                        initial={{ scale: 0.9 }}
                        animate={{
                            scale: [0.98, 1, 0.98],
                            borderColor: ["rgba(139, 92, 246, 0.3)", "rgba(139, 92, 246, 0.5)", "rgba(139, 92, 246, 0.3)"],
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        {formatNumber(block.value)}
                    </motion.div>
                    <span className="text-xs text-purple-200 mt-1 font-medium">
                        {block.label}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default CountdownTimer; 