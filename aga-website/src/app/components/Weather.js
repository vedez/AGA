import { useEffect, useState } from 'react';
import { BiLoader } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";



const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export default function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                    );

                    if (!response.ok) {
                        throw new Error('Weather Data Unavailable');
                    }

                    const data = await response.json();
                    setWeatherData(data);
                } catch (error) {
                    setError(error.message);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                setError('Please turn on location');
                setLoading(false);
            }
        );
    }, []);

    if (loading) return (
        <div className="bg-[#5087ff] text-white text-center text-l font-semibold feature-element grid place-items-center h-full">
            <div className="flex flex-col place-items-center space-y-3">
                <h6>Retrieving Weather Forecast</h6>
                <BiLoader className="animate-spin text-3xl" />
            </div>
        </div>
    );
    
    if (error) return (
        <div className="bg-red-500 text-white text-center text-l font-semibold feature-element grid place-items-center h-full">
            <div className="flex flex-row items-center gap-x-3">
                <FaLocationDot className="animate-bounce text-xl" />
                {error}                 
            </div>
        </div>
    );

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
        </div>

    );
}
