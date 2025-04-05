"use client";

import React from 'react';
import { useBackground } from '@/app/utils/BackgroundContext';

const BackgroundWrapper = ({ children }) => {
    const { backgroundImage, overlayOpacity } = useBackground();

    return (
        <div className="relative">
            <div className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-2]"
                style={{ backgroundImage: `url(${backgroundImage})` }}
            />
            <div className="fixed inset-0 bg-white z-[-1]"
                style={{ backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})` }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default BackgroundWrapper; 