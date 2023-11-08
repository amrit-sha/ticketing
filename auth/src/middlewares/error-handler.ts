import { Response, Request, NextFunction } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    return res.status(err.statusCode).send({ error: err.serializeErrors() });
  }

  console.log(err);
  res.status(400).send({
    errors: [{ message: "something went wrong" }],
  });
};
