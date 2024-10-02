import { ParamsDictionary } from 'express-serve-static-core';
import { IUser } from '../../models/userModel';

declare global {
    namespace Express {
        interface Request<P extends ParamsDictionary = ParamsDictionary, ResBody = unknown, ReqBody = unknown, ReqQuery = Record<string, any>> {
            user?: IUser;
        }
    }
}
