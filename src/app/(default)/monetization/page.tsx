"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    DollarSign,
    Users,
    Film,
    Clock,
    CheckCircle,
    ChevronRight,
    ArrowRight,
    EyeIcon,
    BadgeCheck,
    Wallet
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const MonetizationPage = () => {
    return (
        <div className="min-h-screen pt-16 sm:pt-24 pb-16 bg-gradient-to-br from-[#1a0733] to-[#2c1157]">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-12 text-center"
                >
                    <div className="inline-flex items-center justify-center p-3 bg-[#7b61ff]/20 rounded-full mb-4">
                        <DollarSign className="h-8 w-8 text-[#7b61ff]" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Creator Monetization Program
                    </h1>
                    <p className="text-gray-300 text-base max-w-2xl mx-auto">
                        Turn your creativity into income with ZynoFlix's monetization program for content creators.
                    </p>
                </motion.div>

                {/* Eligibility Criteria Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <BadgeCheck className="mr-2 text-[#7b61ff]" />
                        Eligibility Criteria
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Watch Hours */}
                        <Card className="bg-[rgba(25,28,51,0.6)] backdrop-blur-sm border border-[#292c41]/50 text-white overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 rounded-full bg-[#7b61ff]/20 flex items-center justify-center mb-3">
                                    <Clock className="h-6 w-6 text-[#7b61ff]" />
                                </div>
                                <CardTitle className="text-xl text-white">Watch Hours</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold mb-2 text-[#7b61ff]">1,000</p>
                                <p className="text-gray-300">Minimum watch hours required</p>
                            </CardContent>
                        </Card>

                        {/* Followers */}
                        <Card className="bg-[rgba(25,28,51,0.6)] backdrop-blur-sm border border-[#292c41]/50 text-white overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 rounded-full bg-[#7b61ff]/20 flex items-center justify-center mb-3">
                                    <Users className="h-6 w-6 text-[#7b61ff]" />
                                </div>
                                <CardTitle className="text-xl text-white">Followers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold mb-2 text-[#7b61ff]">1,000</p>
                                <p className="text-gray-300">Minimum followers needed</p>
                            </CardContent>
                        </Card>

                        {/* Videos */}
                        <Card className="bg-[rgba(25,28,51,0.6)] backdrop-blur-sm border border-[#292c41]/50 text-white overflow-hidden transform transition-all hover:scale-105 hover:shadow-lg">
                            <CardHeader className="pb-2">
                                <div className="w-12 h-12 rounded-full bg-[#7b61ff]/20 flex items-center justify-center mb-3">
                                    <Film className="h-6 w-6 text-[#7b61ff]" />
                                </div>
                                <CardTitle className="text-xl text-white">Videos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-4xl font-bold mb-2 text-[#7b61ff]">5</p>
                                <p className="text-gray-300">Minimum videos uploaded</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mt-8 p-5 bg-[rgba(25,28,51,0.3)] backdrop-blur-sm rounded-xl border border-[#292c41]/50">
                        <p className="text-gray-200 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>Once all these criteria are fulfilled, monetization will be automatically enabled for your content.</span>
                        </p>
                    </div>
                </motion.div>

                {/* Payout Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mb-12"
                >
                    <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                        <Wallet className="mr-2 text-[#7b61ff]" />
                        Monetization Payout
                    </h2>

                    <Card className="bg-[rgba(25,28,51,0.6)] backdrop-blur-sm border border-[#292c41]/50 text-white p-2 overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-center mb-6">
                                <div className="w-16 h-16 rounded-full bg-[#7b61ff]/20 flex items-center justify-center">
                                    <EyeIcon className="h-8 w-8 text-[#7b61ff]" />
                                </div>
                                <div className="ml-6 text-center md:text-left">
                                    <h3 className="text-3xl font-bold text-white">$2 USD</h3>
                                    <p className="text-gray-300">Per 1,000 views</p>
                                </div>
                            </div>

                            <div className="bg-[rgba(123,97,255,0.1)] p-4 rounded-lg border border-[#7b61ff]/30">
                                <p className="text-gray-200 text-center">
                                    Once monetization is enabled, creators will earn $2 USD for every 1,000 views on their content.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-center"
                >
                    <h2 className="text-2xl font-bold text-white mb-6">Ready to Monetize Your Content?</h2>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button
                            className="bg-[#7b61ff] hover:bg-[#6346e5] text-white px-8 py-6 h-auto text-base"
                            asChild
                        >
                            <Link href="/video-upload">
                                <Film className="mr-2 h-5 w-5" />
                                Upload Content
                            </Link>
                        </Button>
                        <Button
                            className="bg-transparent border border-[#7b61ff] text-white hover:bg-[#7b61ff]/10 px-8 py-6 h-auto text-base"
                            asChild
                        >
                            <Link href="/profile">
                                <ArrowRight className="mr-2 h-5 w-5" />
                                View My Stats
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MonetizationPage; 
