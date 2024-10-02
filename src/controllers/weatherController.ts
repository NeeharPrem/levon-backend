import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { validationResult } from 'express-validator';
import { ValidationError } from '../middleware/errorHandler';

interface WeatherCache {
    data: any;
    timestamp: number;
}

let cache: Record<string, WeatherCache> = {};
const cacheTime = 10 * 60 * 1000;

const fetchWeatherData = async (query: string): Promise<any> => {
    const apiKey = '15a98f3bec4f441e886144607240110';
    const url = `https://api.weatherapi.com/v1/current.json?q=${query}&key=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
};

export const getWeather = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }

    const { query } = req.params;

    if (cache[query] && (Date.now() - cache[query].timestamp < cacheTime)) {
        return res.json(cache[query].data);
    }

    try {
        const weatherData = await fetchWeatherData(query);
        cache[query] = {
            data: weatherData,
            timestamp: Date.now()
        };
        res.json(weatherData);
    } catch (error) {
        next(error);
    }
};