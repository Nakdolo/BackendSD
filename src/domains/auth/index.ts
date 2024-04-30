import { compareSync, genSaltSync, hashSync } from "bcryptjs";
import nodemailer, { SendMailOptions } from "nodemailer";
import { LoginDto } from "../../controllers/auth/dto/auth.dto";
import { passwordRecovoryDto } from "../../controllers/auth/dto/recovory.dto";
import { SignupDto } from "../../controllers/auth/dto/signup.dto";
import { IUser, UserData, UserModel, UserRole } from "../../data/user";
import { BadRequestException } from "../exception";
import { Token, TokenType } from "../token";

export type AuthResultType = {
  token: TokenType;
  userEmail: String;
  userRole: String;
  UserName: String;
  UserSurname: String;
  ID: String;
  phone: String;
};

export type findResultType = {
  userEmail: String;
  userRole: String;
  UserName: String;
  UserSurname: String;
  ID: String;
  phone: String;
};

export type findDataType = {
  ID: string;
  email: string;
  Name: string;
  surName: string;
};

export type AuthAddingResultType = {
  token: TokenType;
};

export type passwordForRecoveryType = {
  codeForRecovery: String;
  user: String;
};

export type resetPasswordType = {
  recoveryCode: string;
  savedRecevoryCode: string;
  password: string;
  email: string;
};

export type deleteUser = {
  ID: string;
};

export type gmailSentingMessageType = {
  from: String;
  to: String;
  subject: String;
  text: String;
};

export class Auth {
  public static async login(data: LoginDto): Promise<AuthResultType> {
    let user;

    if (data.idOrEmail.includes("@")) {
      user = await UserData.getUserByEmail(data.idOrEmail);
    } else {
      user = await UserData.getUserByIDD(data.idOrEmail);
    }

    if (!user) {
      throw new BadRequestException("Неверные учетные данные");
    }

    if (!this.comparePasswords(user.password, data.password)) {
      throw new BadRequestException("Неверные учетные данные");
    }

    const token = Token.signTokenForUser(
      {
        id: user._id,
      },
      {
        expiresIn: data.rememberMe ? "1h" : "6h",
      }
    );

    return {
      token,
      userEmail: user.email,
      userRole: user.userRole,
      UserName: user.name,
      UserSurname: user.surName,
      phone: user.phone,
      ID: user.ID,
    };
  }

  public static async findUser(data: findDataType): Promise<findResultType> {
    const user = await UserData.getUserByIDD(data.ID);

    if (!user) {
      throw new BadRequestException("User not found");
    }

    return {
      ID: user.ID,
      userEmail: user.email,
      userRole: user.userRole,
      UserName: user.name,
      UserSurname: user.surName,
      phone: user.phone,
    };
  }

  public static async signup(data: SignupDto): Promise<AuthResultType> {
    const userByEmail = await UserData.getUserByEmail(data.email);
    const userBYID = await UserData.getUserByIDD(data.ID);

    if (userBYID) {
      throw new BadRequestException("ID должен быть уникальным");
    }

    if (userByEmail) {
      throw new BadRequestException(
        "Пользователь с таким email уже существует"
      );
    }

    const hashPassword = this.hashPassword(data.password);

    const newUser = new UserModel({
      user: data.ID,
      email: data.email,
      password: hashPassword,
      name: data.name,
      surName: data.surName,
      phone: data.phone,
      userRole: data.userRole as UserRole,
    });

    await newUser.save();

    const token = Token.signTokenForUser(
      {
        id: newUser._id,
      },
      {
        expiresIn: "1h",
      }
    );
    return {
      token,
      userEmail: newUser.email,
      userRole: newUser.userRole,
      UserName: newUser.name,
      UserSurname: newUser.surName,
      phone: newUser.phone,
      ID: newUser.ID,
    };
  }

  public static async addUser(data: SignupDto): Promise<AuthAddingResultType> {
    const userByEmail = await UserData.getUserByEmail(data.email);
    const userBYID = await UserData.getUserByIDD(data.ID);

    if (userBYID) {
      throw new BadRequestException("ID должен быть уникальным");
    }

    if (userByEmail) {
      throw new BadRequestException(
        "Пользователь с таким email уже существует"
      );
    }

    const hashPassword = this.hashPassword(data.password);

    const newUser = new UserModel({
      ID: data.ID,
      email: data.email,
      password: hashPassword,
      name: data.name,
      surName: data.surName,
      phone: data.phone,
      userRole: data.userRole as UserRole,
    });

    await newUser.save();

    const token = Token.signTokenForUser(
      {
        id: newUser._id,
      },
      {
        expiresIn: "1h",
      }
    );
    return {
      token,
    };
  }

  public static async deleteUser(data: deleteUser): Promise<String> {
    const userByID = await UserData.getUserByIDD(data.ID);

    if (!userByID) {
      throw new BadRequestException(
        "Пользователь с идентификатором " + data.ID + " не был найден."
      );
    }

    await UserData.deleteUserByID(userByID.ID);

    return "Пользователь с идентификатором " + data.ID + " был успешно удален.";
  }

  public static async passwordRecovery(
    data: passwordRecovoryDto
  ): Promise<passwordForRecoveryType> {
    const user = await UserData.getUserByEmail(data.email);

    if (!user) {
      throw new BadRequestException("Неверные учетные данные");
    }

    const codeForRecovery = Token.generateToken(8);

    const mailOptions: SendMailOptions = {
      from: "kandoanimeg@gmail.com",
      to: user.email as string,
      subject: "Password Reset",
      text: `Sup bro.Code for reset your password: ${codeForRecovery}`,
    };

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "kandoanimeg@gmail.com",
        pass: "vsqv cqwn yrrq irbu",
      },
    });

    transporter.sendMail(mailOptions);

    return {
      codeForRecovery: codeForRecovery,
      user: user.email,
    };
  }

  public static async resetPassword(data: resetPasswordType): Promise<String> {
    const user = await UserData.getUserByEmail(data.email);
    if (!user) {
      throw new BadRequestException("Неверные учетные данные");
    }
    if (data.recoveryCode == data.savedRecevoryCode) {
      const hashPassword = this.hashPassword(data.password);
      user.password = hashPassword;
      await user.save();
    } else {
      throw new BadRequestException("Неверный код");
    }

    return "Password updated successfully";
  }

  private static comparePasswords(
    hashPassword: string,
    password: string
  ): boolean {
    return compareSync(password, hashPassword);
  }

  private static hashPassword(password: string): string {
    const salt = genSaltSync(10);

    return hashSync(password, salt);
  }
}
