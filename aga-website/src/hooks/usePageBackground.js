"use client";

import { useEffect } from 'react';
import { useBackground, BACKGROUNDS } from '@/app/utils/BackgroundContext';

export default function usePageBackground(backgroundKey = 'MAIN', opacity = 0.7) {
	const { changeBackground } = useBackground();

	useEffect(() => {
		changeBackground(backgroundKey, opacity);
	}, [backgroundKey, opacity, changeBackground]);
} 