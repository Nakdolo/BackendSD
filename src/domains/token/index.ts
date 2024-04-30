import { sign, SignOptions } from "jsonwebtoken";
import { Config } from "../config";
import bcrypt from "bcryptjs"

export type TokenType = {
  accessToken: string;
};

export type SignTokenForUserType = {
  id: string | number;
};

export class Token {
  public static signTokenForUser(
    data: SignTokenForUserType,
    options?: SignOptions
  ): TokenType {
    const payload = data;

    const accessToken = sign(
      payload,
      Config.clientAuthSecretOrPrivateKey,
      options
    );

    return {
      accessToken,
    };
  }

  public static generateToken(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}
