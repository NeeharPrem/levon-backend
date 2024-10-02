import express, { Request, Response, NextFunction } from 'express';
import { check } from 'express-validator';
import { getWeather } from '../controllers/weatherController';

const router = express.Router();

router.get(
    '/:query',
    [
        check('query')
            .isLength({ min: 1 })
            .withMessage('Search cannot be empty.')
            .isAlpha()
            .withMessage('Search should only contain letters'),
    ],
    async (req: Request, res: Response, next: NextFunction) => {
        await getWeather(req, res, next);
    }
);

export default router;