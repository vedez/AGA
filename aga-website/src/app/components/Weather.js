import { useEffect, useState } from 'react';
import useTranslation from "@/hooks/useTranslation";
import { BiLoader } from "react-icons/bi";

export default function Weather() {
    const { translations } = useTranslation();
    const [weatherData, setWeatherData] = useState(null);
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch weather data from our secure API route
    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `/api/weather?lat=${latitude}&lon=${longitude}`
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
                    }

                    const data = await response.json();
                    setWeatherData(data.weatherData);
                    if (data.suggestion) {
                        setSuggestion(data.suggestion);
                    }
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                setError(translations.components?.weatherError || 'Unable to get location');
                setLoading(false);
            }
        );
    }, []); 

    if (loading) return (
        <div className="bg-[#5087ff] text-white text-center text-l font-semibold feature-element grid place-items-center h-full">
            <div className="flex flex-col place-items-center space-y-3">
                <h6>{translations.components?.weatherLoading || "Retrieving Weather Forecast"}</h6>
                <BiLoader className="animate-spin text-3xl" />
            </div>
        </div>
    );
    
    if (error) return <div className="bg-[#5087ff] text-white p-4 feature-element">{error}</div>;

    return (
        <div className="bg-[#5087ff] text-white feature-element flex flex-col items-center p-4">
            <h2 className="text-xl font-bold">
                {weatherData.name}
                {weatherData.sys?.country &&
                    `, ${new Intl.DisplayNames(['en'], { type: 'region' }).of(weatherData.sys.country)}`
                }
            </h2>

            {/* Weather Icon */}
            {weatherData.weather[0]?.icon && (
                <img
                    src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                    alt={weatherData.weather[0].description}
                    className="w-16 h-16"
                />
            )}

            <p className="text-l capitalize">
                {weatherData.weather[0].description}
            </p>
            <p className="text-2xl font-semibold">
                {Math.round(weatherData.main.temp)}°C
            </p>

            {/* AI-Generated Suggestion */}
            {suggestion && (
                <div className="mt-4 bg-white text-black p-2 rounded-lg shadow-md">
                    <span>{suggestion}</span> 
                </div>
            )}
        </div>
    );
}