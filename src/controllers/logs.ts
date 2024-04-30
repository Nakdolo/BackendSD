import { NextFunction, Request, Response } from "express";

export const requestLogs = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  try {
    console.log(`NEW REQUEST | ${new Date()}`);
    console.log(`${req.method} - ${req.url}`);
    console.log("-----------------------------------------------");
  } catch (e) {
    console.log(e);
  } finally {
    next();
  }
};
