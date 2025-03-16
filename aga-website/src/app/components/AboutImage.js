"use client";

import Image from "next/image";

export default function AboutImage() {
    return (
        <div className="w-full relative max-w-xs sm:max-w-sm mx-auto">
            {/* Background shape for drop shadow effect */}
            <div className="absolute -bottom-2 -left-2 sm:-bottom-8 sm:-left-8 w-[90%] h-[90%] bg-gray-800 rounded-lg z-0"></div>
            
            {/* Main image container */}
            <div className="relative rounded-lg overflow-hidden p-4">
                <div className="rounded-lg overflow-hidden">
                    <Image
                        src="/mental-health-day.jpg"
                        alt="World Mental Health Day"
                        width={500}
                        height={500}
                        className="w-full h-auto object-cover"
                        priority
                    />
                </div>
            </div>
        </div>
    );
} 