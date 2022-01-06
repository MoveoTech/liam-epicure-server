import jwt, { JwtPayload } from "jsonwebtoken";
import { config } from "config";
import { NextFunction, Request, Response } from "express";
import { UserModel } from "models/user.model";
import { Types } from "mongoose";

interface IJwtResult extends JwtPayload {
    id: string,
    username: string,
}

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["access-token"]?.toString();
        if (token) {
            const jwtResult = jwt.verify(token, config.JWT_KEY) as IJwtResult;
            if (jwtResult) {
                const user = await UserModel.findOne({ _id: new Types.ObjectId(jwtResult.id), status: 1 });
                if (user) {
                    if (user.token === token) {
                        return res.status(200).json(jwtResult);
                    }
                }
            }
        }
        next();
    } catch (error) {
        next();
    }
}

export default verifyToken;