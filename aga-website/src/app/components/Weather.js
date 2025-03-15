import { useEffect, useState } from 'react';

const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export default function Weather() {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Get the user's location (optional)
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;

                try {
                    const response = await fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`
                    );
                    if (!response.ok) {
                        throw new Error('Failed to fetch weather data');
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
                setError('Unable to get location');
                setLoading(false);
            }
        );
    }, []);

    if (loading) return <div className="text-center text-gray-500">Loading weather...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow-lg w-full max-w-sm mx-auto">
            <h2 className="text-xl font-bold">
                {weatherData.name}
                {weatherData.sys?.country &&`, ${new Intl.DisplayNames(['en'], { type: 'region' }).of(weatherData.sys.country)}`
                }
            </h2>
            <p className="text-lg">
                {weatherData.weather[0].description}
            </p>
            <p className="text-4xl font-semibold">
                {Math.round(weatherData.main.temp)}°C
            </p>
            <p className="text-sm">
                Feels like: {Math.round(weatherData.main.feels_like)}°C
            </p>
            <p className="text-sm">
                Humidity: {weatherData.main.humidity}%
            </p>
        </div>
    );
}
