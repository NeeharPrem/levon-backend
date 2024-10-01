const axios = require('axios');
const { validationResult } = require('express-validator');
const { ValidationError } = require('../errorHandler');

let cache = {};
const cachetime = 10 * 60 * 1000;

const fetchWeatherData = async (query) => {
    const apiKey = '15a98f3bec4f441e886144607240110';
    const url = `https://api.weatherapi.com/v1/current.json?q=${query}&key=${apiKey}`;
    const response = await axios.get(url);
    return response.data;
};

exports.getWeather = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
    }

    const { query } = req.params;

    if (cache[query] && (Date.now() - cache[query].timestamp < cachetime)) {
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