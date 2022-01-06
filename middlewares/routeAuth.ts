import { NextFunction, Request, Response } from "express";
import { verifyToken } from "services/auth.service";

const routeAuth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers["access-token"]?.toString();
        
        // Will throw an error if token can't be verified.
        verifyToken(token);

        next();
    } catch (error : any) {
        res.statusMessage = error.message;
        res.status(401).send(error);
    }
}

export default routeAuth;