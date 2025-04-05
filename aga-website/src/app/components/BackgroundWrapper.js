"use client";

import React from 'react';
import { useBackground } from '@/app/utils/BackgroundContext';

const BackgroundWrapper = ({ children }) => {
    const { backgroundImage, overlayOpacity } = useBackground();

    return (
        <div
            style={{
            position: 'relative',
            }}
        >
            <div
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    backgroundAttachment: 'scroll',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -2,
                }}
            />

            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: `rgba(255, 255, 255, ${overlayOpacity})`,
                    zIndex: -1,
                }}
            />

            <div className="relative z-10">
                {children}
            </div>
        </div>
    );
};

export default BackgroundWrapper; 