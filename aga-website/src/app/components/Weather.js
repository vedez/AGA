import useTranslation from '@/hooks/useTranslation';
import { useEffect, useState } from 'react';
import { BiLoader } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";

export default function Weather() {
    const { translations } = useTranslation();
    const [weatherData, setWeatherData] = useState(null);
    const [suggestion, setSuggestion] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setError(translations.weather?.pleaseTurnOnLocation || 'Please turn on location');
                setLoading(false);
            }
        );
    }, []); 

    if (loading) return (
        <div className="bg-gradient-to-r from-[#6475bc] to-[#8698eb] border-[#6475bc] border-2 text-white text-l font-bold feature-element grid place-items-center h-full"><BiLoader className="animate-spin text-3xl" /></div>
    );
    
    if (error) return (
        <div className="bg-red-500 border-red-600 border-2 text-white text-center text-l font-semibold feature-element grid place-items-center h-full">
            <div className="flex flex-row items-center gap-x-3">
                <FaLocationDot className="animate-bounce text-xl" />
                {error}                 
            </div>
        </div>
    );

    return (
        <div className="bg-gradient-to-r from-[#6475bc] to-[#8698eb] border-[#6475bc] border-2 text-white feature-element flex flex-col items-center p-4">
            <div className='center gap-x-8'>
                
                <div className='flex flex-col text-bg-shadow'>
                    <p className="text-2xl font-semibold">
                        {Math.round(weatherData.main.temp)}{translations.weather.temperatureUnit}
                    </p>

                    <h2 className="text-sm font-bold pb-3">
                        {weatherData.name}
                        {weatherData.sys?.country &&
                            `, ${new Intl.DisplayNames(['en'], { type: 'region' }).of(weatherData.sys.country)}`
                        }
                    </h2>
                </div>

                {weatherData.weather[0]?.icon && (
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt={weatherData.weather[0].description}
                            className="w-25 h-25 fff-text-bg-shadow"
                        />
                    )}
            </div>

            {suggestion && (
                    <div className='bg-white text-[#303037] font-semibold text-center feature-element'>
                        <p>{translations.weather.suggestionPrefix}{suggestion}{translations.weather.suggestionPrefix}</p>
                    </div>
            )}             
        </div>
    );
}