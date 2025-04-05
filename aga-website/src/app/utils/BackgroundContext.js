"use client";

import { createContext, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// available background options
export const BACKGROUNDS = {
	MAIN: '/assets/background-1.png',
	SECONDARY: '/assets/background-2.png',
	TERTIARY: '/assets/background-3.png',
};

const BackgroundContext = createContext();

export function useBackground() {
	return useContext(BackgroundContext);
}

export function BackgroundProvider({ children }) {
	const [backgroundImage, setBackgroundImage] = useState(BACKGROUNDS.MAIN);
	const [overlayOpacity, setOverlayOpacity] = useState(0.7);

	const isMobile = useMediaQuery({ maxWidth: 768 });

	// function to change the background
	const changeBackground = (bgKey, opacity = 0.7) => {
	const bg = BACKGROUNDS[bgKey] || BACKGROUNDS.MAIN;
	const mobileBg = bg.replace('.png', '-mobile.png');

	setBackgroundImage(isMobile ? mobileBg : bg);
		setOverlayOpacity(opacity);
	};

	const value = {
		backgroundImage,
		overlayOpacity,
		changeBackground,
		BACKGROUNDS
	};

	return (
		<BackgroundContext.Provider value={value}>
			{children}
		</BackgroundContext.Provider>
	);
} 