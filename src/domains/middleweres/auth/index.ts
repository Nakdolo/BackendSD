import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { LoginDto } from "../../../controllers/auth/dto/auth.dto";
import { passwordRecovoryDto } from "../../../controllers/auth/dto/recovory.dto";
import { Config } from "../../config";
import { BadRequestException, UnauthorizedException } from "../../exception";
import { Utils } from "../../../utils";
import { SignupDto } from "../../../controllers/auth/dto/signup.dto";

export class AuthMiddleware {
  public static async verifyClientAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const headers = req.headers.authorization || "";
    const arr = headers.split(" ");

    if (arr.length !== 2) {
      throw new UnauthorizedException();
    }

    const tokenType = arr[0];
    const token = arr[1];

    if (tokenType !== "Bearer") {
      throw new UnauthorizedException();
    }

    try {
      const verifyResult: any = verify(
        token,
        Config.clientAuthSecretOrPrivateKey
      );

      req.body.user = verifyResult;

      return next();
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException();
    }
  }

  public static async verifyLoginData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dto: LoginDto = plainToClass(LoginDto, req.body);

    const errorTexts: string[] = Utils.getErrorMessages(await validate(dto));

    if (errorTexts.length > 0) {
      throw new BadRequestException(errorTexts);
    }

    next();
  }

  public static async verifyRecovoryData(
    req: Request,
    res: Response,
    next: NextFunction
  ) : Promise<void> {
    const dto:passwordRecovoryDto = plainToClass(passwordRecovoryDto, req.body);

    const errorTexts : string[] = Utils.getErrorMessages(await validate(dto))

    if (errorTexts.length > 0) {
      throw new BadRequestException(errorTexts);
    }

    next();
  }

  public static async verifySignupData(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const dto: SignupDto = plainToClass(SignupDto, req.body);

    const errorTexts: string[] = Utils.getErrorMessages(await validate(dto));

    if (errorTexts.length > 0) {
      throw new BadRequestException(errorTexts);
    }

    next();
  }
}
