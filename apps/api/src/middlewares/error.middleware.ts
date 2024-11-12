import { Request, Response, NextFunction } from "express";

export default function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
  res.status(500).send({
    message: err.message,
  });
};