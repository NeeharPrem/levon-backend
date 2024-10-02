"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
const weatherController_1 = require("../controllers/weatherController");
const router = express_1.default.Router();
router.get('/:query', [
    (0, express_validator_1.check)('query')
        .isLength({ min: 1 })
        .withMessage('Search cannot be empty.')
        .isAlpha()
        .withMessage('Search should only contain letters'),
], async (req, res, next) => {
    await (0, weatherController_1.getWeather)(req, res, next);
});
exports.default = router;
