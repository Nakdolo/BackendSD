import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  idOrEmail!: string; // ID or email

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsBoolean()
  @IsOptional()
  rememberMe?: boolean;
}
