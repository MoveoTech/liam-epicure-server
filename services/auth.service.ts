import jwt from "jsonwebtoken";
import { config } from "configFile";

export const verifyToken = (token: string | undefined): string | jwt.JwtPayload => {
    if (!token) {
        throw new Error("A token is required for authentication");
    }

    // If not verified - will throw an error 'jwt malformed'
    return jwt.verify(token, config.JWT_KEY);
}