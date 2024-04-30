import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { HttpException } from "../domains/exception";

export const httpErrors: ErrorRequestHandler = (
  err: ErrorRequestHandler,
  _req: Request,
  res: Response,

  _next: NextFunction
) => {
  console.log(err);

  if (err instanceof HttpException) {
    res
      .status(err.status)
      .send({
        statusCode: err.status,
        message: err.message,
      })
      .end();

    return;
  }

  res
    .status(500)
    .send({
      statusCode: 500,
      message: "Internal Server Error",
    })
    .end();
};
