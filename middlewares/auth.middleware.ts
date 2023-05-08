import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken'

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.body.token || req.query.token || req.headers["authorization"];

    if (!token)
        return res.status(403).send("The token is required for authentication");

    try {
        const decoded = verify(token, process.env.tokenKey as string);
    } catch (error) {
        return res.status(401).json("Invalid Token");
    }

    return next();
}