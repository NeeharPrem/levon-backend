"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWeather = void 0;
const axios_1 = __importDefault(require("axios"));
const express_validator_1 = require("express-validator");
const errorHandler_1 = require("../middleware/errorHandler");
let cache = {};
const cacheTime = 10 * 60 * 1000;
const fetchWeatherData = async (query) => {
    const apiKey = '15a98f3bec4f441e886144607240110';
    const url = `https://api.weatherapi.com/v1/current.json?q=${query}&key=${apiKey}`;
    const response = await axios_1.default.get(url);
    return response.data;
};
const getWeather = async (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return next(new errorHandler_1.ValidationError('Validation error: ' + errors.array().map(err => err.msg).join(', ')));
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
    }
    catch (error) {
        next(error);
    }
};
exports.getWeather = getWeather;
