import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  
  if (!lat || !lon) {
    return NextResponse.json({ error: 'Latitude and longitude are required' }, { status: 400 });
  }

  try {
    // Fetch weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`
    );
    
    if (!weatherResponse.ok) {
      throw new Error('Failed to fetch weather data');
    }
    
    const weatherData = await weatherResponse.json();
    
    // Generate AI suggestion if weather condition exists
    let suggestion = null;
    if (weatherData.weather && weatherData.weather[0] && process.env.OPENAI_API_KEY) {
      const weatherCondition = weatherData.weather[0].main;
      
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      
      try {
        const prompt = `It's currently ${weatherCondition} outside. In one short line, please advice the user on what to wear or bring with them?`;
        const aiResponse = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 50,
        });
        
        suggestion = aiResponse.choices[0].message.content;
      } catch (error) {
        console.error('Error fetching AI suggestion:', error);
      }
    }
    
    // Return combined data
    return NextResponse.json({
      weatherData,
      suggestion
    });
    
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 