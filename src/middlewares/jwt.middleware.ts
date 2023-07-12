import { Response, Request, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface RequestWithUser extends Request {
  user?: { id: number };
}

export const jwtMiddleware = async (
  req: RequestWithUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) throw new Error('Token not found');

    const decode = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: number;
    };

    req.user = { id: decode.id };

    next();
  } catch (e: any) {
    res.status(400).send({ error: e.message });
  }
};
