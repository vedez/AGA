"use client";

import { createContext, useContext, useState } from 'react';
import { useMediaQuery } from 'react-responsive';

// available background image paths
export const BACKGROUNDS = {
	MAIN: '/assets/background-1.png',
	SECONDARY: '/assets/background-2.png',
	TERTIARY: '/assets/background-3.png',
};

const BackgroundContext = createContext();

// custom hook to access the background context
export function useBackground() {
	return useContext(BackgroundContext);
}

// provides bg related state and functions to children components
export function BackgroundProvider({ children }) {
	const [backgroundImage, setBackgroundImage] = useState(BACKGROUNDS.MAIN); // current background image
	const [overlayOpacity, setOverlayOpacity] = useState(0.7); // overlay opacity for background

	const isMobile = useMediaQuery({ maxWidth: 768 }); // detects if user is on a mobile device

	// changes the background image and optionally sets overlay opacity
	const changeBackground = (bgKey, opacity = 0.7) => {
		const bg = BACKGROUNDS[bgKey] || BACKGROUNDS.MAIN;
		const mobileBg = bg.replace('.png', '-mobile.png'); // adjusts for mobile-specific background

		setBackgroundImage(isMobile ? mobileBg : bg);
		setOverlayOpacity(opacity);
	};

	// context value that will be shared with components
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
