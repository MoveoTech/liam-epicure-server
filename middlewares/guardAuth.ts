import { NextFunction, Request, Response } from "express";
import { verifyToken } from "services/auth.service";

const guardAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["access-token"]?.toString();

        const decodedToken = verifyToken(token);
        res.status(200).json(decodedToken);
    } catch (error: any) {
        res.statusMessage = error.message;
        res.status(401).send(error);
    }
}

export default guardAuth;