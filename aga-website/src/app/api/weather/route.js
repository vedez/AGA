import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// simple cache for OpenAI responses
// cache key format: `${weatherCondition}_${timeOfDay}_${language}`
// cache value: { suggestion, timestamp }
const suggestionCache = new Map();
const CACHE_DURATION = 2 * 60 * 60 * 1000; // 1 hours in ms

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const language = searchParams.get('language') || 'en';
  
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await weatherResponse.json();
    
    // ai suggestion if weather condition exists
    let suggestion = null;
    if (weatherData.weather && weatherData.weather[0] && process.env.OPENAI_API_KEY) {
      const weatherCondition = weatherData.weather[0].main;
      const weatherTemperature = weatherData.main.temp;
      
      // get current time
      const now = new Date();
      const hours = now.getHours();
      
      // create cache key
      const cacheKey = `${weatherCondition}_${weatherTemperature}_${hours}_${language}`;
      
      // check if we have a valid cached suggestion
      const cachedData = suggestionCache.get(cacheKey);
      if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
        suggestion = cachedData.suggestion;
      } else {
        const openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        
        try {
          const prompt = `It's currently ${weatherCondition} outside, ${weatherTemperature}°C and ${hours} military time. In 10 words or less, please advice the user on what to wear or bring with them? Add personality using emojis. Respond in ${language} language.`;
          const aiResponse = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 50,
          });
          
          suggestion = aiResponse.choices[0].message.content;
          
          // cache the result
          suggestionCache.set(cacheKey, {
            suggestion,
            timestamp: Date.now()
          });
        } catch (error) {
          console.error('Error fetching AI suggestion:', error);
        }
      }
    }
    
    return NextResponse.json({
      weatherData,
      suggestion
    });
    
  } catch (error) {
    console.error('api route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 